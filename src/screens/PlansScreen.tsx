import React, { useMemo, useState } from 'react';
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
import ChipRow from '../components/Chip';
import Pill from '../components/Pill';
import TrackBar from '../components/TrackBar';
import FormatChip from '../components/FormatChip';
import PlanCard, { Plan } from '../components/PlanCard';
import { Fonts, RADIUS, BRAND, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

/* Static demo content — index.html (Option 2) → otcf-app.js → `plans`. */

const FILTERS = [
  'All',
  'Triathlon',
  'Running',
  'Cycling',
  'Swimming',
  'Strength',
  'Recovery',
];

/** Which filter chips each plan answers to. */
const CATEGORY: Record<string, string[]> = {
  'Sprint Triathlon — Beginner': ['Triathlon', 'Swimming'],
  'Olympic Distance — Build': ['Triathlon', 'Running'],
  'Full Ironman — Advanced': ['Triathlon', 'Cycling'],
  'Marathon — Sub 4:00': ['Running'],
  'Open Water Confidence': ['Swimming'],
  'Wattbike FTP Builder': ['Cycling'],
  'Aqua Running & Recovery': ['Swimming', 'Recovery'],
  'Strength for Endurance': ['Strength'],
  'Longevity & General Fitness': ['Strength', 'Recovery'],
};

const CURRENT = {
  badge: 'Week 3 of 16',
  countdown: '86 days to race',
  title: 'Ironman 70.3 — Intermediate',
  progress: 19,
};

const PLANS: Plan[] = [
  {
    title: 'Sprint Triathlon — Beginner',
    discipline: 'swim',
    weeks: '10 wks',
    hours: '4–6 h',
    level: 'Beginner',
    formats: ['pdf', 'video'],
    tag: 'Most popular',
  },
  {
    title: 'Olympic Distance — Build',
    discipline: 'run',
    weeks: '12 wks',
    hours: '6–8 h',
    level: 'Intermediate',
    formats: ['pdf', 'video', 'audio'],
  },
  {
    title: 'Full Ironman — Advanced',
    discipline: 'brick',
    weeks: '24 wks',
    hours: '12–16 h',
    level: 'Advanced',
    formats: ['pdf', 'video', 'audio'],
  },
  {
    title: 'Marathon — Sub 4:00',
    discipline: 'run',
    weeks: '16 wks',
    hours: '5–7 h',
    level: 'Intermediate',
    formats: ['pdf', 'video'],
  },
  {
    title: 'Open Water Confidence',
    discipline: 'swim',
    weeks: '8 wks',
    hours: '3–4 h',
    level: 'Beginner',
    formats: ['video', 'audio'],
  },
  {
    title: 'Wattbike FTP Builder',
    discipline: 'bike',
    weeks: '8 wks',
    hours: '4–6 h',
    level: 'All levels',
    formats: ['pdf', 'video'],
  },
  {
    title: 'Aqua Running & Recovery',
    discipline: 'swim',
    weeks: '6 wks',
    hours: '3 h',
    level: 'Rehab',
    formats: ['pdf', 'audio'],
  },
  {
    title: 'Strength for Endurance',
    discipline: 'strength',
    weeks: '12 wks',
    hours: '2–3 h',
    level: 'All levels',
    formats: ['video'],
  },
  {
    title: 'Longevity & General Fitness',
    discipline: 'strength',
    weeks: 'Ongoing',
    hours: '3–5 h',
    level: 'All levels',
    formats: ['pdf', 'video', 'audio'],
  },
];

/** 07 — PLAN LIBRARY (otcf-app.js → `plans`) */
const PlansScreen = ({ navigation }: any) => {
  const { colors, gradients, glowOpacity, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () =>
      filter === 'All'
        ? PLANS
        : PLANS.filter(p => CATEGORY[p.title]?.includes(filter)),
    [filter],
  );

  const openDetail = () => navigation.navigate(ScreenNames.PlanDetail);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- App header ---------------- */}
        <View style={styles.appHead}>
          <View style={styles.flex1}>
            <Text style={styles.headSub}>Off That Couch Fitness</Text>
            <Text style={styles.headTitle}>Plan library</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
            <Icon name="magnify" size={18} color={colors.text2} />
          </TouchableOpacity>
        </View>

        <View style={styles.pad}>
          <ChipRow options={FILTERS} selected={filter} onSelect={setFilter} />

          {/* ---------------- Continue ---------------- */}
          <SectionTitle title="Continue" />

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.hero}
            onPress={openDetail}
          >
            <LinearGradient
              colors={gradients.heroSession}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={styles.heroFill}
            />
            <Svg style={styles.heroFill} pointerEvents="none">
              <Defs>
                <RadialGradient
                  id="plansGlow"
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
                fill="url(#plansGlow)"
              />
            </Svg>

            <View style={styles.heroRow}>
              <Pill label={CURRENT.badge} tone="free" />
              <Text style={styles.heroCountdown}>{CURRENT.countdown}</Text>
            </View>

            <Text style={styles.heroTitle}>{CURRENT.title}</Text>

            <TrackBar
              percent={CURRENT.progress}
              style={styles.heroTrack}
              // the mockup overrides the track on the hero so it
              // reads against the gradient rather than the page
              trackColor={
                isDark ? 'rgba(255,255,255,0.12)' : 'rgba(10,16,12,0.10)'
              }
            />

            <View style={styles.heroFormats}>
              <FormatChip format="pdf" iconSize={13} />
              <FormatChip format="video" iconSize={13} />
              <FormatChip format="audio" iconSize={13} />
            </View>
          </TouchableOpacity>

          {/* ---------------- All plans ---------------- */}
          <SectionTitle
            title="All plans"
            action={`${visible.length + (filter === 'All' ? 1 : 0)} plans`}
          />

          {visible.length ? (
            <View style={styles.grid}>
              {visible.map(p => (
                <PlanCard key={p.title} plan={p} onPress={openDetail} />
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>
              No plans in {filter} yet — try another filter.
            </Text>
          )}
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
    scrollContent: {
      paddingBottom: 26,
    },
    flex1: {
      flex: 1,
    },
    pad: {
      paddingHorizontal: 22,
    },

    appHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 22,
      paddingTop: 6,
      paddingBottom: 14,
    },
    headSub: {
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

    hero: {
      borderRadius: RADIUS.xl,
      padding: 17,
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
    },
    heroCountdown: {
      marginLeft: 'auto',
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      color: c.text2,
    },
    heroTitle: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 19,
      letterSpacing: -0.6,
      color: c.text,
      marginTop: 10,
    },
    heroTrack: {
      marginTop: 13,
    },
    heroFormats: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 13,
    },

    grid: {
      gap: 12,
    },
    empty: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13,
      color: c.text3,
      paddingVertical: 18,
    },
  });

export default PlansScreen;
