import { getItem, setItem } from '../utils/storage';
import type { TrainingDiscipline } from './health';

/**
 * The device's own record of what the band has reported.
 *
 * HealthKit already keeps the athlete's full history, so this is not a backup —
 * it is our copy: it survives offline, it is what the Progress screen is built
 * from, and it is the queue the API will drain once it exists. Each workout is
 * kept once, keyed by its HealthKit uuid, with a `synced` flag.
 */

export const HealthStoreKeys = {
  /** HealthKit anchor, so each sync only asks for what changed. */
  anchor: '@otcf/health-anchor',
  workouts: '@otcf/workout-log',
  lastSyncAt: '@otcf/health-last-sync',
  sleep: '@otcf/sleep-log',
  restingHr: '@otcf/resting-hr-log',
} as const;

export type StoredWorkout = {
  uuid: string;
  /** ISO strings — JSON has no Date type. */
  start: string;
  end: string;
  minutes: number;
  discipline: TrainingDiscipline;
  sourceName: string;
  bundleId: string;
  /** Flips to true once a backend has accepted it. */
  synced: boolean;
};

/** Newest-first cap, so the log cannot grow without bound. */
const MAX_STORED = 1000;

export const loadWorkoutLog = async (): Promise<StoredWorkout[]> => {
  const raw = await getItem(HealthStoreKeys.workouts);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredWorkout[]) : [];
  } catch {
    // A corrupt log should not take the screen down; start clean.
    return [];
  }
};

const persist = async (log: StoredWorkout[]) => {
  const trimmed = [...log]
    .sort((a, b) => b.end.localeCompare(a.end))
    .slice(0, MAX_STORED);
  await setItem(HealthStoreKeys.workouts, JSON.stringify(trimmed));
  return trimmed;
};

/**
 * Merges a sync's results into the log: new workouts are added, ones HealthKit
 * reports as deleted are dropped, and anything already known keeps its
 * `synced` flag so we never re-send it.
 */
export const mergeWorkouts = async (
  incoming: StoredWorkout[],
  deletedUuids: string[] = [],
): Promise<{ log: StoredWorkout[]; added: number; removed: number }> => {
  const existing = await loadWorkoutLog();
  const byUuid = new Map(existing.map(w => [w.uuid, w]));

  let added = 0;
  for (const w of incoming) {
    const prior = byUuid.get(w.uuid);
    if (prior) {
      byUuid.set(w.uuid, { ...w, synced: prior.synced });
    } else {
      byUuid.set(w.uuid, w);
      added += 1;
    }
  }

  let removed = 0;
  for (const uuid of deletedUuids) {
    if (byUuid.delete(uuid)) {
      removed += 1;
    }
  }

  const log = await persist([...byUuid.values()]);
  await setItem(HealthStoreKeys.lastSyncAt, new Date().toISOString());

  return { log, added, removed };
};

export const getAnchor = () => getItem(HealthStoreKeys.anchor);

export const setAnchor = (anchor: string) =>
  setItem(HealthStoreKeys.anchor, anchor);

export const getLastSyncAt = async (): Promise<Date | null> => {
  const raw = await getItem(HealthStoreKeys.lastSyncAt);
  if (!raw) {
    return null;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Records a session the athlete entered by hand.
 *
 * These live in the same log as the band's sessions and go to the API the same
 * way. A HealthKit sync never removes them: `mergeWorkouts` only deletes uuids
 * HealthKit itself reports as deleted, and these uuids are ours.
 */
export const addManualWorkout = async (entry: {
  start: Date;
  minutes: number;
  discipline: TrainingDiscipline;
}): Promise<StoredWorkout> => {
  const end = new Date(entry.start.getTime() + entry.minutes * 60000);

  const workout: StoredWorkout = {
    uuid: `manual-${entry.start.getTime()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    start: entry.start.toISOString(),
    end: end.toISOString(),
    minutes: entry.minutes,
    discipline: entry.discipline,
    sourceName: 'Added by hand',
    bundleId: 'manual',
    synced: false,
  };

  await mergeWorkouts([workout]);
  return workout;
};

/* ---------------------------------------------------------------------------
   Daily metrics — sleep and resting heart rate.

   These are not events with ids like workouts, they are one value per day, so
   they are keyed by date and re-derived over a rolling window on every sync.
   That is deliberate: a night's sleep can be revised hours later and a watch
   can back-fill, and an upsert by date heals both. A value that actually
   changed goes back in the sync queue so the correction reaches the API.
--------------------------------------------------------------------------- */

export type DailyMetric = {
  /** YYYY-MM-DD, local time. */
  date: string;
  /** Minutes asleep, or bpm. */
  value: number;
  synced: boolean;
};

/** A year is plenty of history and stays small in storage. */
const MAX_DAYS = 365;

export const dayKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const loadDaily = async (key: string): Promise<DailyMetric[]> => {
  const raw = await getItem(key);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DailyMetric[]) : [];
  } catch {
    return [];
  }
};

export const loadSleepLog = () => loadDaily(HealthStoreKeys.sleep);
export const loadRestingHrLog = () => loadDaily(HealthStoreKeys.restingHr);

const mergeDaily = async (
  key: string,
  incoming: { date: string; value: number }[],
): Promise<DailyMetric[]> => {
  const existing = await loadDaily(key);
  const byDate = new Map(existing.map(d => [d.date, d]));

  for (const next of incoming) {
    const prior = byDate.get(next.date);
    if (prior && Math.round(prior.value) === Math.round(next.value)) {
      continue; // unchanged — leave its synced flag alone
    }
    byDate.set(next.date, { ...next, synced: false });
  }

  const merged = [...byDate.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_DAYS);

  await setItem(key, JSON.stringify(merged));
  return merged;
};

export const mergeSleep = (incoming: { date: string; value: number }[]) =>
  mergeDaily(HealthStoreKeys.sleep, incoming);

export const mergeRestingHr = (incoming: { date: string; value: number }[]) =>
  mergeDaily(HealthStoreKeys.restingHr, incoming);

/** Sleep and resting HR still owed to the API. */
export const unsyncedDailyMetrics = async (): Promise<{
  sleep: DailyMetric[];
  restingHr: DailyMetric[];
}> => {
  const [sleep, restingHr] = await Promise.all([
    loadSleepLog(),
    loadRestingHrLog(),
  ]);
  return {
    sleep: sleep.filter(d => !d.synced),
    restingHr: restingHr.filter(d => !d.synced),
  };
};

export const markDailyMetricsSynced = async (
  kind: 'sleep' | 'restingHr',
  dates: string[],
): Promise<void> => {
  if (!dates.length) {
    return;
  }
  const key =
    kind === 'sleep' ? HealthStoreKeys.sleep : HealthStoreKeys.restingHr;
  const done = new Set(dates);
  const log = await loadDaily(key);
  await setItem(
    key,
    JSON.stringify(
      log.map(d => (done.has(d.date) ? { ...d, synced: true } : d)),
    ),
  );
};

/** The queue for the API: everything a backend has not acknowledged. */
export const unsyncedWorkouts = async (): Promise<StoredWorkout[]> => {
  const log = await loadWorkoutLog();
  return log.filter(w => !w.synced);
};

/** Call after the API accepts a batch, so it is not sent twice. */
export const markSynced = async (uuids: string[]): Promise<void> => {
  if (!uuids.length) {
    return;
  }
  const done = new Set(uuids);
  const log = await loadWorkoutLog();
  await persist(log.map(w => (done.has(w.uuid) ? { ...w, synced: true } : w)));
};
