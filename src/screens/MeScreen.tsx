import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Switch,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionTitle from '../components/SectionTitle';
import StatTile from '../components/StatTile';
import { Fonts, RADIUS, BRAND, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';
import { useHealthSources } from '../hooks/useHealthSources';
import type { HealthSnapshot } from '../services/health';
import { formatRelative } from '../utils/time';

/* Static demo content — index.html (Option 2) → otcf-app.js → `me`. */

const PROFILE = {
  name: 'Jess Whitmore',
  initials: 'JW',
  detail: 'Intermediate · 3rd season',
  plan: 'PRO · Annual',
};

const TILES = [
  { icon: 'fire', label: 'Streak', value: '23', unit: ' days' },
  { icon: 'trophy-outline', label: 'Sessions', value: '184' },
];

/** Baselines a coach can push from a real Wattbike or lactate test. */
const NUMBERS = [
  { name: 'Bike FTP', value: '268 W', source: 'Wattbike test · 4 Mar' },
  { name: 'Run threshold', value: '4:42 /km', source: 'Field test · 18 Feb' },
  { name: 'Swim CSS', value: '1:48 /100m', source: '400m TT · 22 Feb' },
  { name: 'Max HR', value: '186 bpm', source: 'From training data' },
];

type SourceRow = {
  name: string;
  status: string;
  connected: boolean;
  /** Absent when there is nothing this device can do about it. */
  onConnect?: () => void;
};

/**
 * Apple Health and Garmin are read from HealthKit; Garmin reaches us through
 * Apple Health, exactly as the mockup describes. Health Connect is the Android
 * equivalent and stays inert on iOS.
 */
const buildSources = (
  snapshot: HealthSnapshot,
  connect: () => void,
): SourceRow[] => {
  const { supported, asked, garmin, lastWorkout, error } = snapshot;

  const appleStatus = !supported
    ? 'Not available on this device'
    : error
    ? error
    : !asked
    ? 'Tap Connect to allow access'
    : lastWorkout
    ? `Connected · ${formatRelative(lastWorkout)}`
    : 'Connected · no workouts yet';

  // A refused read looks identical to no data on iOS, so this stays neutral.
  const garminStatus = !supported
    ? 'Needs Apple Health'
    : !asked
    ? 'Via Apple Health'
    : garmin
    ? `Via Apple Health · ${formatRelative(garmin.lastSync)}`
    : 'No Garmin data in Apple Health yet';

  return [
    {
      name: 'Apple Health',
      status: appleStatus,
      connected: supported && asked && !error,
      onConnect: supported ? connect : undefined,
    },
    {
      name: garmin?.name ?? 'Garmin Forerunner',
      status: garminStatus,
      connected: !!garmin,
      onConnect: supported && !asked ? connect : undefined,
    },
    { name: 'Health Connect', status: 'Android only', connected: false },
  ];
};

const MORE = [
  {
    icon: 'chart-bar',
    label: 'Progress & analytics',
    route: ScreenNames.Analytics,
  },
  {
    icon: 'bell-outline',
    label: 'Notifications',
    route: ScreenNames.Notifications,
  },
  { icon: 'shield-check-outline', label: 'Privacy & your data' },
  { icon: 'book-open-outline', label: 'Help & FAQ' },
];

/** 15 — PROFILE (otcf-app.js → `me`), plus the app's appearance and onboarding controls. */
const MeScreen = ({ navigation }: any) => {
  const { colors, isDark, mode, setMode, toggleDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { completed, reset } = useOnboarding();
  const { snapshot, loading, connect } = useHealthSources();
  const sources = buildSources(snapshot, connect);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- App header ---------------- */}
        <View style={styles.appHead}>
          <Text style={styles.headTitle}>You</Text>
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel="Settings"
          >
            <Icon name="cog-outline" size={18} color={colors.text2} />
          </TouchableOpacity>
        </View>

        <View style={styles.pad}>
          {/* ---------------- Profile header ---------------- */}
          <View style={styles.profile}>
            {/* Gradient as an absolute fill: a padded LinearGradient only
                paints its content box on iOS. */}
            <View style={styles.avatar}>
              <LinearGradient
                colors={[BRAND.g400, BRAND.g700]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.fill}
              />
              <Text style={styles.avatarText}>{PROFILE.initials}</Text>
            </View>

            <View style={styles.flex1}>
              <Text style={styles.profileName}>{PROFILE.name}</Text>
              <Text style={styles.profileDetail}>{PROFILE.detail}</Text>
              <View style={styles.planBadge}>
                <Icon name="lightning-bolt" size={11} color={colors.accent} />
                <Text style={styles.planBadgeText}>{PROFILE.plan}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tiles}>
            {TILES.map(tile => (
              <StatTile key={tile.label} {...tile} />
            ))}
          </View>

          {/* ---------------- Your numbers ---------------- */}
          <SectionTitle title="Your numbers" action="Update" />

          <View style={styles.listCard}>
            {NUMBERS.map((n, i) => (
              <View
                key={n.name}
                style={[styles.navRow, i > 0 && styles.navRowDivider]}
              >
                <View style={styles.flex1}>
                  <Text style={styles.navTitle}>{n.name}</Text>
                  <Text style={styles.navSub}>{n.source}</Text>
                </View>
                <Text style={styles.navValue}>{n.value}</Text>
              </View>
            ))}
          </View>

          {/* ---------------- Data sources ---------------- */}
          <SectionTitle title="Data sources" />

          <View style={styles.listCard}>
            {sources.map((s, i) => (
              <View
                key={s.name}
                style={[styles.navRow, i > 0 && styles.navRowDivider]}
              >
                <View
                  style={[
                    styles.sourceIcon,
                    s.connected && styles.sourceIconOn,
                  ]}
                >
                  <Icon
                    name="watch-variant"
                    size={17}
                    color={s.connected ? colors.accent : colors.text3}
                  />
                </View>

                <View style={styles.flex1}>
                  <Text style={styles.navTitle}>{s.name}</Text>
                  <Text style={styles.navSub}>{s.status}</Text>
                </View>

                {loading ? (
                  <ActivityIndicator size="small" color={colors.text3} />
                ) : s.connected ? (
                  <Icon
                    name="check-circle-outline"
                    size={18}
                    color={colors.accent}
                  />
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.connectChip,
                      !s.onConnect && styles.connectChipOff,
                    ]}
                    activeOpacity={0.75}
                    disabled={!s.onConnect}
                    onPress={s.onConnect}
                  >
                    <Text style={styles.connectText}>Connect</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* ---------------- Appearance ---------------- */}
          <SectionTitle title="Appearance" />

          <View style={styles.card}>
            {/* The whole row toggles — the Switch alone is a small target. */}
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              accessibilityRole="switch"
              accessibilityState={{ checked: isDark }}
              accessibilityLabel="Dark mode"
              onPress={toggleDark}
            >
              <View style={styles.rowIcon}>
                <Icon
                  name={isDark ? 'weather-night' : 'white-balance-sunny'}
                  size={19}
                  color={colors.accent}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.navTitle}>Dark mode</Text>
                <Text style={styles.navSub}>
                  {mode === 'system'
                    ? `Following your device — currently ${
                        isDark ? 'dark' : 'light'
                      }`
                    : `Set manually to ${mode}`}
                </Text>
              </View>

              <Switch
                value={isDark}
                onValueChange={toggleDark}
                trackColor={{ false: colors.surface3, true: colors.accent }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.surface3}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              />
            </TouchableOpacity>

            {mode !== 'system' ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.resetBtn}
                onPress={() => setMode('system')}
              >
                <Icon name="cellphone-cog" size={14} color={colors.accent} />
                <Text style={styles.resetText}>Match my device again</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* ---------------- More ---------------- */}
          <SectionTitle title="More" />

          <View style={styles.listCard}>
            {MORE.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                disabled={!item.route}
                style={[styles.navRow, i > 0 && styles.navRowDivider]}
                onPress={() => item.route && navigation.navigate(item.route)}
              >
                <Icon name={item.icon} size={18} color={colors.text3} />
                <Text style={[styles.navTitle, styles.flex1]}>
                  {item.label}
                </Text>
                <Icon name="chevron-right" size={18} color={colors.text3} />
              </TouchableOpacity>
            ))}

            {/* `completed` flips to false the moment reset() lands, so the
                row confirms itself instead of looking like a dead tap. */}
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!completed}
              style={[styles.navRow, styles.navRowDivider]}
              onPress={reset}
            >
              <Icon
                name={completed ? 'restart' : 'check-circle-outline'}
                size={18}
                color={completed ? colors.text3 : colors.accent}
              />
              <View style={styles.flex1}>
                <Text style={styles.navTitle}>Replay onboarding</Text>
                <Text style={styles.navSub}>
                  {completed
                    ? 'Show Welcome, Goal and Plan preview on next launch'
                    : 'Queued — it will show next time you open the app'}
                </Text>
              </View>
              {completed ? (
                <Icon name="chevron-right" size={18} color={colors.text3} />
              ) : null}
            </TouchableOpacity>
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
    scrollContent: {
      paddingBottom: 26,
    },
    flex1: {
      flex: 1,
      minWidth: 0,
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

    /* app header */
    appHead: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 22,
      paddingTop: 6,
      paddingBottom: 14,
    },
    headTitle: {
      flex: 1,
      fontFamily: Fonts.InterExtraBold,
      fontSize: 26,
      letterSpacing: -0.83,
      color: c.text,
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

    /* profile header */
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 62,
      height: 62,
      borderRadius: 21,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 21,
      letterSpacing: -0.42,
      color: '#06210C',
    },
    profileName: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 19,
      letterSpacing: -0.53,
      color: c.text,
    },
    profileDetail: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12.5,
      color: c.text3,
      marginTop: 3,
    },
    planBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 5,
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: 7,
      backgroundColor: c.accentBgStrong,
    },
    planBadgeText: {
      fontFamily: Fonts.InterBold,
      fontSize: 10.5,
      color: c.accent,
    },

    tiles: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },

    /* list cards (.srow-nav) */
    listCard: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
    },
    navRowDivider: {
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    navTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 14,
      color: c.text,
    },
    navSub: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
      marginTop: 2,
    },
    navValue: {
      fontFamily: Fonts.InterBold,
      fontSize: 14,
      color: c.text,
    },

    /* data sources */
    sourceIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface3,
    },
    sourceIconOn: {
      backgroundColor: c.accentBgStrong,
    },
    connectChip: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.border,
    },
    connectChipOff: {
      opacity: 0.45,
    },
    connectText: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      color: c.text2,
    },

    /* appearance */
    card: {
      borderRadius: RADIUS.lg,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      padding: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
    },
    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentBgStrong,
    },
    resetBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 14,
      paddingTop: 13,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    resetText: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12.5,
      color: c.accent,
    },
  });

export default MeScreen;
