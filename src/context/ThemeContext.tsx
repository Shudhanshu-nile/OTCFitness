import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  DARK,
  LIGHT,
  Palette,
  gradientsFor,
  heroGlowOpacity,
} from '../constants/theme';
import { StorageKeys, getItem, setItem } from '../utils/storage';

/** `system` follows the device; the other two are an explicit override. */
export type ThemeMode = 'system' | 'light' | 'dark';

const isThemeMode = (v: string | null): v is ThemeMode =>
  v === 'system' || v === 'light' || v === 'dark';

type ThemeValue = {
  colors: Palette;
  gradients: ReturnType<typeof gradientsFor>;
  glowOpacity: number;
  isDark: boolean;
  /** What the user picked, not what is currently rendered. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Flips to the opposite of what is on screen, as an explicit override. */
  toggleDark: () => void;
  /** False until the saved preference has been read back. */
  ready: boolean;
};

const buildPalette = (isDark: boolean) => {
  const colors = isDark ? DARK : LIGHT;
  return {
    colors,
    gradients: gradientsFor(colors),
    glowOpacity: heroGlowOpacity(colors),
    isDark,
  };
};

const ThemeContext = createContext<ThemeValue>({
  ...buildPalette(true),
  mode: 'system',
  setMode: () => {},
  toggleDark: () => {},
  ready: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  // Read the saved preference once on mount.
  useEffect(() => {
    let cancelled = false;

    getItem(StorageKeys.themeMode).then(saved => {
      if (cancelled) return;
      if (isThemeMode(saved)) setModeState(saved);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Write on change. Never writes before the initial read has landed, so the
  // default can't overwrite a saved preference.
  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      if (ready) setItem(StorageKeys.themeMode, next);
    },
    [ready],
  );

  const isDark = mode === 'system' ? deviceScheme !== 'light' : mode === 'dark';

  const toggleDark = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const value = useMemo(
    () => ({ ...buildPalette(isDark), mode, setMode, toggleDark, ready }),
    [isDark, mode, setMode, toggleDark, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/**
 * Builds a StyleSheet from the active palette, recomputing only when the
 * theme actually flips.
 *
 *   const styles = useThemedStyles(makeStyles);
 *   const makeStyles = (c: Palette) => StyleSheet.create({ ... });
 */
export function useThemedStyles<T>(factory: (colors: Palette) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [factory, colors]);
}
