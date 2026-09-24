import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import { Fonts, BRAND, ScreenNames, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

/** Same artwork pairing and edge-crop as the splash. */
const LOGO = {
  dark: { src: require('../assets/images/logo-dark.jpeg'), w: 1280, h: 630 },
  light: { src: require('../assets/images/logo-white.jpeg'), w: 1170, h: 494 },
};
const LOGO_W = Math.min(210, width * 0.56);

const DISCIPLINES = ['run', 'bike', 'swim', 'dumbbell'];

/** 01 — WELCOME (otcf-app.js → `welcome`) */
const WelcomeScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const logo = isDark ? LOGO.dark : LOGO.light;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {/* the mockup's blurred accent glow, top-right */}
          <Svg style={styles.glow} pointerEvents="none">
            <Defs>
              <RadialGradient
                id="welcomeGlow"
                cx="82%"
                cy="6%"
                rx="70%"
                ry="46%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop
                  offset="0"
                  stopColor={BRAND.g500}
                  stopOpacity={isDark ? 0.3 : 0.2}
                />
                <Stop offset="1" stopColor={BRAND.g500} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#welcomeGlow)"
            />
          </Svg>

          <View
            style={[
              styles.logoFrame,
              { width: LOGO_W, height: LOGO_W * (logo.h / logo.w) },
            ]}
          >
            <Image source={logo.src} style={styles.logo} resizeMode="cover" />
          </View>

          <Text style={styles.headline}>
            Your plan.{'\n'}Your data.{'\n'}
            <Text style={styles.headlineAccent}>Your coach.</Text>
          </Text>

          <Text style={styles.lede}>
            Training plans, wearable tracking, nutrition and an AI coach that
            sees all three — in one app.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.discRow}>
            {DISCIPLINES.map(d => (
              <View key={d} style={styles.discTile}>
                <Icon name={d} size={21} color={colors.text3} />
              </View>
            ))}
          </View>

          <Button
            label="Start your journey"
            iconRight="chevron-right"
            onPress={() => navigation.navigate(ScreenNames.Goal)}
          />

          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already training with us? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ScreenNames.Login)}
            >
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      flexGrow: 1,
    },
    hero: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 30,
      paddingVertical: 40,
    },
    glow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    logoFrame: {
      overflow: 'hidden',
      borderRadius: 12,
      marginBottom: 38,
    },
    logo: {
      width: '101%',
      height: '101%',
    },
    headline: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 37,
      lineHeight: 39,
      letterSpacing: -1.4,
      color: c.text,
    },
    headlineAccent: {
      color: c.accent,
    },
    lede: {
      fontFamily: Fonts.InterRegular,
      fontSize: 14.5,
      lineHeight: 23,
      color: c.text2,
      marginTop: 18,
      maxWidth: 320,
    },
    footer: {
      paddingHorizontal: 22,
      paddingBottom: 26,
    },
    discRow: {
      flexDirection: 'row',
      gap: 9,
      marginBottom: 20,
    },
    discTile: {
      flex: 1,
      height: 46,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    signInRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    signInText: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12.5,
      color: c.text3,
    },
    signInLink: {
      fontFamily: Fonts.InterBold,
      fontSize: 12.5,
      color: c.accent,
    },
  });

export default WelcomeScreen;
