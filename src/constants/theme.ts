import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/** Percentage-based width helper */
export const W = (v: number) => (width * v) / 100;
/** Percentage-based height helper */
export const H = (v: number) => (height * v) / 100;

/**
 * Design tokens from the Off That Couch Fitness UI mockup (otcf.css).
 * The mockup ships both themes and toggles between them, so the app carries
 * both token sets and follows the device colour scheme.
 */

/** Brand ramp — identical in both themes. */
export const BRAND = {
  g300: '#7BD489',
  g400: '#55BE63',
  g500: '#3FA448', // brand
  g600: '#2F8A38',
  g700: '#23702B',
  g900: '#10301A',
};

/** Per-discipline accents — identical in both themes. */
export const DISCIPLINE = {
  swim: '#29A9D4',
  bike: '#F0932B',
  run: '#3FA448',
  strength: '#8B72E0',
  brick: '#E0574B',
  rest: '#7C8A81',
};

export type DisciplineKey = keyof typeof DISCIPLINE;

/**
 * Colour, icon and label per discipline, so the week chart, the plan calendar
 * and the session rows all read from one place.
 */
export const DISCIPLINE_META: Record<
  DisciplineKey,
  { color: string; icon: string; label: string }
> = {
  swim: { color: DISCIPLINE.swim, icon: 'swim', label: 'Swim' },
  bike: { color: DISCIPLINE.bike, icon: 'bike', label: 'Bike' },
  run: { color: DISCIPLINE.run, icon: 'run', label: 'Run' },
  strength: { color: DISCIPLINE.strength, icon: 'dumbbell', label: 'Strength' },
  brick: { color: DISCIPLINE.brick, icon: 'transit-transfer', label: 'Brick' },
  rest: { color: DISCIPLINE.rest, icon: 'sleep', label: 'Recovery' },
};

/** Corner radii from the mockup token set. */
export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

const SHARED = {
  ...BRAND,
  warn: '#E9B949',
  bad: '#E0574B',

  /** color-mix(warn 18%) — .pill.pro */
  warnBgSoft: 'rgba(233,185,73,0.18)',
  /** color-mix(d-swim 18%) — .pill.new */
  swimBgSoft: 'rgba(41,169,212,0.18)',
  white: '#FFFFFF',
  black: '#000000',
};

/** otcf.css `:root, [data-theme="dark"]` */
export const DARK = {
  ...SHARED,
  scheme: 'dark' as const,

  bg: '#070A08',
  board: '#0B0F0C',
  surface: '#10150F',
  surface2: '#171E19',
  surface3: '#1F2822',
  border: '#232D26',
  border2: '#2E3A31',

  text: '#F1F5F1',
  text2: '#9CAAA1',
  text3: '#6C7A72',

  accent: BRAND.g400,
  accentInk: '#06210C',
  chip: '#1A221C',

  /** color-mix(accent 35%) / 7% used by the coach nudge card */
  accentBorderSoft: 'rgba(85,190,99,0.35)',
  accentBgSoft: 'rgba(85,190,99,0.07)',
  /** box-shadow ring on .dot-live */
  accentRing: 'rgba(85,190,99,0.22)',
  /** track background behind progress bars */
  trackBg: '#1F2822',

  /** color-mix(accent 16%) — .pill.free */
  accentBgStrong: 'rgba(85,190,99,0.16)',
  /** color-mix(accent 9%, surface-2) — .opt.on */
  optOnBg: '#1B2C1E',

  /** splash ground — matches the LogoDark.jpeg artwork background */
  splashInk: '#000106',
  splashBar: 'rgba(241,245,241,0.10)',
};

/** otcf.css `[data-theme="light"]` */
export const LIGHT = {
  ...SHARED,
  scheme: 'light' as const,

  bg: '#EEF2EE',
  board: '#F5F8F5',
  surface: '#FFFFFF',
  surface2: '#F4F7F4',
  surface3: '#E9EFEA',
  border: '#E0E7E1',
  border2: '#CFDAD1',

  text: '#0A100C',
  text2: '#5C6A61',
  text3: '#8B978F',

  accent: BRAND.g600,
  accentInk: '#FFFFFF',
  chip: '#EDF3EE',

  accentBorderSoft: 'rgba(47,138,56,0.35)',
  accentBgSoft: 'rgba(47,138,56,0.07)',
  accentRing: 'rgba(47,138,56,0.22)',
  trackBg: '#E9EFEA',

  /** color-mix(accent 16%) — .pill.free */
  accentBgStrong: 'rgba(47,138,56,0.16)',
  /** color-mix(accent 9%, surface-2) — .opt.on */
  optOnBg: '#E6F0E7',

  /** splash ground — matches the LogoWhite.jpeg artwork background */
  splashInk: '#FEFEFE',
  splashBar: 'rgba(10,16,12,0.10)',
};

/** `scheme` is widened so LIGHT and DARK share one type. */
export type Palette = Omit<typeof DARK, 'scheme'> & {
  scheme: 'light' | 'dark';
};

/**
 * Gradients derived from a palette.
 * - splash: flat artwork ground, easing into the brand at the very bottom.
 * - heroSession: otcf.css `linear-gradient(160deg, surface-3, surface-2)`.
 */
export const gradientsFor = (c: Palette) => ({
  splash: [
    c.splashInk,
    c.splashInk,
    c.scheme === 'dark' ? '#08200E' : '#DCEBDF',
  ] as [string, string, string],
  splashLocations: [0, 0.58, 1] as [number, number, number],
  heroSession: [c.surface3, c.surface2] as [string, string],
  brand: [BRAND.g500, BRAND.g700] as [string, string],
});

/**
 * Opacity for the hero card's radial glow —
 * `radial-gradient(... color-mix(accent 30%) ..., transparent 62%)`.
 * The light theme needs a touch less to stay subtle on white.
 */
export const heroGlowOpacity = (c: Palette) =>
  c.scheme === 'dark' ? 0.34 : 0.26;
