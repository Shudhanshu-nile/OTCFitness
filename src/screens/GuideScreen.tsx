import React, { useState } from 'react';
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
import ChipRow from '../components/Chip';
import TrackBar from '../components/TrackBar';
import { MONO } from '../components/Target';
import { Fonts, RADIUS, DISCIPLINE, BRAND, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

/* Static demo content — index.html (Option 2) → otcf-app.js → `guide`. */

const GUIDE = {
  title: 'Pacing threshold intervals',
  author: 'Steve Clark · British Triathlon L2',
  initials: 'SC',
  elapsed: '2:07',
  total: '6:12',
  progress: 34,
  blurb:
    'The single most common mistake in a threshold set is starting rep one too ' +
    'hard. In this guide Steve walks through how to find the right opening pace, ' +
    'what the first two minutes should feel like, and how to read the numbers ' +
    'when it starts to hurt.',
};

const FORMATS = ['Video', 'Audio 6:12', 'PDF notes'];

const CHAPTERS = [
  { time: '0:00', name: 'Why threshold work matters' },
  { time: '1:24', name: 'Setting your opening pace' },
  { time: '3:10', name: 'Reading power vs feel' },
  { time: '4:52', name: 'Recovering properly between reps' },
];
const PLAYING = 1;

/** 09 — GUIDE PLAYER, one guide in three formats (otcf-app.js → `guide`) */
const GuideScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [format, setFormat] = useState('Video');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar title="Step-by-Step" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- Player ---------------- */}
        <View style={styles.player}>
          <LinearGradient
            colors={[withAlpha(DISCIPLINE.bike, 0.45), '#10150F']}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.fill}
            pointerEvents="none"
          />

          <TouchableOpacity style={styles.playBtn} activeOpacity={0.85}>
            <Icon name="play" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.playerBar}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.72)']}
              style={styles.fill}
              pointerEvents="none"
            />
            <TrackBar
              percent={GUIDE.progress}
              height={3.5}
              color={BRAND.g400}
              trackColor="rgba(255,255,255,0.22)"
            />
            <View style={styles.times}>
              <Text style={styles.time}>{GUIDE.elapsed}</Text>
              <Text style={styles.time}>{GUIDE.total}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>{GUIDE.title}</Text>

        <View style={styles.authorRow}>
          <LinearGradient
            colors={[BRAND.g400, BRAND.g700]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{GUIDE.initials}</Text>
          </LinearGradient>
          <Text style={styles.author}>{GUIDE.author}</Text>
        </View>

        <View style={styles.formats}>
          <ChipRow options={FORMATS} selected={format} onSelect={setFormat} />
        </View>

        <Text style={styles.blurb}>{GUIDE.blurb}</Text>

        {/* ---------------- Chapters ---------------- */}
        <SectionTitle title="In this guide" />

        {CHAPTERS.map((ch, i) => {
          const playing = i === PLAYING;
          return (
            <TouchableOpacity
              key={ch.time}
              activeOpacity={0.85}
              style={[
                styles.chapter,
                i > 0 && styles.chapterGap,
                playing && styles.chapterOn,
              ]}
            >
              <View style={styles.chapterTime}>
                <Text style={styles.chapterTimeText}>{ch.time}</Text>
              </View>
              <Text style={styles.chapterName}>{ch.name}</Text>
              {playing ? (
                <Icon name="play" size={15} color={colors.accent} />
              ) : null}
            </TouchableOpacity>
          );
        })}

        {/* ---------------- Notes ---------------- */}
        <TouchableOpacity style={styles.notes} activeOpacity={0.85}>
          <View style={styles.notesIcon}>
            <Icon
              name="file-document-outline"
              size={18}
              color={DISCIPLINE.swim}
            />
          </View>
          <View style={styles.notesBody}>
            <Text style={styles.notesTitle}>Threshold pacing — notes</Text>
            <Text style={styles.notesSub}>
              PDF · 4 pages · download for offline
            </Text>
          </View>
          <Icon name="chevron-right" size={17} color={colors.text3} />
        </TouchableOpacity>
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
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    player: {
      height: 196,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    playerBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    times: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 7,
    },
    time: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10.5,
      color: 'rgba(255,255,255,0.85)',
    },

    title: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 20,
      lineHeight: 24.4,
      letterSpacing: -0.56,
      color: c.text,
      marginTop: 16,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginTop: 10,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 11,
      color: '#06210C',
    },
    author: {
      flex: 1,
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12.5,
      color: c.text2,
    },

    formats: {
      marginTop: 15,
    },
    blurb: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13.5,
      lineHeight: 22.7,
      color: c.text2,
      marginTop: 17,
    },

    chapter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      paddingVertical: 13,
      paddingHorizontal: 14,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    chapterGap: {
      marginTop: 9,
    },
    chapterOn: {
      borderColor: c.accentBorderSoft,
    },
    chapterTime: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface3,
    },
    chapterTimeText: {
      fontFamily: MONO,
      fontSize: 11,
      color: c.text2,
    },
    chapterName: {
      flex: 1,
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      letterSpacing: -0.2,
      color: c.text,
    },

    notes: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      marginTop: 16,
      padding: 16,
      borderRadius: RADIUS.lg,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    notesIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(DISCIPLINE.swim, 0.15),
    },
    notesBody: {
      flex: 1,
      minWidth: 0,
    },
    notesTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      color: c.text,
    },
    notesSub: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      color: c.text3,
      marginTop: 2,
    },
  });

export default GuideScreen;
