import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = Math.max(width, height);
const SCREEN_WIDTH = Math.min(width, height);

export const Sizes = {
  fixPadding: SCREEN_HEIGHT * 0.02,
  fixHorizontalPadding: SCREEN_WIDTH * 0.02,
};

// Screen dimension helpers
export const responsiveScreenHeight = (value: number) => {
  return (value / 100) * SCREEN_HEIGHT;
};

export const responsiveScreenWidth = (value: number) => {
  return (value / 100) * SCREEN_WIDTH;
};

// Fonts
export const Fonts = {
  InterRegular: 'Inter-Regular',
  InterMedium: 'Inter-Medium',
  InterSemiBold: 'Inter-SemiBold',
  InterBold: 'Inter-Bold',
  InterExtraBold: 'Inter-ExtraBold',
  InterBlack: 'Inter-Black',
};

// Screen Names
export const ScreenNames = {
  Splash: 'Splash',
  Welcome: 'Welcome',
  Goal: 'Goal',
  PlanPreview: 'PlanPreview',
  Login: 'Login',
  Register: 'Register',

  Main: 'Main',

  // Bottom tabs
  Today: 'Today',
  Plans: 'Plans',
  Coach: 'Coach',
  Fuel: 'Fuel',
  Me: 'Me',

  // Stack screens
  Session: 'Session',
  Calendar: 'Calendar',
  PlanDetail: 'PlanDetail',
  Paywall: 'Paywall',
  Guide: 'Guide',
  Scan: 'Scan',
  Analytics: 'Analytics',
  LogSession: 'LogSession',
  Notifications: 'Notifications',
};

// Colours are per-theme — read them with `useTheme()` from
// src/context/ThemeContext, not from a static map.
export {
  BRAND,
  DISCIPLINE,
  DISCIPLINE_META,
  RADIUS,
  DARK,
  LIGHT,
  gradientsFor,
  heroGlowOpacity,
  W,
  H,
} from './theme';
export type { Palette, DisciplineKey } from './theme';
