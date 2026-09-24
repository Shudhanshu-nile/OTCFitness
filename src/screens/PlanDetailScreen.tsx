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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import SectionTitle from '../components/SectionTitle';
import ContentRow from '../components/ContentRow';
import LockOverlay from '../components/LockOverlay';
import VideoTile from '../components/VideoTile';
import FormatChip from '../components/FormatChip';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

/* Static demo content — index.html (Option 2) → otcf-app.js → `plandetail`. */

const PLAN = {
  eyebrow: 'Triathlon · Intermediate',
  title: 'Ironman 70.3 Build',
  stats: [
    { value: '16', label: 'Weeks' },
    { value: '112', label: 'Sessions' },
    { value: '8.5h', label: 'Per week' },
    { value: '43', label: 'Guides' },
  ],
  blurb:
    'Sixteen weeks from base to race day, built on the same progression Steve uses ' +
    'with the OTCF race team. Every session comes with the reasoning behind it and ' +
    'a video showing you how to execute it.',
};

const LOCKED_WEEKS = [2, 3, 4];

const GUIDE_CHAPTERS = [
  { title: '2 — Setting your zones', pages: 'PDF · 9 pages', audio: '8 min' },
  { title: '3 — Swim in open water', pages: 'PDF · 17 pages', audio: '14 min' },
];

const VIDEOS = [
  { title: 'Threshold pacing', duration: '6:12', discipline: 'bike' as const },
  {
    title: 'Open-water sighting',
    duration: '4:48',
    discipline: 'swim' as const,
  },
  {
    title: 'Brick run form',
    duration: '5:30',
    discipline: 'run' as const,
    locked: true,
  },
  {
    title: 'T1 transition drill',
    duration: '3:55',
    discipline: 'brick' as const,
    locked: true,
  },
];

/** 08 — PLAN DETAIL, freemium gating in the open (otcf-app.js → `plandetail`) */
const PlanDetailScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const openGuide = () => navigation.navigate(ScreenNames.Guide);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar
        title="Plan"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
            <Icon name="star-outline" size={17} color={colors.text2} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- Plan banner ---------------- */}
        <View style={styles.banner}>
          <LinearGradient
            colors={[
              withAlpha(DISCIPLINE.bike, 0.55),
              withAlpha(DISCIPLINE.swim, 0.22),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            locations={[0.3, 1]}
            style={styles.fill}
            pointerEvents="none"
          />

          <Text style={styles.bannerEyebrow}>{PLAN.eyebrow}</Text>
          <Text style={styles.bannerTitle}>{PLAN.title}</Text>
        </View>

        <View style={styles.pad}>
          {/* ---------------- Stats ---------------- */}
          <View style={styles.statsCard}>
            {PLAN.stats.map((s, i) => (
              <View
                key={s.label}
                style={[styles.stat, i > 0 && styles.statDivider]}
              >
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.blurb}>{PLAN.blurb}</Text>

          {/* ---------------- Training Plan ---------------- */}
          <SectionTitle title="Training Plan" action="112 sessions" />

          <ContentRow
            icon="calendar-blank-outline"
            iconColor={DISCIPLINE.run}
            iconBg={withAlpha(DISCIPLINE.run, 0.14)}
            title="Week 1 — Base foundation"
            subtitle="7 sessions · 6h 20m"
            pill={{ label: 'Free', tone: 'free' }}
          />

          <View style={styles.lockGap}>
            <LockOverlay
              title="Weeks 2–16 in Pro"
              subtitle="109 more sessions to race day"
            >
              {LOCKED_WEEKS.map((w, i) => (
                <View key={w} style={i > 0 && styles.rowGap}>
                  <ContentRow
                    icon="calendar-blank-outline"
                    iconColor={DISCIPLINE.run}
                    iconBg={withAlpha(DISCIPLINE.run, 0.14)}
                    title={`Week ${w} — Base foundation`}
                    subtitle="7 sessions · 6h 45m"
                  />
                </View>
              ))}
            </LockOverlay>
          </View>

          {/* ---------------- Training Guide ---------------- */}
          <SectionTitle title="Training Guide" action="9 chapters" />

          <ContentRow
            icon="file-document-outline"
            iconColor={DISCIPLINE.swim}
            iconBg={withAlpha(DISCIPLINE.swim, 0.14)}
            title="1 — How this plan is built"
            subtitle={
              <>
                <FormatChip format="pdf" label="14 pages" iconSize={11} />
                <FormatChip format="audio" label="11 min" iconSize={11} />
              </>
            }
            pill={{ label: 'Free', tone: 'free' }}
            onPress={openGuide}
          />

          {GUIDE_CHAPTERS.map(ch => (
            <View key={ch.title} style={styles.rowGap}>
              <ContentRow
                icon="file-document-outline"
                iconColor={DISCIPLINE.swim}
                iconBg={withAlpha(DISCIPLINE.swim, 0.14)}
                title={ch.title}
                subtitle={
                  <>
                    <FormatChip
                      format="pdf"
                      label={ch.pages.replace('PDF · ', '')}
                      iconSize={11}
                    />
                    <FormatChip format="audio" label={ch.audio} iconSize={11} />
                  </>
                }
                locked
              />
            </View>
          ))}

          {/* ---------------- Step-by-Step Guides ---------------- */}
          <SectionTitle title="Step-by-Step Guides" action="34 videos" />

          <View style={styles.videoGrid}>
            {VIDEOS.map(v => (
              <View key={v.title} style={styles.videoCell}>
                <VideoTile {...v} onPress={openGuide} />
              </View>
            ))}
          </View>

          <Button
            label="Unlock the full plan"
            iconLeft="lock-outline"
            style={styles.cta}
            onPress={() => navigation.navigate(ScreenNames.Paywall)}
          />
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
    pad: {
      paddingHorizontal: 22,
    },
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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

    banner: {
      height: 130,
      marginHorizontal: 22,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      padding: 15,
    },
    bannerEyebrow: {
      fontFamily: Fonts.InterBold,
      fontSize: 10.5,
      letterSpacing: 1.47,
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.9)',
    },
    bannerTitle: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 21,
      letterSpacing: -0.63,
      color: '#FFFFFF',
      marginTop: 5,
    },

    statsCard: {
      flexDirection: 'row',
      marginTop: 15,
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderRadius: RADIUS.lg,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    stat: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      borderLeftWidth: 1,
      borderLeftColor: c.border,
    },
    statValue: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 17,
      letterSpacing: -0.51,
      color: c.text,
    },
    statLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: c.text3,
      marginTop: 2,
    },

    blurb: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13.5,
      lineHeight: 22.3,
      color: c.text2,
      marginTop: 16,
    },

    rowGap: {
      marginTop: 8,
    },
    lockGap: {
      marginTop: 8,
    },

    videoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    videoCell: {
      width: '48%',
      flexGrow: 1,
      flexDirection: 'row',
    },

    cta: {
      marginTop: 20,
    },
  });

export default PlanDetailScreen;
