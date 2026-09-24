import React from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import SectionTitle from '../components/SectionTitle';
import Pill from '../components/Pill';
import ContentRow from '../components/ContentRow';
import WeekBars, { BarDay } from '../components/WeekBars';
import Button from '../components/Button';
import {
  Fonts,
  RADIUS,
  DISCIPLINE,
  BRAND,
  ScreenNames,
  Palette,
} from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';

const PLAN = {
  title: 'Ironman 70.3\nIntermediate Build',
  weeks: '16 weeks',
  blurb:
    'Four phases to 7 June, shaped around your 5 available days and 8.5 hours a week.',
  stats: [
    { value: '8.5', unit: 'h', label: 'Avg / week' },
    { value: '5', unit: '', label: 'Days' },
    { value: '112', unit: '', label: 'Sessions' },
  ],
};

const PHASES = [
  { name: 'Base', weeks: '6 wks', flex: 6, color: DISCIPLINE.swim },
  { name: 'Build', weeks: '5 wks', flex: 5, color: DISCIPLINE.run },
  { name: 'Peak', weeks: '3 wks', flex: 3, color: DISCIPLINE.bike },
  { name: 'Taper', weeks: '2 wks', flex: 2, color: DISCIPLINE.strength },
];

const WEEK: BarDay[] = [
  { label: 'Mon', segments: [['rest', 0]] },
  {
    label: 'Tue',
    segments: [
      ['bike', 75],
      ['strength', 30],
    ],
  },
  { label: 'Wed', segments: [['swim', 60]] },
  { label: 'Thu', segments: [['run', 55]] },
  {
    label: 'Fri',
    segments: [
      ['swim', 45],
      ['strength', 30],
    ],
  },
  { label: 'Sat', segments: [['bike', 165]] },
  {
    label: 'Sun',
    segments: [
      ['run', 95],
      ['brick', 20],
    ],
  },
];
const WEEK_MAX = 185;

/** 03 — PLAN PREVIEW, the conversion screen (otcf-app.js → `preview`) */
const PlanPreviewScreen = ({ navigation }: any) => {
  const { gradients, glowOpacity, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { complete } = useOnboarding();

  // Remember that onboarding is done, then hand over to the tabs.
  const enterApp = () => {
    complete();
    navigation.reset({ index: 0, routes: [{ name: ScreenNames.Main }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar title="Your plan" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- Plan hero ---------------- */}
        <View style={styles.hero}>
          <LinearGradient
            colors={gradients.heroSession}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.heroFill}
          />
          <Svg style={styles.heroFill} pointerEvents="none">
            <Defs>
              <RadialGradient
                id="planGlow"
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
              fill="url(#planGlow)"
            />
          </Svg>

          <View style={styles.heroRow}>
            <Pill label="Built for you" tone="free" />
            <Text style={styles.heroWeeks}>{PLAN.weeks}</Text>
          </View>

          <Text style={styles.heroTitle}>{PLAN.title}</Text>
          <Text style={styles.heroSub}>{PLAN.blurb}</Text>

          <View style={styles.heroStats}>
            {PLAN.stats.map(s => (
              <View key={s.label}>
                <Text style={styles.heroStatValue}>
                  {s.value}
                  {s.unit ? (
                    <Text style={styles.heroStatUnit}>{s.unit}</Text>
                  ) : null}
                </Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------------- How it progresses ---------------- */}
        <SectionTitle title="How it progresses" />

        <View style={styles.phaseBar}>
          {PHASES.map(p => (
            <View
              key={p.name}
              style={{ flex: p.flex, backgroundColor: p.color }}
            />
          ))}
        </View>

        <View style={styles.phaseLabels}>
          {PHASES.map(p => (
            <View key={p.name} style={{ flex: p.flex, minWidth: 0 }}>
              <Text style={[styles.phaseName, { color: p.color }]}>
                {p.name}
              </Text>
              <Text style={styles.phaseWeeks}>{p.weeks}</Text>
            </View>
          ))}
        </View>

        {/* ---------------- A typical week ---------------- */}
        <SectionTitle title="A typical week" action="Week 5" />

        <View style={styles.card}>
          <WeekBars
            days={WEEK}
            max={WEEK_MAX}
            legend={['swim', 'bike', 'run', 'strength']}
          />
        </View>

        {/* ---------------- What's included ---------------- */}
        <SectionTitle title="What's included" />

        <ContentRow
          icon="calendar-blank-outline"
          iconColor={DISCIPLINE.run}
          iconBg="rgba(63,164,72,0.14)"
          title="Training Plan"
          subtitle="112 dated sessions with your own zones"
          pill={{ label: 'Week 1 free', tone: 'free' }}
        />
        <View style={styles.rowGap}>
          <ContentRow
            icon="file-pdf-box"
            iconColor={DISCIPLINE.swim}
            iconBg="rgba(41,169,212,0.14)"
            title="Training Guide"
            subtitle="9 chapters · PDF + audio"
            pill={{ label: 'Pro', tone: 'pro' }}
          />
        </View>
        <View style={styles.rowGap}>
          <ContentRow
            icon="play-box-outline"
            iconColor={DISCIPLINE.bike}
            iconBg="rgba(240,147,43,0.14)"
            title="Step-by-Step Guides"
            subtitle="34 technique videos from Steve"
            pill={{ label: 'Pro', tone: 'pro' }}
          />
        </View>

        <Button
          label="Start week 1 free"
          iconRight="chevron-right"
          style={styles.cta}
          onPress={enterApp}
        />
        <Button
          label="See everything in Pro"
          variant="ghost"
          style={styles.ctaSecondary}
          onPress={() => navigation.navigate(ScreenNames.Paywall)}
        />
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

    hero: {
      borderRadius: RADIUS.xl,
      padding: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border2,
      backgroundColor: c.surface2,
      marginBottom: 18,
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
    },
    heroWeeks: {
      marginLeft: 'auto',
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      color: c.text2,
    },
    heroTitle: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 23,
      lineHeight: 26,
      letterSpacing: -0.74,
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

    phaseBar: {
      flexDirection: 'row',
      gap: 4,
      height: 8,
      borderRadius: 99,
      overflow: 'hidden',
    },
    phaseLabels: {
      flexDirection: 'row',
      gap: 4,
      marginTop: 9,
    },
    phaseName: {
      fontFamily: Fonts.InterBold,
      fontSize: 11.5,
    },
    phaseWeeks: {
      fontFamily: Fonts.InterRegular,
      fontSize: 10.5,
      color: c.text3,
      marginTop: 1,
    },

    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },
    rowGap: {
      marginTop: 8,
    },
    cta: {
      marginTop: 20,
    },
    ctaSecondary: {
      marginTop: 10,
    },
  });

export default PlanPreviewScreen;
