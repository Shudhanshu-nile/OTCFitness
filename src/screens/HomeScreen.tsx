import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionTitle from '../components/SectionTitle';
import StatTile from '../components/StatTile';
import ProgressRing from '../components/ProgressRing';
import TrackBar from '../components/TrackBar';
import WeekStrip, { WeekDay } from '../components/WeekStrip';
import SessionRow from '../components/SessionRow';
import {
  Fonts,
  RADIUS,
  DISCIPLINE,
  BRAND,
  ScreenNames,
  Palette,
} from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

/* ---------------------------------------------------------------------------
   Static demo content, lifted from the OTCF UI mockup — index.html (Option 2),
   `otcf-app.js` → `today`. Swap for API data once the endpoints are live.
--------------------------------------------------------------------------- */

const TODAY = {
  dateLabel: 'Tuesday 12 March · Build week 3',
  greeting: 'Morning, Jess',
};

const WEEK: WeekDay[] = [
  { day: 'M', date: 11, sessions: ['rest'] },
  { day: 'T', date: 12, sessions: ['bike', 'strength'] },
  { day: 'W', date: 13, sessions: ['swim'] },
  { day: 'T', date: 14, sessions: ['run'] },
  { day: 'F', date: 15, sessions: ['swim', 'strength'] },
  { day: 'S', date: 16, sessions: ['bike'] },
  { day: 'S', date: 17, sessions: ['run', 'brick'] },
];
const ACTIVE_DAY = 1;

const KEY_SESSION = {
  kind: 'Bike · Threshold',
  title: '5 × 4min\n@ Threshold',
  subtitle:
    'The key session of your week. Hold 245–265 W and let the recoveries be genuinely easy.',
  icon: 'bike',
  color: DISCIPLINE.bike,
  stats: [
    { value: '1:15', unit: '', label: 'Duration' },
    { value: '245', unit: 'w', label: 'Target' },
    { value: 'Z4', unit: '', label: 'Zone' },
  ],
};

const supportingSessions = (accent: string) => [
  {
    icon: 'dumbbell',
    iconColor: DISCIPLINE.strength,
    title: 'Core & stability',
    subtitle: 'Supporting · 6 exercises',
    value: '30min',
    caption: 'Evening',
    done: false,
  },
  {
    icon: 'check-circle-outline',
    iconColor: accent,
    title: 'Easy shakeout run',
    subtitle: 'Auto-logged from Garmin · RPE 3',
    value: '28min',
    caption: '6.1 km',
    done: true,
  },
];

const glanceRows = (accent: string) => ({
  weekPercent: 64,
  rows: [
    { name: 'Training', value: '5.4 / 8.5 h', percent: 64, color: accent },
    {
      name: 'Fuelling',
      value: '1,840 / 2,650 kcal',
      percent: 69,
      color: DISCIPLINE.bike,
    },
    {
      name: 'Protein',
      value: '96 / 135 g',
      percent: 71,
      color: DISCIPLINE.strength,
    },
  ],
});

const TILES = [
  {
    icon: 'moon-waning-crescent',
    label: 'Sleep',
    value: '7h 24',
    unit: 'm',
    delta: '+38m vs your average',
    up: true,
  },
  {
    icon: 'heart-outline',
    label: 'Resting HR',
    value: '48',
    unit: ' bpm',
    delta: 'Steady for 9 days',
  },
];

const COACH_NUDGE =
  "Sleep is up and resting HR is stable — you're well placed for today's intervals. Fuel the ride properly.";

const HomeScreen = ({ navigation }: any) => {
  const { colors, gradients, glowOpacity, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const SUPPORTING = supportingSessions(colors.accent);
  const GLANCE = glanceRows(colors.accent);

  const openSession = () => navigation.navigate(ScreenNames.Session);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- App header ---------------- */}
        <View style={styles.appHead}>
          <View style={styles.flex1}>
            <Text style={styles.headDate}>{TODAY.dateLabel}</Text>
            <Text style={styles.headTitle}>{TODAY.greeting}</Text>
          </View>

          <View style={styles.headActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(ScreenNames.Notifications)}
            >
              <Icon name="bell-outline" size={18} color={colors.text2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(ScreenNames.Calendar)}
            >
              <Icon
                name="calendar-blank-outline"
                size={18}
                color={colors.text2}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pad}>
          {/* ---------------- Week strip ---------------- */}
          <WeekStrip days={WEEK} activeIndex={ACTIVE_DAY} />

          {/* ---------------- Today's key session ---------------- */}
          <SectionTitle title="Today's key session" />

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.hero}
            onPress={openSession}
          >
            {/* Background + glow live in their own clipped layer so
                            they can never affect the content's layout. */}
            <LinearGradient
              colors={gradients.heroSession}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={styles.heroFill}
            />
            {/* radial-gradient(120% 100% at 100% 0%, accent 30%, transparent 62%) */}
            <Svg style={styles.heroFill} pointerEvents="none">
              <Defs>
                <RadialGradient
                  id="heroGlow"
                  cx="100%"
                  cy="0%"
                  rx="120%"
                  ry="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0"
                    stopColor={BRAND.g500}
                    stopOpacity={glowOpacity}
                  />
                  <Stop offset="0.62" stopColor={BRAND.g500} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#heroGlow)"
              />
            </Svg>

            <View style={styles.heroRow}>
              <View
                style={[styles.discDot, { backgroundColor: KEY_SESSION.color }]}
              />
              <Text style={styles.heroKind}>{KEY_SESSION.kind}</Text>
              <Icon
                name={KEY_SESSION.icon}
                size={20}
                color={colors.text}
                style={styles.heroRowIcon}
              />
            </View>

            <Text style={styles.heroTitle}>{KEY_SESSION.title}</Text>
            <Text style={styles.heroSub}>{KEY_SESSION.subtitle}</Text>

            <View style={styles.heroStats}>
              {KEY_SESSION.stats.map(stat => (
                <View key={stat.label}>
                  <Text style={styles.heroStatValue}>
                    {stat.value}
                    {stat.unit ? (
                      <Text style={styles.heroStatUnit}>{stat.unit}</Text>
                    ) : null}
                  </Text>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryBtn}
              onPress={openSession}
            >
              <Icon name="play" size={15} color={colors.accentInk} />
              <Text style={styles.primaryBtnText}>View session</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* ---------------- Supporting sessions ---------------- */}
          <View style={styles.rows}>
            {SUPPORTING.map((row, i) => (
              <View key={row.title} style={i > 0 && styles.rowGap}>
                <SessionRow
                  {...row}
                  onPress={row.done ? undefined : openSession}
                />
              </View>
            ))}
          </View>

          {/* ---------------- Today at a glance ---------------- */}
          <SectionTitle title="Today at a glance" />

          <View style={[styles.card, styles.glanceCard]}>
            <ProgressRing
              percent={GLANCE.weekPercent}
              value={`${GLANCE.weekPercent}%`}
              caption="Week"
              size={78}
            />

            <View style={styles.glanceRows}>
              {GLANCE.rows.map(row => (
                <View key={row.name}>
                  <View style={styles.macroHead}>
                    <Text style={styles.macroName}>{row.name}</Text>
                    <Text style={styles.macroValue}>{row.value}</Text>
                  </View>
                  <TrackBar percent={row.percent} color={row.color} />
                </View>
              ))}
            </View>
          </View>

          {/* ---------------- Wearable tiles ---------------- */}
          <View style={styles.tiles}>
            {TILES.map(tile => (
              <StatTile key={tile.label} {...tile} />
            ))}
          </View>

          {/* ---------------- Coach nudge ---------------- */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.coachCard]}
            onPress={() => navigation.navigate(ScreenNames.Coach)}
          >
            <View style={styles.coachIcon}>
              <Icon name="lightning-bolt" size={18} color={colors.accentInk} />
            </View>

            <View style={styles.flex1}>
              <Text style={styles.coachTitle}>
                Your coach noticed something
              </Text>
              <Text style={styles.coachBody}>{COACH_NUDGE}</Text>

              <View style={styles.coachCta}>
                <Text style={styles.coachCtaText}>Ask about today</Text>
                <Icon name="chevron-right" size={15} color={colors.accent} />
              </View>
            </View>
          </TouchableOpacity>

          {/* ---------------- Sync footer ---------------- */}
          <View style={styles.sync}>
            <View style={styles.liveDot} />
            <Icon name="watch-variant" size={14} color={colors.text3} />
            <Text style={styles.syncText}>
              Garmin Forerunner via Apple Health — synced 6 minutes ago
            </Text>
          </View>
        </View>
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 26,
    },
    flex1: {
      flex: 1,
    },
    pad: {
      paddingHorizontal: 22,
    },

    /* app header */
    appHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 22,
      paddingTop: 6,
      paddingBottom: 14,
    },
    headDate: {
      fontFamily: Fonts.InterMedium,
      fontSize: 13,
      color: c.text3,
    },
    headTitle: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 26,
      letterSpacing: -0.83,
      color: c.text,
      marginTop: 2,
    },
    headActions: {
      flexDirection: 'row',
      gap: 8,
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },

    /* hero key-session card */
    hero: {
      borderRadius: RADIUS.xl,
      padding: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border2,
      backgroundColor: c.surface2,
    },
    heroFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    discDot: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
    },
    heroKind: {
      fontFamily: Fonts.InterBold,
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: c.text2,
    },
    heroRowIcon: {
      marginLeft: 'auto',
    },
    heroTitle: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 25,
      lineHeight: 28,
      letterSpacing: -0.8,
      color: c.text,
      marginTop: 11,
    },
    heroSub: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13.5,
      lineHeight: 20,
      color: c.text2,
      marginTop: 7,
    },
    heroStats: {
      flexDirection: 'row',
      gap: 22,
      marginTop: 18,
    },
    heroStatValue: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 20,
      letterSpacing: -0.56,
      color: c.text,
    },
    heroStatUnit: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      color: c.text2,
    },
    heroStatLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10.5,
      letterSpacing: 0.63,
      textTransform: 'uppercase',
      color: c.text3,
      marginTop: 2,
    },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: 14,
      backgroundColor: c.accent,
      marginTop: 17,
    },
    primaryBtnText: {
      fontFamily: Fonts.InterBold,
      fontSize: 14.5,
      letterSpacing: -0.15,
      color: c.accentInk,
    },

    /* supporting session rows */
    rows: {
      marginTop: 12,
    },
    rowGap: {
      marginTop: 9,
    },

    /* generic card */
    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },

    /* today at a glance */
    glanceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    glanceRows: {
      flex: 1,
      gap: 11,
    },
    macroHead: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 7,
    },
    macroName: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      color: c.text,
    },
    macroValue: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.text3,
      marginLeft: 'auto',
    },

    /* wearable tiles */
    tiles: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },

    /* coach nudge */
    coachCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginTop: 12,
      borderColor: c.accentBorderSoft,
      backgroundColor: c.accentBgSoft,
    },
    coachIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accent,
    },
    coachTitle: {
      fontFamily: Fonts.InterBold,
      fontSize: 13,
      letterSpacing: -0.2,
      color: c.text,
    },
    coachBody: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12.5,
      lineHeight: 19,
      color: c.text2,
      marginTop: 4,
    },
    coachCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 8,
    },
    coachCtaText: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      color: c.accent,
    },

    /* sync footer */
    sync: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.accent,
      borderWidth: 3,
      borderColor: c.accentRing,
    },
    syncText: {
      flex: 1,
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
    },
  });

export default HomeScreen;
