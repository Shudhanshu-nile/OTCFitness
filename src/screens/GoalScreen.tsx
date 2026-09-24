import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import StepDots from '../components/StepDots';
import OptionRow from '../components/OptionRow';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

const GOALS = [
  {
    id: 'event',
    icon: 'trophy-outline',
    iconColor: DISCIPLINE.brick,
    title: 'A specific event',
    subtitle: 'Pick your race and we build backwards from the date',
  },
  {
    id: 'target',
    icon: 'target',
    iconColor: DISCIPLINE.run,
    title: 'A distance or time goal',
    subtitle: 'No race booked yet — set a target date',
  },
  {
    id: 'fitness',
    icon: 'heart-outline',
    iconColor: DISCIPLINE.swim,
    title: 'General fitness & longevity',
    subtitle: 'Ongoing health, strength and conditioning',
  },
];

const EVENT = {
  name: 'Ironman 70.3 Staffordshire',
  date: '7 June',
  place: 'Staffordshire',
  weeks: 16,
  detail:
    'Swim 1.9km · Bike 90km · Run 21.1km — lake swim, rolling bike course',
};

/** 02 — ONBOARDING: GOAL & EVENT (otcf-app.js → `goal`) */
const GoalScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [selected, setSelected] = useState('event');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar
        barStyle={colors.scheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <NavBar
        title="Your goal"
        onBack={() => navigation.goBack()}
        right={<Text style={styles.step}>Step 4 of 7</Text>}
      />
      <StepDots total={7} completed={4} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h2}>What are you training for?</Text>
        <Text style={styles.lede}>
          This sets your plan length, your phases and how your taper is built.
        </Text>

        {GOALS.map((g, i) => (
          <View key={g.id} style={i > 0 && styles.optGap}>
            <OptionRow
              icon={g.icon}
              iconColor={g.iconColor}
              title={g.title}
              subtitle={g.subtitle}
              selected={selected === g.id}
              onPress={() => setSelected(g.id)}
            />
          </View>
        ))}

        <SectionTitle title="Your event" action="Change" />

        <View style={styles.eventCard}>
          <View style={styles.eventIcon}>
            <Icon name="trophy-outline" size={22} color={DISCIPLINE.brick} />
          </View>

          <View style={styles.eventBody}>
            <Text style={styles.eventName}>{EVENT.name}</Text>
            <View style={styles.eventMeta}>
              <View style={styles.metaItem}>
                <Icon
                  name="calendar-blank-outline"
                  size={12}
                  color={colors.text3}
                />
                <Text style={styles.metaText}>{EVENT.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon
                  name="map-marker-outline"
                  size={12}
                  color={colors.text3}
                />
                <Text style={styles.metaText}>{EVENT.place}</Text>
              </View>
            </View>
          </View>

          <View style={styles.eventWeeks}>
            <Text style={styles.weeksValue}>{EVENT.weeks}</Text>
            <Text style={styles.weeksLabel}>weeks</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Icon name="information-outline" size={14} color={colors.text3} />
          <Text style={styles.infoText}>{EVENT.detail}</Text>
        </View>

        <Button
          label="Build my plan"
          iconRight="chevron-right"
          style={styles.cta}
          onPress={() => navigation.navigate(ScreenNames.PlanPreview)}
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
    step: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      color: c.text3,
    },
    h2: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 25,
      lineHeight: 28.5,
      letterSpacing: -0.8,
      color: c.text,
      marginTop: 6,
      marginBottom: 6,
    },
    lede: {
      fontFamily: Fonts.InterRegular,
      fontSize: 13.5,
      lineHeight: 21,
      color: c.text2,
      marginBottom: 20,
    },
    optGap: {
      marginTop: 10,
    },

    eventCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      padding: 14,
      borderRadius: RADIUS.lg,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    eventIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(224,87,75,0.15)',
    },
    eventBody: {
      flex: 1,
      minWidth: 0,
    },
    eventName: {
      fontFamily: Fonts.InterBold,
      fontSize: 14.5,
      letterSpacing: -0.29,
      color: c.text,
    },
    eventMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 3,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.text3,
    },
    eventWeeks: {
      alignItems: 'flex-end',
    },
    weeksValue: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 19,
      letterSpacing: -0.57,
      color: c.accent,
    },
    weeksLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 9.5,
      letterSpacing: 0.57,
      textTransform: 'uppercase',
      color: c.text3,
    },

    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    infoText: {
      flex: 1,
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
    },
    cta: {
      marginTop: 22,
    },
  });

export default GoalScreen;
