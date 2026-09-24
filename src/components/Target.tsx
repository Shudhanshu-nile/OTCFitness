import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

/** otcf.css `--fm` — the monospace face used for numeric targets. */
export const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

type Props = {
  label: string;
  /** Optional leading icon, as in the session's "1h 15m / Zone 4" row */
  icon?: string;
};

/** The mockup's `.tgt` monospace target chip. */
const Target = ({ label, icon }: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.chip}>
      {icon ? <Icon name={icon} size={13} color={colors.text2} /> : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 7,
      backgroundColor: c.surface3,
    },
    label: {
      fontFamily: MONO,
      fontSize: 11,
      color: c.text2,
    },
  });

export default Target;
