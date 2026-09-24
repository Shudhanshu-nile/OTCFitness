import {
  AuthorizationRequestStatus,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  queryCategorySamples,
  queryQuantitySamples,
  querySources,
  queryWorkoutSamples,
  queryWorkoutSamplesWithAnchor,
  requestAuthorization,
  WorkoutTypeIdentifier,
  type ObjectTypeIdentifier,
} from '@kingstinct/react-native-healthkit';
import {
  getAnchor,
  getLastSyncAt,
  loadWorkoutLog,
  mergeWorkouts,
  setAnchor,
  StoredWorkout,
  dayKey,
  loadRestingHrLog,
  loadSleepLog,
  mergeRestingHr,
  mergeSleep,
} from './healthStore';

/**
 * Apple Health is the bridge the mockup describes: Garmin Connect writes the
 * watch's workouts into HealthKit, and we read them back out. There is no
 * direct Garmin API here — that would need a server to receive their webhooks.
 */

/** Garmin Connect's bundle id and display name both carry this. */
const GARMIN_MATCH = /garmin/i;

/** Everything the app reads. Sleep and resting HR feed the Today tiles. */
const READ_TYPES: readonly ObjectTypeIdentifier[] = [
  WorkoutTypeIdentifier,
  'HKQuantityTypeIdentifierHeartRate',
  'HKQuantityTypeIdentifierRestingHeartRate',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKCategoryTypeIdentifierSleepAnalysis',
  // The iPhone records these itself, so tracking still works with no band.
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierAppleExerciseTime',
];

export type HealthSourceInfo = {
  name: string;
  bundleIdentifier: string;
  /** End of the most recent workout this source wrote. */
  lastSync: Date | null;
};

export type HealthSnapshot = {
  /** HealthKit exists here (false on Android and some iPads). */
  supported: boolean;
  /** The permission sheet has been shown at least once. */
  asked: boolean;
  garmin: HealthSourceInfo | null;
  sources: HealthSourceInfo[];
  /** Most recent workout from any source. */
  lastWorkout: Date | null;
  error: string | null;
};

export const UNSUPPORTED: HealthSnapshot = {
  supported: false,
  asked: false,
  garmin: null,
  sources: [],
  lastWorkout: null,
  error: null,
};

export const isHealthAvailable = () => isHealthDataAvailable();

/** Opens the HealthKit sheet. Resolves once the athlete dismisses it. */
export const requestHealthAccess = async (): Promise<boolean> => {
  if (!isHealthAvailable()) {
    return false;
  }

  try {
    return await requestAuthorization({ toRead: READ_TYPES });
  } catch {
    return false;
  }
};

/**
 * Reads which sources have written workouts, and when each last did.
 *
 * iOS deliberately never tells an app whether *read* access was granted, so
 * `asked` only means the sheet has been shown. A refusal looks exactly like
 * having no data — the UI must not claim the athlete said no.
 */
export const readHealthSources = async (): Promise<HealthSnapshot> => {
  if (!isHealthAvailable()) {
    return UNSUPPORTED;
  }

  try {
    const status = await getRequestStatusForAuthorization({
      toRead: READ_TYPES,
    });
    const asked = status === AuthorizationRequestStatus.unnecessary;

    if (!asked) {
      return { ...UNSUPPORTED, supported: true };
    }

    const [sourceProxies, workouts] = await Promise.all([
      querySources(WorkoutTypeIdentifier),
      queryWorkoutSamples({ limit: 100, ascending: false }),
    ]);

    // Latest workout end date per source bundle id.
    const lastByBundle = new Map<string, Date>();
    let lastWorkout: Date | null = null;

    for (const workout of workouts) {
      const bundle = workout.sourceRevision?.source?.bundleIdentifier;
      const end = workout.endDate;
      if (!end) {
        continue;
      }

      if (!lastWorkout || end > lastWorkout) {
        lastWorkout = end;
      }

      if (bundle) {
        const seen = lastByBundle.get(bundle);
        if (!seen || end > seen) {
          lastByBundle.set(bundle, end);
        }
      }
    }

    const sources: HealthSourceInfo[] = sourceProxies.map(s => ({
      name: s.name,
      bundleIdentifier: s.bundleIdentifier,
      lastSync: lastByBundle.get(s.bundleIdentifier) ?? null,
    }));

    const garmin =
      sources.find(
        s => GARMIN_MATCH.test(s.bundleIdentifier) || GARMIN_MATCH.test(s.name),
      ) ?? null;

    return {
      supported: true,
      asked,
      garmin,
      sources,
      lastWorkout,
      error: null,
    };
  } catch (e) {
    return {
      ...UNSUPPORTED,
      supported: true,
      error: e instanceof Error ? e.message : 'Could not read Apple Health',
    };
  }
};

/* ---------------------------------------------------------------------------
   Analytics — everything the Progress screen draws, computed from HealthKit.
--------------------------------------------------------------------------- */

/**
 * HKWorkoutActivityType raw values we care about. Compared numerically so the
 * generated enum does not have to be imported.
 * @see https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype
 */
const ACTIVITY: Record<number, TrainingDiscipline> = {
  13: 'bike', // cycling
  20: 'strength', // functionalStrengthTraining
  37: 'run', // running
  46: 'swim', // swimming
  50: 'strength', // traditionalStrengthTraining
  52: 'run', // walking — counted with run so it is not silently dropped
};

/**
 * HKCategoryValueSleepAnalysis values that mean actually asleep.
 * 0 = inBed and 2 = awake are excluded so time in bed is not counted twice.
 */
const ASLEEP_VALUES = new Set([1, 3, 4, 5]);

export type TrainingDiscipline = 'swim' | 'bike' | 'run' | 'strength' | 'other';

export type WeekVolume = {
  label: string;
  minutes: Record<TrainingDiscipline, number>;
  total: number;
};

export type TrainingSummary = {
  supported: boolean;
  asked: boolean;
  /** Oldest first. */
  weeks: WeekVolume[];
  sessions: number;
  totalMinutes: number;
  /** Weekly samples of rolling load, oldest first, in minutes. */
  load7: number[];
  load28: number[];
  avgSleepMinutes: number | null;
  restingHeartRate: number | null;
  /** Nights of sleep and resting-HR readings held on this device. */
  storedNights: number;
  storedHrReadings: number;
  /** Everything across all three logs still owed to the API. */
  unsyncedTotal: number;
  /** Daily averages from the phone itself, over the last 7 days. */
  avgDailySteps: number | null;
  avgDailyExerciseMinutes: number | null;
  /** How many sessions this device is holding, and how many the API still owes. */
  storedSessions: number;
  unsyncedSessions: number;
  lastSyncAt: Date | null;
  error: string | null;
};

export const EMPTY_SUMMARY: TrainingSummary = {
  supported: false,
  asked: false,
  weeks: [],
  sessions: 0,
  totalMinutes: 0,
  load7: [],
  load28: [],
  avgSleepMinutes: null,
  restingHeartRate: null,
  storedNights: 0,
  storedHrReadings: 0,
  unsyncedTotal: 0,
  avgDailySteps: null,
  avgDailyExerciseMinutes: null,
  storedSessions: 0,
  unsyncedSessions: 0,
  lastSyncAt: null,
  error: null,
};

const WEEKS = 6;
/** How far back the device keeps its own copy of the band's sessions. */
const HISTORY_DAYS = 180;
/** Rolling window re-derived on every sync for sleep and resting HR. */
const METRIC_WINDOW_DAYS = 30;
/** Nights the Avg sleep tile averages over. */
const SLEEP_AVG_NIGHTS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const emptyMinutes = (): Record<TrainingDiscipline, number> => ({
  swim: 0,
  bike: 0,
  run: 0,
  strength: 0,
  other: 0,
});

/** Midnight at the start of the day `daysAgo` days back. */
const dayStart = (daysAgo: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return new Date(d.getTime() - daysAgo * DAY_MS);
};

/**
 * Pulls whatever the band has added since last time and files it on the device.
 *
 * Uses HealthKit's anchor so each call only asks for what changed — the first
 * run brings the history, every run after that is a delta. Workouts HealthKit
 * reports as deleted are removed from our copy too.
 */
export const syncWorkoutsFromDevice = async (): Promise<StoredWorkout[]> => {
  const anchor = await getAnchor();

  const res = await queryWorkoutSamplesWithAnchor({
    limit: 0,
    anchor: anchor ?? undefined,
    filter: { date: { startDate: dayStart(HISTORY_DAYS) } },
  });

  const incoming: StoredWorkout[] = [];
  for (const w of res.workouts) {
    const minutes = (w.duration?.quantity ?? 0) / 60;
    const start = w.startDate;
    const end = w.endDate;
    if (minutes <= 0 || !start || !end || !w.uuid) {
      continue;
    }

    incoming.push({
      uuid: w.uuid,
      start: start.toISOString(),
      end: end.toISOString(),
      minutes,
      discipline: ACTIVITY[Number(w.workoutActivityType)] ?? 'other',
      sourceName: w.sourceRevision?.source?.name ?? 'Unknown',
      bundleId: w.sourceRevision?.source?.bundleIdentifier ?? '',
      synced: false,
    });
  }

  const deleted = res.deletedSamples
    .map(d => (d as { uuid?: string }).uuid)
    .filter((u): u is string => !!u);

  const { log } = await mergeWorkouts(incoming, deleted);

  if (res.newAnchor) {
    await setAnchor(res.newAnchor);
  }

  return log;
};

export const readTrainingSummary = async (): Promise<TrainingSummary> => {
  if (!isHealthAvailable()) {
    return EMPTY_SUMMARY;
  }

  try {
    const status = await getRequestStatusForAuthorization({
      toRead: READ_TYPES,
    });
    const asked = status === AuthorizationRequestStatus.unnecessary;
    if (!asked) {
      return { ...EMPTY_SUMMARY, supported: true };
    }

    // 42 days covers the 6 week bars; 28 more so the first 28-day load point
    // is a real average rather than a partial one.
    const windowStart = dayStart(WEEKS * 7 + 28);

    // The bars are built from our own stored copy, not a fresh query, so the
    // screen still works offline and matches what we would send to the API.
    const [log, sleep, resting, steps, exercise] = await Promise.all([
      syncWorkoutsFromDevice().catch(() => loadWorkoutLog()),
      queryCategorySamples('HKCategoryTypeIdentifierSleepAnalysis', {
        limit: 0,
        filter: { date: { startDate: dayStart(METRIC_WINDOW_DAYS) } },
      }),
      queryQuantitySamples('HKQuantityTypeIdentifierRestingHeartRate', {
        limit: 0,
        ascending: false,
        unit: 'count/min',
        filter: { date: { startDate: dayStart(METRIC_WINDOW_DAYS) } },
      }),
      queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
        limit: 0,
        unit: 'count',
        filter: { date: { startDate: dayStart(7) } },
      }),
      queryQuantitySamples('HKQuantityTypeIdentifierAppleExerciseTime', {
        limit: 0,
        unit: 'min',
        filter: { date: { startDate: dayStart(7) } },
      }),
    ]);

    const sumQuantities = (samples: readonly { quantity: number }[]) =>
      samples.reduce((a, b) => a + (b.quantity ?? 0), 0);

    // Averaged over 7 days so a part-finished today does not drag it down.
    const avgDailySteps = steps.length ? sumQuantities(steps) / 7 : null;
    const avgDailyExerciseMinutes = exercise.length
      ? sumQuantities(exercise) / 7
      : null;

    // ---- per-day minutes, keyed by days-ago ----
    const minutesByDayAgo = new Map<number, number>();
    const weeks: WeekVolume[] = Array.from({ length: WEEKS }, (_, i) => ({
      label: `W${i + 1}`,
      minutes: emptyMinutes(),
      total: 0,
    }));

    let sessions = 0;
    let totalMinutes = 0;
    const barsStart = dayStart(WEEKS * 7).getTime();

    const windowStartMs = windowStart.getTime();

    for (const w of log) {
      const minutes = w.minutes;
      const end = new Date(w.end).getTime();
      if (minutes <= 0 || Number.isNaN(end) || end < windowStartMs) {
        continue;
      }

      // Compare midnight to midnight. Measuring from today's midnight to a
      // timestamp later today gives a negative age, which drops the session
      // out of every bucket — that is what made today's sessions vanish.
      const endDay = new Date(end);
      endDay.setHours(0, 0, 0, 0);
      const daysAgo = Math.round(
        (dayStart(0).getTime() - endDay.getTime()) / DAY_MS,
      );
      minutesByDayAgo.set(
        daysAgo,
        (minutesByDayAgo.get(daysAgo) ?? 0) + minutes,
      );

      if (end < barsStart) {
        continue; // only in the 28-day warm-up window, not in the bars
      }

      sessions += 1;
      totalMinutes += minutes;

      const discipline = w.discipline;
      // daysAgo 0-6 is the newest week, which is the last bar.
      const weekIndex = WEEKS - 1 - Math.floor(daysAgo / 7);
      const bucket = weeks[weekIndex];
      if (bucket) {
        bucket.minutes[discipline] += minutes;
        bucket.total += minutes;
      }
    }

    const sumRange = (fromDaysAgo: number, days: number) => {
      let total = 0;
      for (let d = fromDaysAgo; d < fromDaysAgo + days; d += 1) {
        total += minutesByDayAgo.get(d) ?? 0;
      }
      return total;
    };

    // Seven weekly samples, oldest first: 7-day load vs the 28-day weekly average.
    const load7: number[] = [];
    const load28: number[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const from = i * 7;
      load7.push(sumRange(from, 7));
      load28.push(sumRange(from, 28) / 4);
    }

    // ---- sleep: asleep minutes per night, filed by the day it started ----
    const sleepByDate = new Map<string, number>();
    for (const s of sleep) {
      if (!ASLEEP_VALUES.has(Number(s.value))) {
        continue;
      }
      const start = s.startDate?.getTime();
      const end = s.endDate?.getTime();
      if (!start || !end || end <= start) {
        continue;
      }
      const key = dayKey(new Date(start));
      sleepByDate.set(key, (sleepByDate.get(key) ?? 0) + (end - start) / 60000);
    }

    // ---- resting HR: the last reading of each day ----
    const hrByDate = new Map<string, number>();
    for (const r of resting) {
      const at = r.startDate ?? r.endDate;
      if (!at || !Number.isFinite(r.quantity)) {
        continue;
      }
      const key = dayKey(new Date(at));
      if (!hrByDate.has(key)) {
        hrByDate.set(key, r.quantity); // query is newest-first
      }
    }

    const [sleepLog, hrLog] = await Promise.all([
      mergeSleep(
        [...sleepByDate.entries()].map(([date, value]) => ({ date, value })),
      ).catch(() => loadSleepLog()),
      mergeRestingHr(
        [...hrByDate.entries()].map(([date, value]) => ({ date, value })),
      ).catch(() => loadRestingHrLog()),
    ]);

    // Averaged from the stored history, so it survives offline like the bars.
    const recentNights = sleepLog.slice(0, SLEEP_AVG_NIGHTS);
    const avgSleepMinutes = recentNights.length
      ? recentNights.reduce((a, b) => a + b.value, 0) / recentNights.length
      : null;

    return {
      supported: true,
      asked,
      weeks,
      sessions,
      totalMinutes,
      load7,
      load28,
      avgSleepMinutes,
      restingHeartRate: hrLog[0]?.value ?? null,
      storedNights: sleepLog.length,
      storedHrReadings: hrLog.length,
      unsyncedTotal:
        log.filter(w => !w.synced).length +
        sleepLog.filter(d => !d.synced).length +
        hrLog.filter(d => !d.synced).length,
      avgDailySteps,
      avgDailyExerciseMinutes,
      storedSessions: log.length,
      unsyncedSessions: log.filter(w => !w.synced).length,
      lastSyncAt: await getLastSyncAt(),
      error: null,
    };
  } catch (e) {
    return {
      ...EMPTY_SUMMARY,
      supported: true,
      error: e instanceof Error ? e.message : 'Could not read Apple Health',
    };
  }
};
