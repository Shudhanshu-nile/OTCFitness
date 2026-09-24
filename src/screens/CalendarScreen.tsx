import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import SectionTitle from '../components/SectionTitle';
import ChipRow from '../components/Chip';
import Pill from '../components/Pill';
import ProgressRing from '../components/ProgressRing';
import {
  Fonts,
  RADIUS,
  DISCIPLINE_META,
  DisciplineKey,
  ScreenNames,
  Palette,
} from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

/* Static demo content — index.html (Option 2) → otcf-app.js → `calendar`. */

const PLAN = {
  percent: 19,
  phase: 'Build · Week 3 of 16',
  countdown: '86 days to Ironman 70.3 Staffordshire',
  /** Phase widths, with the current phase highlighted. */
  phases: [6, 5, 3, 2],
  currentPhase: 1,
};

const VIEWS = ['Week', 'Month', 'Phases'];

type DaySession = {
  discipline: DisciplineKey;
  name: string;
  duration: string;
};

type Day = {
  label: string;
  today?: boolean;
  sessions: DaySession[];
};

const WEEK: Day[] = [
  { label: 'Mon 11', sessions: [] },
  {
    label: 'Tue 12',
    today: true,
    sessions: [
      { discipline: 'bike', name: 'Threshold 5×4', duration: '1:15' },
      { discipline: 'strength', name: 'Core & stability', duration: '30m' },
    ],
  },
  {
    label: 'Wed 13',
    sessions: [{ discipline: 'swim', name: 'CSS intervals', duration: '1:00' }],
  },
  {
    label: 'Thu 14',
    sessions: [{ discipline: 'run', name: 'Tempo 3×8', duration: '55m' }],
  },
  {
    label: 'Fri 15',
    sessions: [
      { discipline: 'swim', name: 'Technique', duration: '45m' },
      { discipline: 'strength', name: 'Mobility', duration: '30m' },
    ],
  },
  {
    label: 'Sat 16',
    sessions: [{ discipline: 'bike', name: 'Long ride Z2', duration: '2:45' }],
  },
  {
    label: 'Sun 17',
    sessions: [
      { discipline: 'run', name: 'Long run', duration: '1:35' },
      { discipline: 'brick', name: 'Off-bike 20m', duration: '20m' },
    ],
  },
];

/** 06 — PLAN CALENDAR (otcf-app.js → `calendar`) */
const CalendarScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [view, setView] = useState('Week');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar
        title="Your plan"
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
        {/* ---------------- Plan progress ---------------- */}
        <View style={styles.planCard}>
          <ProgressRing
            percent={PLAN.percent}
            value={`${PLAN.percent}%`}
            caption="Plan"
            size={66}
          />

          <View style={styles.planBody}>
            <Text style={styles.planPhase}>{PLAN.phase}</Text>
            <Text style={styles.planCountdown}>{PLAN.countdown}</Text>

            <View style={styles.phaseBar}>
              {PLAN.phases.map((flex, i) => (
                <View
                  key={i}
                  style={[
                    styles.phaseSeg,
                    { flex },
                    i === PLAN.currentPhase && styles.phaseSegOn,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.chips}>
          <ChipRow options={VIEWS} selected={view} onSelect={setView} />
        </View>

        {/* ---------------- The week ---------------- */}
        <SectionTitle title="11 – 17 March" action="8h 30m" />

        {WEEK.map(day => (
          <View key={day.label} style={styles.day}>
            <View style={styles.dayHead}>
              <Text style={[styles.dayLabel, day.today && styles.dayLabelOn]}>
                {day.label}
              </Text>
              {day.today ? <Pill label="Today" tone="free" /> : null}
              <Text style={styles.dayCount}>
                {day.sessions.length
                  ? `${day.sessions.length} ${
                      day.sessions.length > 1 ? 'sessions' : 'session'
                    }`
                  : 'Rest day'}
              </Text>
            </View>

            {day.sessions.length ? (
              day.sessions.map((s, i) => {
                const meta = DISCIPLINE_META[s.discipline];
                return (
                  <TouchableOpacity
                    key={`${s.name}-${i}`}
                    activeOpacity={0.85}
                    style={[styles.row, i > 0 && styles.rowGap]}
                    onPress={() => navigation.navigate(ScreenNames.Session)}
                  >
                    <View
                      style={[
                        styles.rowIcon,
                        { backgroundColor: withAlpha(meta.color, 0.13) },
                      ]}
                    >
                      <Icon name={meta.icon} size={17} color={meta.color} />
                    </View>

                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{s.name}</Text>
                      <Text style={styles.rowSub}>{meta.label}</Text>
                    </View>

                    <Text style={styles.rowValue}>{s.duration}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={[styles.row, styles.restRow]}>
                <View style={styles.rowIcon}>
                  <Icon
                    name={DISCIPLINE_META.rest.icon}
                    size={17}
                    color={DISCIPLINE_META.rest.color}
                  />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>Full rest</Text>
                  <Text style={styles.rowSub}>
                    Recovery is part of the plan
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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

    planCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      padding: 16,
      borderRadius: RADIUS.lg,
      backgroundColor: c.surface3,
      borderWidth: 1,
      borderColor: c.border,
    },
    planBody: {
      flex: 1,
    },
    planPhase: {
      fontFamily: Fonts.InterBold,
      fontSize: 15,
      letterSpacing: -0.33,
      color: c.text,
    },
    planCountdown: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12.5,
      lineHeight: 18,
      color: c.text2,
      marginTop: 4,
    },
    phaseBar: {
      flexDirection: 'row',
      gap: 5,
      marginTop: 10,
    },
    phaseSeg: {
      height: 5,
      borderRadius: 99,
      backgroundColor: c.surface,
    },
    phaseSegOn: {
      backgroundColor: c.accent,
    },

    chips: {
      marginTop: 14,
    },

    day: {
      marginBottom: 14,
    },
    dayHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginBottom: 7,
    },
    dayLabel: {
      fontFamily: Fonts.InterBold,
      fontSize: 12,
      letterSpacing: -0.12,
      color: c.text,
    },
    dayLabelOn: {
      color: c.accent,
    },
    dayCount: {
      marginLeft: 'auto',
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      paddingVertical: 11,
      paddingHorizontal: 13,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    rowGap: {
      marginTop: 9,
    },
    restRow: {
      opacity: 0.5,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface3,
    },
    rowBody: {
      flex: 1,
      minWidth: 0,
    },
    rowTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      letterSpacing: -0.2,
      color: c.text,
    },
    rowSub: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.text3,
      marginTop: 2.5,
    },
    rowValue: {
      fontFamily: Fonts.InterBold,
      fontSize: 12.5,
      color: c.text,
    },
  });

export default CalendarScreen;
