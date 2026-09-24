import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin wrapper over AsyncStorage. Every read resolves to `null` rather than
 * throwing, so a storage failure degrades to "no preference saved" instead of
 * taking a screen down.
 */

export const StorageKeys = {
  themeMode: '@otcf/theme-mode',
  onboardingComplete: '@otcf/onboarding-complete',
} as const;

export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn(`storage: failed to read ${key}`, e);
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn(`storage: failed to write ${key}`, e);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`storage: failed to remove ${key}`, e);
  }
}
