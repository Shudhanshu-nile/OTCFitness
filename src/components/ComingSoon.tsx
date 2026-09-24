import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts, RADIUS, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  title: string;
  icon: string;
  blurb: string;
};

/**
 * Placeholder body for the screens that are not built yet, so every tab and
 * link in the app is walkable while the rest lands.
 */
const ComingSoon = ({ title, icon, blurb }: Props) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.badge}>
          <Icon name={icon} size={28} color={colors.accent} />
        </View>
        <Text style={styles.blurb}>{blurb}</Text>
        <Text style={styles.note}>Coming in a later build</Text>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bg,
    },
    head: {
      paddingHorizontal: 22,
      paddingTop: 6,
      paddingBottom: 14,
    },
    title: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 26,
      letterSpacing: -0.83,
      color: c.text,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 46,
    },
    badge: {
      width: 64,
      height: 64,
      borderRadius: RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    blurb: {
      fontFamily: Fonts.InterMedium,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      color: c.text2,
      marginTop: 20,
    },
    note: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10.5,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: c.text3,
      marginTop: 12,
    },
  });

export default ComingSoon;
