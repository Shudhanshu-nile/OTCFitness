import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts, ScreenNames, BRAND, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';

const { width } = Dimensions.get('window');

/**
 * The two logo files differ in size, and both carry a couple of columns of
 * JPEG ringing at the edges. We size the frame to each artwork's own aspect
 * ratio and overfill by 1% with `cover`, so the ringing is cropped away and
 * the artwork's white/black ground blends into the splash gradient.
 */
const LOGO = {
  dark: { src: require('../assets/images/logo-dark.jpeg'), w: 1280, h: 630 },
  light: { src: require('../assets/images/logo-white.jpeg'), w: 1170, h: 494 },
};
const LOGO_W = width * 0.78;

const SplashScreen = ({ navigation }: { navigation: any }) => {
  const { gradients, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const logo = isDark ? LOGO.dark : LOGO.light;

  // Returning athletes skip straight to the app.
  const { completed, ready } = useOnboarding();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.86)).current;
  const tagAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(barAnim, {
      toValue: 1,
      duration: 2600,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, scaleAnim, tagAnim, barAnim]);

  // Hold the splash until both the animation window and the stored
  // onboarding flag are done, then route once.
  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      navigation.replace(completed ? ScreenNames.Main : ScreenNames.Welcome);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, ready, completed]);

  return (
    <LinearGradient
      colors={gradients.splash}
      locations={gradients.splashLocations}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoContainer,
            { width: LOGO_W, height: LOGO_W * (logo.h / logo.w) },
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={logo.src} style={styles.logo} resizeMode="cover" />
        </Animated.View>

        <Animated.View
          style={[
            styles.tagWrap,
            {
              opacity: tagAnim,
              transform: [
                {
                  translateY: tagAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.rule} />
          <Text style={styles.tagline}>
            The plan · the data · the food · the coach
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.trackFill,
              {
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['4%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.footerText}>offthatcouchfitness.co.uk</Text>
      </View>
    </LinearGradient>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    logo: {
      width: '101%',
      height: '101%',
    },
    tagWrap: {
      alignItems: 'center',
      marginTop: 26,
    },
    rule: {
      width: 34,
      height: 2,
      borderRadius: 2,
      backgroundColor: BRAND.g500,
      marginBottom: 16,
    },
    tagline: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.text2,
    },
    footer: {
      paddingBottom: 54,
      paddingHorizontal: 60,
      alignItems: 'center',
    },
    track: {
      width: '100%',
      height: 3,
      borderRadius: 99,
      backgroundColor: c.splashBar,
      overflow: 'hidden',
    },
    trackFill: {
      height: '100%',
      borderRadius: 99,
      backgroundColor: c.accent,
    },
    footerText: {
      marginTop: 16,
      fontFamily: Fonts.InterMedium,
      fontSize: 11,
      letterSpacing: 0.3,
      color: c.text3,
    },
  });

export default SplashScreen;
