import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StorageKeys, getItem, removeItem, setItem } from '../utils/storage';

type OnboardingValue = {
  /** True once the athlete has been through Welcome → Goal → Plan preview. */
  completed: boolean;
  /** False until the saved flag has been read back. */
  ready: boolean;
  complete: () => void;
  /** Clears the flag so onboarding runs again — handy while developing. */
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingValue>({
  completed: false,
  ready: false,
  complete: () => {},
  reset: () => {},
});

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [completed, setCompleted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getItem(StorageKeys.onboardingComplete).then(saved => {
      if (cancelled) return;
      setCompleted(saved === 'true');
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const complete = useCallback(() => {
    setCompleted(true);
    setItem(StorageKeys.onboardingComplete, 'true');
  }, []);

  const reset = useCallback(() => {
    setCompleted(false);
    removeItem(StorageKeys.onboardingComplete);
  }, []);

  const value = useMemo(
    () => ({ completed, ready, complete, reset }),
    [completed, ready, complete, reset],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
