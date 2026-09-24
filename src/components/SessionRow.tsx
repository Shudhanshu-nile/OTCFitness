import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, RADIUS, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

type Props = {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  /** Right-hand primary value, e.g. "30min" */
  value: string;
  /** Right-hand caption, e.g. "Evening" */
  caption: string;
  /** Completed sessions are dimmed with the title struck through. */
  done?: boolean;
  onPress?: () => void;
};

/** The mockup's `.srow` supporting-session row. */
const SessionRow = ({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  caption,
  done,
  onPress,
}: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
      style={[styles.row, done && styles.rowDone]}
      onPress={onPress}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      paddingVertical: 13,
      paddingHorizontal: 14,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.md,
    },
    rowDone: {
      opacity: 0.62,
    },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface3,
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 14,
      letterSpacing: -0.21,
      color: c.text,
    },
    titleDone: {
      textDecorationLine: 'line-through',
      textDecorationColor: c.text3,
    },
    subtitle: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      color: c.text3,
      marginTop: 2.5,
    },
    right: {
      alignItems: 'flex-end',
    },
    value: {
      fontFamily: Fonts.InterBold,
      fontSize: 13.5,
      color: c.text,
    },
    caption: {
      fontFamily: Fonts.InterRegular,
      fontSize: 10.5,
      color: c.text3,
      marginTop: 1,
    },
  });

export default SessionRow;
