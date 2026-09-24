import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pill from './Pill';
import { Fonts, RADIUS, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  icon: string;
  iconColor: string;
  /** Tinted background behind the icon */
  iconBg: string;
  title: string;
  /** Plain string, or a node when the line carries inline format icons. */
  subtitle: React.ReactNode;
  pill?: { label: string; tone?: 'free' | 'pro' | 'new' };
  /** Dims the row and shows a lock instead of a pill. */
  locked?: boolean;
  /** Trailing chevron, for rows that open something. */
  chevron?: boolean;
  onPress?: () => void;
};

/** The mockup's `.crow` included-content row. */
const ContentRow = ({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  pill,
  locked,
  chevron,
  onPress,
}: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
      style={[styles.row, locked && styles.rowLocked]}
      onPress={onPress}
    >
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={19} color={iconColor} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {typeof subtitle === 'string' ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : (
          <View style={styles.subtitleRow}>{subtitle}</View>
        )}
      </View>

      {locked ? (
        <Icon name="lock-outline" size={17} color={colors.text3} />
      ) : pill ? (
        <Pill label={pill.label} tone={pill.tone} />
      ) : chevron ? (
        <Icon name="chevron-right" size={17} color={colors.text3} />
      ) : null}
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 13,
      borderRadius: RADIUS.md,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    rowLocked: {
      opacity: 0.55,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13.5,
      letterSpacing: -0.16,
      color: c.text,
    },
    subtitle: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      color: c.text3,
      marginTop: 2,
    },
    subtitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginTop: 2,
    },
  });

export default ContentRow;
