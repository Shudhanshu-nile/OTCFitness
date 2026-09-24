import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  HealthSnapshot,
  isHealthAvailable,
  readHealthSources,
  requestHealthAccess,
  UNSUPPORTED,
} from '../services/health';

type State = {
  snapshot: HealthSnapshot;
  /** True while the first read (or a connect) is in flight. */
  loading: boolean;
};

/**
 * Keeps the Data sources rows in sync with HealthKit.
 *
 * Refreshes when the app returns to the foreground, because the athlete may
 * have granted access or synced Garmin Connect while we were backgrounded.
 */
export const useHealthSources = () => {
  const [state, setState] = useState<State>({
    snapshot: UNSUPPORTED,
    loading: isHealthAvailable(),
  });

  const refresh = useCallback(async () => {
    if (!isHealthAvailable()) {
      setState({ snapshot: UNSUPPORTED, loading: false });
      return;
    }

    const snapshot = await readHealthSources();
    setState({ snapshot, loading: false });
  }, []);

  const connect = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    await requestHealthAccess();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();

    const sub = AppState.addEventListener('change', next => {
      if (next === 'active') {
        refresh();
      }
    });

    return () => sub.remove();
  }, [refresh]);

  return { ...state, refresh, connect };
};
