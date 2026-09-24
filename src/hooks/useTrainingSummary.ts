import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  EMPTY_SUMMARY,
  isHealthAvailable,
  readTrainingSummary,
  requestHealthAccess,
  TrainingSummary,
} from '../services/health';

/** Progress screen state, re-read whenever the app comes back to the front. */
export const useTrainingSummary = () => {
  const [summary, setSummary] = useState<TrainingSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(isHealthAvailable());

  const refresh = useCallback(async () => {
    if (!isHealthAvailable()) {
      setSummary(EMPTY_SUMMARY);
      setLoading(false);
      return;
    }

    setSummary(await readTrainingSummary());
    setLoading(false);
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
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

  return { summary, loading, refresh, connect };
};
