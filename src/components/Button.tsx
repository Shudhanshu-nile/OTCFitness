import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  label: string;
  onPress?: () => void;
  /** `primary` = .btn-p, `ghost` = .btn-g, `secondary` = .btn-s */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Icon rendered before the label */
  iconLeft?: string;
  /** Icon rendered after the label */
  iconRight?: string;
  style?: any;
};

/** The mockup's `.btn` family. */
const Button = ({
  label,
  onPress,
  variant = 'primary',
  iconLeft,
  iconRight,
  style,
}: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const tint =
    variant === 'primary'
      ? colors.accentInk
      : variant === 'secondary'
      ? colors.text
      : colors.text2;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.base, styles[variant], style]}
    >
      {iconLeft ? <Icon name={iconLeft} size={16} color={tint} /> : null}
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      {iconRight ? <Icon name={iconRight} size={17} color={tint} /> : null}
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: 14,
      width: '100%',
    },
    primary: {
      backgroundColor: c.accent,
    },
    secondary: {
      backgroundColor: c.surface3,
      borderWidth: 1,
      borderColor: c.border2,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.border,
    },
    label: {
      fontFamily: Fonts.InterBold,
      fontSize: 14.5,
      letterSpacing: -0.15,
    },
  });

export default Button;
