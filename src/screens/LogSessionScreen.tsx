import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '../components/NavBar';
import SectionTitle from '../components/SectionTitle';
import ChipRow from '../components/Chip';
import Button from '../components/Button';
import { Fonts, RADIUS, DISCIPLINE_META, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { addManualWorkout } from '../services/healthStore';
import type { TrainingDiscipline } from '../services/health';

/**
 * Logging a session by hand, for when there is no band — or for the
 * disciplines a phone can never detect on its own, like swimming and cycling.
 * These land in the same store as the band's sessions and sync the same way.
 */

const DISCIPLINES: { key: TrainingDiscipline; label: string; icon: string }[] =
  [
    { key: 'swim', label: 'Swim', icon: DISCIPLINE_META.swim.icon },
    { key: 'bike', label: 'Bike', icon: DISCIPLINE_META.bike.icon },
    { key: 'run', label: 'Run', icon: DISCIPLINE_META.run.icon },
    { key: 'strength', label: 'Strength', icon: DISCIPLINE_META.strength.icon },
    { key: 'other', label: 'Other', icon: 'dots-horizontal' },
  ];

const QUICK_MINUTES = ['30', '45', '60', '90'];
const WHEN = ['Today', 'Yesterday'];

const LogSessionScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const [discipline, setDiscipline] = useState<TrainingDiscipline>('run');
  const [minutes, setMinutes] = useState('45');
  const [when, setWhen] = useState('Today');
  const [saving, setSaving] = useState(false);

  const parsed = Number(minutes);
  const valid = Number.isFinite(parsed) && parsed > 0 && parsed <= 600;

  const save = async () => {
    if (!valid || saving) {
      return;
    }
    setSaving(true);

    // Mid-morning, so the session lands on the intended day in any timezone.
    const start = new Date();
    start.setHours(9, 0, 0, 0);
    if (when === 'Yesterday') {
      start.setDate(start.getDate() - 1);
    }

    await addManualWorkout({ start, minutes: parsed, discipline });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <NavBar title="Log a session" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="Discipline" />

        <View style={styles.disciplines}>
          {DISCIPLINES.map(d => {
            const on = d.key === discipline;
            const tint =
              d.key === 'other'
                ? colors.text3
                : DISCIPLINE_META[d.key as keyof typeof DISCIPLINE_META].color;

            return (
              <TouchableOpacity
                key={d.key}
                activeOpacity={0.8}
                style={[styles.discipline, on && styles.disciplineOn]}
                onPress={() => setDiscipline(d.key)}
              >
                <Icon
                  name={d.icon}
                  size={20}
                  color={on ? tint : colors.text3}
                />
                <Text
                  style={[
                    styles.disciplineLabel,
                    on && styles.disciplineLabelOn,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <SectionTitle title="How long" />

        <View style={styles.card}>
          <View style={styles.durationRow}>
            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              maxLength={3}
              selectionColor={colors.accent}
              placeholder="45"
              placeholderTextColor={colors.text3}
            />
            <Text style={styles.unit}>minutes</Text>
          </View>

          <View style={styles.quick}>
            <ChipRow
              options={QUICK_MINUTES}
              selected={minutes}
              onSelect={setMinutes}
            />
          </View>
        </View>

        <SectionTitle title="When" />
        <ChipRow options={WHEN} selected={when} onSelect={setWhen} />

        {!valid ? (
          <Text style={styles.hint}>
            Enter a duration between 1 and 600 minutes.
          </Text>
        ) : null}

        <View style={styles.save}>
          <Button
            label={saving ? 'Saving…' : 'Save session'}
            iconLeft="check"
            onPress={save}
          />
        </View>

        <Text style={styles.note}>
          Saved on this device alongside anything your band reports, and sent to
          your coach once the account sync is live.
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

    disciplines: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 9,
    },
    discipline: {
      flexGrow: 1,
      minWidth: 96,
      alignItems: 'center',
      gap: 7,
      paddingVertical: 14,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    disciplineOn: {
      borderColor: c.accent,
      backgroundColor: c.accentBgSoft,
    },
    disciplineLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      color: c.text3,
    },
    disciplineLabelOn: {
      color: c.text,
    },

    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.lg,
      padding: 16,
    },
    durationRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 10,
    },
    input: {
      minWidth: 88,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: RADIUS.sm,
      backgroundColor: c.surface3,
      borderWidth: 1,
      borderColor: c.border2,
      fontFamily: Fonts.InterExtraBold,
      fontSize: 26,
      letterSpacing: -0.7,
      color: c.text,
    },
    unit: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      color: c.text3,
    },
    quick: {
      marginTop: 14,
    },

    hint: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.bad,
      marginTop: 14,
    },
    save: {
      marginTop: 24,
    },
    note: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.text3,
      marginTop: 14,
      textAlign: 'center',
    },
  });

export default LogSessionScreen;
