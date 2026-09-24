import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

export type FormatKey = 'pdf' | 'video' | 'audio';

/** The three content formats served from the admin console. */
export const FORMAT: Record<FormatKey, { icon: string; label: string }> = {
  pdf: { icon: 'file-document-outline', label: 'PDF' },
  video: { icon: 'video-outline', label: 'Video' },
  audio: { icon: 'volume-high', label: 'Audio' },
};

type Props = {
  format: FormatKey;
  iconSize?: number;
  /** Overrides the default label, e.g. "Audio 6:12" */
  label?: string;
};

/** The mockup's `.fmt` chip. */
const FormatChip = ({ format, iconSize = 12, label }: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const meta = FORMAT[format];

  return (
    <View style={styles.chip}>
      <Icon name={meta.icon} size={iconSize} color={colors.text2} />
      <Text style={styles.label}>{label ?? meta.label}</Text>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 5,
      paddingHorizontal: 9,
      borderRadius: 8,
      backgroundColor: c.surface3,
      borderWidth: 1,
      borderColor: c.border,
    },
    label: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10.5,
      color: c.text2,
    },
  });

export default FormatChip;
