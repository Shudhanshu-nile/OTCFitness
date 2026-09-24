import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, RADIUS, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  icon: string;
  label: string;
  value: string;
  /** Trailing unit rendered smaller, e.g. "m" or " bpm" */
  unit?: string;
  delta?: string;
  /** Tints the delta line with the brand accent. */
  up?: boolean;
};

/** The mockup's `.tile` metric card. */
const StatTile = ({ icon, label, value, unit, delta, up }: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.tile}>
      <View style={styles.head}>
        <Icon name={icon} size={14} color={colors.text3} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </Text>

      {delta ? (
        <Text style={[styles.delta, up && styles.deltaUp]}>{delta}</Text>
      ) : null}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.md,
      paddingVertical: 13,
      paddingHorizontal: 14,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    label: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11,
      letterSpacing: 0.2,
      color: c.text3,
    },
    value: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 21,
      letterSpacing: -0.63,
      color: c.text,
      marginTop: 7,
    },
    unit: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      letterSpacing: 0,
      color: c.text3,
    },
    delta: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
      marginTop: 3,
    },
    deltaUp: {
      color: c.accent,
    },
  });

export default StatTile;
