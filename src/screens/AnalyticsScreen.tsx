import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  Circle,
} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import SectionTitle from '../components/SectionTitle';
import ChipRow from '../components/Chip';
import StatTile from '../components/StatTile';
import WeekBars, { BarDay } from '../components/WeekBars';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { useTrainingSummary } from '../hooks/useTrainingSummary';
import type { TrainingSummary } from '../services/health';
import { formatRelative } from '../utils/time';

/**
 * 13 — ANALYTICS (otcf-app.js → `analytics`).
 *
 * The numbers come off the athlete's own device: the band writes into Apple
 * Health and `readTrainingSummary()` reads it back out. Until a band has synced
 * anything, the screen falls back to `SAMPLE` so it is not an empty shell —
 * that state is badged, so sample numbers are never mistaken for real ones.
 */

const VIEWS = ['Combined', 'Training', 'Health', 'Nutrition'];

const LEGEND: (keyof typeof DISCIPLINE)[] = ['swim', 'bike', 'run', 'strength'];

/** Shown only when the device has no workouts yet. Always badged. */
const SAMPLE: TrainingSummary = {
  supported: true,
  asked: true,
  weeks: [
    {
      label: 'W1',
      minutes: { swim: 22, bike: 38, run: 26, strength: 12, other: 0 },
      total: 98,
    },
    {
      label: 'W2',
      minutes: { swim: 26, bike: 44, run: 30, strength: 12, other: 0 },
      total: 112,
    },
    {
      label: 'W3',
      minutes: { swim: 24, bike: 52, run: 28, strength: 10, other: 0 },
      total: 114,
    },
    {
      label: 'W4',
      minutes: { swim: 18, bike: 30, run: 22, strength: 8, other: 0 },
      total: 78,
    },
    {
      label: 'W5',
      minutes: { swim: 30, bike: 58, run: 34, strength: 14, other: 0 },
      total: 136,
    },
    {
      label: 'W6',
      minutes: { swim: 32, bike: 64, run: 36, strength: 14, other: 0 },
      total: 146,
    },
  ],
  sessions: 24,
  totalMinutes: 684,
  load7: [98, 112, 114, 78, 136, 146, 152],
  load28: [90, 96, 100, 100, 110, 118, 128],
  avgSleepMinutes: 432,
  restingHeartRate: 48,
  avgDailySteps: 8400,
  avgDailyExerciseMinutes: 38,
  storedSessions: 0,
  unsyncedSessions: 0,
  storedNights: 0,
  storedHrReadings: 0,
  unsyncedTotal: 0,
  lastSyncAt: null,
  error: null,
};

/** For prose — carries its own unit, e.g. "2h 32m". */
const formatDuration = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) {
    return '—';
  }
  const whole = Math.round(minutes);
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  return h ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`;
};

/** For StatTile, which renders the trailing unit itself. */
const formatMinutes = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) {
    return '—';
  }
  const whole = Math.round(minutes);
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  return h ? `${h}h ${m.toString().padStart(2, '0')}` : `${m}`;
};

/** Builds one load line inside a 320×104 viewBox. */
const linePath = (values: number[], max: number) => {
  if (values.length < 2) {
    return '';
  }
  const step = 320 / (values.length - 1);
  return values
    .map((v, i) => {
      const y = 96 - (max > 0 ? (v / max) * 84 : 0);
      return `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};

const AnalyticsScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { summary, loading, connect, refresh } = useTrainingSummary();

  // Coming back from Log a session should show it immediately.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );
  const [view, setView] = useState('Combined');

  const showTraining = view === 'Combined' || view === 'Training';
  const showHealth = view === 'Combined' || view === 'Health';
  const showNutrition = view === 'Combined' || view === 'Nutrition';

  // Real data whenever the band has given us something; sample otherwise.
  const isSample = summary.sessions === 0;
  const data = isSample ? SAMPLE : summary;

  const bars: BarDay[] = useMemo(
    () =>
      data.weeks.map(w => ({
        label: w.label,
        segments: [
          ['swim', w.minutes.swim],
          ['bike', w.minutes.bike],
          ['run', w.minutes.run],
          ['strength', w.minutes.strength],
        ] as BarDay['segments'],
      })),
    [data.weeks],
  );

  const barMax = useMemo(
    () => Math.max(60, ...data.weeks.map(w => w.total)),
    [data.weeks],
  );

  const loadMax = useMemo(
    () => Math.max(1, ...data.load7, ...data.load28),
    [data.load7, data.load28],
  );

  const needsConnect = summary.supported && !summary.asked;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar
        title="Progress"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
            <Icon name="tune-variant" size={17} color={colors.text2} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChipRow options={VIEWS} selected={view} onSelect={setView} />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <>
            {/* Never let sample numbers read as the athlete's own. */}
            {needsConnect ? (
              <View style={styles.banner}>
                <Icon name="watch-variant" size={16} color={colors.accent} />
                <Text style={styles.bannerText}>
                  Connect Apple Health and your band's sessions fill this
                  screen.
                </Text>
                <View style={styles.bannerAction}>
                  <Button label="Connect" onPress={connect} />
                </View>
              </View>
            ) : isSample ? (
              <View style={styles.banner}>
                <Icon
                  name="information-outline"
                  size={16}
                  color={colors.text3}
                />
                <Text style={styles.bannerText}>
                  {summary.error
                    ? summary.error
                    : 'Sample data — nothing from your band yet. Real sessions replace this automatically.'}
                </Text>
              </View>
            ) : null}

            {showTraining ? (
              <>
                <SectionTitle title="Training volume" action="by discipline" />

                <View style={styles.card}>
                  <WeekBars days={bars} max={barMax} legend={LEGEND} />
                </View>

                <View style={styles.tiles}>
                  <StatTile
                    icon="check-circle-outline"
                    label="Sessions"
                    value={`${data.sessions}`}
                    delta="Last 6 weeks"
                  />
                  <StatTile
                    icon="chart-bar"
                    label="Total time"
                    value={formatMinutes(data.totalMinutes)}
                    unit="m"
                    delta="From your device"
                  />
                </View>

                <View style={styles.logBtn}>
                  <Button
                    label="Log a session"
                    variant="secondary"
                    iconLeft="plus"
                    onPress={() => navigation.navigate(ScreenNames.LogSession)}
                  />
                </View>

                <SectionTitle title="Load & recovery" />

                <View style={styles.card}>
                  <View style={styles.chart}>
                    <Svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 320 104"
                      preserveAspectRatio="none"
                    >
                      <Defs>
                        <LinearGradient
                          id="loadFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <Stop
                            offset="0"
                            stopColor={colors.accent}
                            stopOpacity="0.28"
                          />
                          <Stop
                            offset="1"
                            stopColor={colors.accent}
                            stopOpacity="0"
                          />
                        </LinearGradient>
                      </Defs>

                      <Path
                        d={`${linePath(data.load7, loadMax)} L320,104 L0,104 Z`}
                        fill="url(#loadFill)"
                      />
                      <Path
                        d={linePath(data.load28, loadMax)}
                        fill="none"
                        stroke={colors.text3}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                      />
                      <Path
                        d={linePath(data.load7, loadMax)}
                        fill="none"
                        stroke={colors.accent}
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Circle
                        cx={320}
                        cy={
                          96 -
                          ((data.load7[data.load7.length - 1] ?? 0) / loadMax) *
                            84
                        }
                        r={4.5}
                        fill={colors.accent}
                      />
                    </Svg>
                  </View>

                  <View style={styles.legend}>
                    <LegendDot
                      styles={styles}
                      color={colors.accent}
                      label="7-day load"
                    />
                    <LegendDot
                      styles={styles}
                      color={colors.text3}
                      label="28-day average"
                    />
                  </View>

                  <Text style={styles.note}>
                    {formatDuration(data.load7[data.load7.length - 1] ?? 0)}
                    {' in the last 7 days, against a 28-day average of '}
                    {formatDuration(data.load28[data.load28.length - 1] ?? 0)}
                    {'.'}
                  </Text>
                </View>
              </>
            ) : null}

            {showHealth ? (
              <>
                <SectionTitle title="Health" />

                <View style={styles.tiles}>
                  <StatTile
                    icon="shoe-print"
                    label="Daily steps"
                    value={
                      data.avgDailySteps
                        ? Math.round(data.avgDailySteps).toLocaleString()
                        : '—'
                    }
                    delta={
                      data.avgDailySteps
                        ? '7-day average · from your phone'
                        : 'No step data yet'
                    }
                  />
                  <StatTile
                    icon="timer-outline"
                    label="Exercise"
                    value={
                      data.avgDailyExerciseMinutes
                        ? `${Math.round(data.avgDailyExerciseMinutes)}`
                        : '—'
                    }
                    unit={data.avgDailyExerciseMinutes ? ' min' : undefined}
                    delta={
                      data.avgDailyExerciseMinutes
                        ? 'Daily average · from your phone'
                        : 'No exercise minutes yet'
                    }
                  />
                </View>

                <View style={styles.tiles}>
                  <StatTile
                    icon="moon-waning-crescent"
                    label="Avg sleep"
                    value={formatMinutes(data.avgSleepMinutes)}
                    unit={data.avgSleepMinutes ? 'm' : undefined}
                    delta={
                      data.avgSleepMinutes
                        ? 'Last 14 nights'
                        : 'No sleep data yet'
                    }
                  />
                  <StatTile
                    icon="heart-outline"
                    label="Resting HR"
                    value={
                      data.restingHeartRate
                        ? `${Math.round(data.restingHeartRate)}`
                        : '—'
                    }
                    unit={data.restingHeartRate ? ' bpm' : undefined}
                    delta={
                      data.restingHeartRate
                        ? 'From your band'
                        : 'No readings yet'
                    }
                  />
                </View>
              </>
            ) : null}

            {showNutrition ? (
              <>
                <SectionTitle title="How it fits together" />

                <View style={[styles.card, styles.coachCard]}>
                  <View style={styles.coachHead}>
                    <Icon
                      name="lightning-bolt"
                      size={17}
                      color={colors.accent}
                    />
                    <Text style={styles.coachTitle}>
                      Fuelling vs training load
                    </Text>
                  </View>
                  <Text style={styles.note}>
                    A band reports training, not meals. Once Fuel logs what you
                    eat, that goes against your load here.
                  </Text>
                </View>
              </>
            ) : null}
            {summary.asked ? (
              <Text style={styles.tracking}>
                {`Stored on this device: ${summary.storedSessions} session${
                  summary.storedSessions === 1 ? '' : 's'
                }, ${summary.storedNights} night${
                  summary.storedNights === 1 ? '' : 's'
                }, ${summary.storedHrReadings} HR reading${
                  summary.storedHrReadings === 1 ? '' : 's'
                }`}
                {summary.unsyncedTotal
                  ? ` · ${summary.unsyncedTotal} waiting to sync`
                  : ''}
                {summary.lastSyncAt
                  ? ` · checked ${formatRelative(summary.lastSyncAt)}`
                  : ''}
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const LegendDot = ({
  styles,
  color,
  label,
}: {
  styles: any;
  color: string;
  label: string;
}) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bg,
    },
    scrollContent: {
      paddingHorizontal: 22,
      paddingBottom: 26,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    centered: {
      paddingVertical: 60,
      alignItems: 'center',
    },

    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 9,
      marginTop: 14,
      paddingVertical: 11,
      paddingHorizontal: 13,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    bannerText: {
      flex: 1,
      minWidth: 180,
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.text3,
    },
    bannerAction: {
      width: '100%',
    },

    logBtn: {
      marginTop: 12,
    },
    tracking: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      lineHeight: 16,
      color: c.text3,
      marginTop: 18,
      textAlign: 'center',
    },
    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },
    tiles: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    chart: {
      height: 104,
      marginBottom: 8,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 2.5,
    },
    legendLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11,
      color: c.text2,
    },
    note: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      lineHeight: 19,
      color: c.text2,
      marginTop: 12,
    },

    coachCard: {
      borderColor: c.accentBorderSoft,
      backgroundColor: c.accentBgSoft,
    },
    coachHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    coachTitle: {
      fontFamily: Fonts.InterBold,
      fontSize: 13,
      letterSpacing: -0.2,
      color: c.text,
    },
  });

export default AnalyticsScreen;
