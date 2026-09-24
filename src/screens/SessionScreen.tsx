import React from 'react';
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
import Target from '../components/Target';
import WorkoutStep, { Step } from '../components/WorkoutStep';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

/* Static demo content — index.html (Option 2) → otcf-app.js → `session`. */

const SESSION = {
  navTitle: 'Tuesday · Bike',
  kind: 'Threshold intervals · Key session',
  title: '5 × 4min @ Threshold',
  color: DISCIPLINE.bike,
  meta: [
    { icon: 'clock-outline', label: '1h 15m' },
    { icon: 'lightning-bolt', label: 'Zone 4' },
    { icon: 'chart-box-outline', label: 'Load 82' },
  ],
  why:
    "Third week of Build. We're lifting your threshold before the volume steps up. " +
    'Five reps is the sweet spot — enough to drive adaptation, not so much that ' +
    "Saturday's long ride suffers.",
};

const STEPS: Step[] = [
  {
    duration: '10 min',
    zone: 'Z1',
    title: 'Warm-up',
    detail: 'Easy spin, build cadence to 95 rpm over the last 3 minutes.',
    targets: ['120–150 W', '< 120 bpm'],
  },
  {
    duration: '3 × 30s',
    zone: 'Z5',
    title: 'Activation',
    detail: 'Fast pedalling, 60 seconds easy between. Wakes the legs up.',
    targets: ['110 rpm+'],
  },
  {
    duration: '5 × 4min',
    zone: 'Z4',
    title: 'Main set',
    detail:
      '3 minutes easy spinning between each. Hold power steady — do not start too hard.',
    targets: ['245–265 W', '152–162 bpm', '85–95 rpm'],
    key: true,
  },
  {
    duration: '8 min',
    zone: 'Z1',
    title: 'Cool-down',
    detail: 'Very easy. Spin the legs out completely before you stop.',
    targets: ['< 130 W'],
  },
];

/** 05 — SESSION DETAIL (otcf-app.js → `session`) */
const SessionScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar
        title={SESSION.navTitle}
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
        <View style={styles.kindRow}>
          <View style={[styles.discDot, { backgroundColor: SESSION.color }]} />
          <Text style={styles.kind}>{SESSION.kind}</Text>
        </View>

        <Text style={styles.title}>{SESSION.title}</Text>

        <View style={styles.metaRow}>
          {SESSION.meta.map(m => (
            <Target key={m.label} label={m.label} icon={m.icon} />
          ))}
        </View>

        {/* ---------------- Why this session ---------------- */}
        <View style={styles.whyCard}>
          <Text style={styles.whyEyebrow}>Why this session, this week</Text>
          <Text style={styles.whyBody}>{SESSION.why}</Text>
        </View>

        {/* ---------------- The session ---------------- */}
        <SectionTitle title="The session" action="Zones" />

        {STEPS.map((step, i) => (
          <WorkoutStep
            key={step.title}
            step={step}
            last={i === STEPS.length - 1}
          />
        ))}

        {/* ---------------- Before you go ---------------- */}
        <SectionTitle title="Before you go" />

        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(ScreenNames.Guide)}
        >
          <View
            style={[
              styles.linkIcon,
              { backgroundColor: 'rgba(240,147,43,0.14)' },
            ]}
          >
            <Icon name="video-outline" size={19} color={DISCIPLINE.bike} />
          </View>
          <View style={styles.linkBody}>
            <Text style={styles.linkTitle}>Pacing threshold intervals</Text>
            <View style={styles.linkMeta}>
              <Icon name="play" size={11} color={colors.text3} />
              <Text style={styles.linkSub}>6:12 · Steve Clark</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={17} color={colors.text3} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkRow, styles.linkGap]}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate(ScreenNames.Main, {
              screen: ScreenNames.Fuel,
            })
          }
        >
          <View
            style={[
              styles.linkIcon,
              { backgroundColor: 'rgba(139,114,224,0.14)' },
            ]}
          >
            <Icon
              name="silverware-fork-knife"
              size={19}
              color={DISCIPLINE.strength}
            />
          </View>
          <View style={styles.linkBody}>
            <Text style={styles.linkTitle}>Fuelling for this session</Text>
            <Text style={styles.linkSub}>
              40–60g carbs beforehand · 500ml with electrolyte
            </Text>
          </View>
          <Icon name="chevron-right" size={17} color={colors.text3} />
        </TouchableOpacity>

        {/* ---------------- Actions ---------------- */}
        <View style={styles.actions}>
          <Button
            label="Move"
            variant="secondary"
            style={styles.moveBtn}
            onPress={() => navigation.goBack()}
          />
          <Button
            label="Mark complete"
            iconLeft="check"
            style={styles.completeBtn}
            onPress={() => navigation.goBack()}
          />
        </View>

        <Text style={styles.footnote}>
          Or just ride it — we'll log it automatically when your watch syncs.
        </Text>
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

    kindRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 9,
    },
    discDot: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
    },
    kind: {
      fontFamily: Fonts.InterBold,
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: c.text2,
    },
    title: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 26,
      lineHeight: 28.6,
      letterSpacing: -0.88,
      color: c.text,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 13,
    },

    whyCard: {
      marginTop: 16,
      padding: 16,
      borderRadius: RADIUS.lg,
      backgroundColor: c.accentBgSoft,
      borderWidth: 1,
      borderColor: c.accentBorderSoft,
    },
    whyEyebrow: {
      fontFamily: Fonts.InterBold,
      fontSize: 10.5,
      letterSpacing: 1.37,
      textTransform: 'uppercase',
      color: c.accent,
    },
    whyBody: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13,
      lineHeight: 20.8,
      color: c.text2,
      marginTop: 8,
    },

    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 13,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    linkGap: {
      marginTop: 8,
    },
    linkIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkBody: {
      flex: 1,
      minWidth: 0,
    },
    linkTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13.5,
      letterSpacing: -0.16,
      color: c.text,
    },
    linkMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 2,
    },
    linkSub: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      color: c.text3,
      marginTop: 2,
    },

    actions: {
      flexDirection: 'row',
      gap: 9,
      marginTop: 20,
    },
    moveBtn: {
      flex: 1,
    },
    completeBtn: {
      flex: 2,
    },
    footnote: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17.25,
      textAlign: 'center',
      color: c.text3,
      marginTop: 12,
    },
  });

export default SessionScreen;
