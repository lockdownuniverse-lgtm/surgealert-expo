// src/hooks/useSurgeAlerts.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { getAlertsNear, getCrowdScore } from '../services/api';

const POLL_INTERVAL_MS = 60 * 1000;

export function useSurgeAlerts(location) {
  const [alerts, setAlerts]           = useState([]);
  const [score, setScore]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError]             = useState(null);
  const timerRef  = useRef(null);
  const appState  = useRef(AppState.currentState);

  const refresh = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const [alertData, scoreData] = await Promise.all([
        getAlertsNear(location.lat, location.lon),
        getCrowdScore(location.lat, location.lon),
      ]);
      setAlerts(alertData);
      setScore(scoreData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        refresh();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [refresh]);

  const highestSeverity = alerts.length === 0 ? 'NONE' : alerts[0].severity;

  return { alerts, score, loading, lastUpdated, error, refresh, highestSeverity };
}
