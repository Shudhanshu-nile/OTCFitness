import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, RADIUS, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

type Props = {
  title: string;
  subtitle: string;
  /** The gated content, shown dimmed behind the lock face. */
  children: React.ReactNode;
};

/**
 * The mockup's `.lockover` — gated content shown in the open rather than
 * hidden, so the paywall is never a dead end.
 *
 * The CSS uses `filter: blur(3.5px)` on the content, which React Native has no
 * equivalent for without a native blur module. We keep the same .42 opacity
 * and the 45% surface scrim, so the shape still reads as "there, but not
 * yours yet" — just sharper than the mockup.
 */
const LockOverlay = ({ title, subtitle, children }: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.dimmed} pointerEvents="none">
        {children}
      </View>

      <View style={styles.face} pointerEvents="none">
        <Icon name="lock-outline" size={20} color={colors.text} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    wrap: {
      position: 'relative',
      borderRadius: RADIUS.md,
      overflow: 'hidden',
    },
    dimmed: {
      opacity: 0.42,
    },
    face: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      // The CSS pairs a 45% scrim with `blur(3.5px)`. With no blur the
      // gated rows stay sharp and fight the lock label, so the scrim carries
      // the whole job — heavier here, but the same read.
      backgroundColor: withAlpha(c.surface, 0.82),
    },
    title: {
      fontFamily: Fonts.InterBold,
      fontSize: 12.5,
      color: c.text,
    },
    subtitle: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11,
      color: c.text3,
    },
  });

export default LockOverlay;
