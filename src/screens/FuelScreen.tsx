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

import SectionTitle from '../components/SectionTitle';
import ProgressRing from '../components/ProgressRing';
import TrackBar from '../components/TrackBar';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

/* Static demo content — index.html (Option 2) → otcf-app.js → `fuel`. */

const DAY = {
  eyebrow: 'Tuesday · Threshold day',
  title: 'Fuel',
};

const ENERGY = {
  consumed: '1,840',
  target: 'of 2,650',
  percent: 69,
  remaining: '810 kcal left',
  note: "Target raised 320 kcal for today's threshold session",
  badge: 'Training-adjusted',
};

const MACROS = [
  {
    name: 'Protein',
    value: 96,
    target: 135,
    unit: 'g',
    color: DISCIPLINE.strength,
  },
  { name: 'Carbs', value: 214, target: 330, unit: 'g', color: DISCIPLINE.bike },
  { name: 'Fat', value: 58, target: 78, unit: 'g', color: DISCIPLINE.swim },
];

const RECOVERY = {
  title: 'Recovery window open',
  body: '25–30g protein in the next 45 minutes',
};

const MEALS = [
  {
    title: 'Porridge, banana, honey',
    meta: 'Breakfast · 07:10',
    kcal: '412',
    color: DISCIPLINE.bike,
    icon: 'silverware-fork-knife',
  },
  {
    title: 'Whey & oat shake',
    meta: 'Post-session · 09:30',
    kcal: '286',
    color: DISCIPLINE.strength,
    icon: 'water',
  },
  {
    title: 'Chicken salad, sourdough',
    meta: 'Lunch · 13:05',
    kcal: '648',
    color: DISCIPLINE.run,
    icon: 'silverware-fork-knife',
  },
  {
    title: 'Greek yoghurt, berries',
    meta: 'Snack · 16:20',
    kcal: '194',
    color: DISCIPLINE.swim,
    icon: 'food-apple',
  },
];

const SESSION_FUELLING = [
  { when: 'Before', what: '40–60g carbs, 90 min out', color: DISCIPLINE.bike },
  { when: 'During', what: '500ml with electrolyte', color: DISCIPLINE.swim },
  { when: 'After', what: '25–30g protein + carbs', color: DISCIPLINE.strength },
];

/** 11 — NUTRITION (otcf-app.js → `fuel`) */
const FuelScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const openScan = () => navigation.navigate(ScreenNames.Scan);

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
            <Text style={styles.headSub}>{DAY.eyebrow}</Text>
            <Text style={styles.headTitle}>{DAY.title}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.75}
            onPress={openScan}
          >
            <Icon name="camera-outline" size={18} color={colors.text2} />
          </TouchableOpacity>
        </View>

        <View style={styles.pad}>
          {/* ---------------- Energy + macros ---------------- */}
          <View style={styles.energyCard}>
            <View style={styles.energyRow}>
              <ProgressRing
                percent={ENERGY.percent}
                value={ENERGY.consumed}
                caption={ENERGY.target}
                size={92}
                color={DISCIPLINE.bike}
              />

              <View style={styles.flex1}>
                <Text style={styles.energyRemaining}>{ENERGY.remaining}</Text>
                <Text style={styles.energyNote}>{ENERGY.note}</Text>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: withAlpha(DISCIPLINE.bike, 0.14) },
                  ]}
                >
                  <Icon
                    name="lightning-bolt"
                    size={11}
                    color={DISCIPLINE.bike}
                  />
                  <Text style={[styles.badgeText, { color: DISCIPLINE.bike }]}>
                    {ENERGY.badge}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {MACROS.map((m, i) => (
              <View key={m.name} style={i > 0 && styles.macroGap}>
                <View style={styles.macroHead}>
                  <Text style={styles.macroName}>{m.name}</Text>
                  <Text style={styles.macroValue}>
                    {m.value} / {m.target}
                    {m.unit}
                  </Text>
                </View>
                <TrackBar
                  percent={(m.value / m.target) * 100}
                  color={m.color}
                  trackColor={colors.surface}
                />
              </View>
            ))}
          </View>

          {/* ---------------- Log actions ---------------- */}
          <View style={styles.actions}>
            <Button
              label="Snap a meal"
              iconLeft="camera-outline"
              onPress={openScan}
              style={styles.actionWide}
            />
            <Button
              label="Manual"
              variant="secondary"
              iconLeft="plus"
              style={styles.flex1}
            />
          </View>

          {/* ---------------- Recovery window ---------------- */}
          <View style={styles.recoveryCard}>
            <View style={styles.recoveryIcon}>
              <Icon name="clock-outline" size={17} color={colors.accentInk} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.recoveryTitle}>{RECOVERY.title}</Text>
              <Text style={styles.recoveryBody}>{RECOVERY.body}</Text>
            </View>
          </View>

          {/* ---------------- Today's meals ---------------- */}
          <SectionTitle title="Today" action={`${MEALS.length} meals`} />

          <View style={styles.mealCard}>
            {MEALS.map((meal, i) => (
              <View
                key={meal.title}
                style={[styles.meal, i > 0 && styles.mealDivider]}
              >
                <View
                  style={[
                    styles.mealThumb,
                    { backgroundColor: withAlpha(meal.color, 0.15) },
                  ]}
                >
                  <Icon name={meal.icon} size={19} color={meal.color} />
                </View>

                <View style={styles.flex1}>
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <Text style={styles.mealMeta}>{meal.meta}</Text>
                </View>

                <Text style={styles.mealKcal}>{meal.kcal}</Text>
              </View>
            ))}
          </View>

          {/* ---------------- Fuelling this session ---------------- */}
          <SectionTitle title="Fuelling this session" />

          <View style={styles.card}>
            {SESSION_FUELLING.map((row, i) => (
              <View
                key={row.when}
                style={[styles.fuelRow, i > 0 && styles.fuelRowGap]}
              >
                <Text style={[styles.fuelWhen, { color: row.color }]}>
                  {row.when}
                </Text>
                <Text style={styles.fuelWhat}>{row.what}</Text>
              </View>
            ))}
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

    /* energy card */
    energyCard: {
      backgroundColor: c.surface3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },
    energyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    energyRemaining: {
      fontFamily: Fonts.InterBold,
      fontSize: 12,
      letterSpacing: -0.12,
      color: c.text,
    },
    energyNote: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.text3,
      marginTop: 3,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 5,
      marginTop: 9,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: 7,
    },
    badgeText: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10.5,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 15,
    },

    /* macros */
    macroGap: {
      marginTop: 13,
    },
    macroHead: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 7,
    },
    macroName: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12.5,
      color: c.text,
    },
    macroValue: {
      marginLeft: 'auto',
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.text3,
    },

    /* actions */
    actions: {
      flexDirection: 'row',
      gap: 9,
      marginTop: 13,
    },
    actionWide: {
      flex: 2,
    },

    /* recovery window */
    recoveryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      marginTop: 13,
      padding: 16,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: c.accentBorderSoft,
      backgroundColor: c.accentBgSoft,
    },
    recoveryIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accent,
    },
    recoveryTitle: {
      fontFamily: Fonts.InterBold,
      fontSize: 12.5,
      color: c.text,
    },
    recoveryBody: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.text2,
      marginTop: 2,
    },

    /* meals */
    mealCard: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      paddingHorizontal: 15,
      paddingVertical: 4,
    },
    meal: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 11,
    },
    mealDivider: {
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    mealThumb: {
      width: 46,
      height: 46,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mealTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13.5,
      color: c.text,
    },
    mealMeta: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      color: c.text3,
      marginTop: 2,
    },
    mealKcal: {
      fontFamily: Fonts.InterBold,
      fontSize: 13.5,
      color: c.text,
    },

    /* generic card */
    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },

    /* fuelling this session */
    fuelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    fuelRowGap: {
      marginTop: 12,
    },
    fuelWhen: {
      width: 52,
      fontFamily: Fonts.InterBold,
      fontSize: 10.5,
      letterSpacing: 0.74,
      textTransform: 'uppercase',
    },
    fuelWhat: {
      flex: 1,
      fontFamily: Fonts.InterRegular,
      fontSize: 12.5,
      lineHeight: 18,
      color: c.text2,
    },
  });

export default FuelScreen;
