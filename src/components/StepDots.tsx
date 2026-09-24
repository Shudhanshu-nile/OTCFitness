import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

type Props = {
  total: number;
  /** How many segments are filled */
  completed: number;
};

/** The mockup's `.steps` onboarding progress bar. */
const StepDots = ({ total, completed }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.seg, i < completed && styles.segOn]} />
      ))}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 5,
      paddingHorizontal: 22,
      paddingBottom: 14,
    },
    seg: {
      flex: 1,
      height: 3.5,
      borderRadius: 99,
      backgroundColor: c.surface3,
    },
    segOn: {
      backgroundColor: c.accent,
    },
  });

export default StepDots;
