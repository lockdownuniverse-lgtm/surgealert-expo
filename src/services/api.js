// src/services/api.js
// Swap API_BASE_URL for your deployed Railway/Render server URL.

import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  'https://surgealert-api-production.up.railway.app/api';  // ← replace with your deployed URL

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Alerts ──────────────────────────────────────────────────────────────────

export async function getAlertsNear(lat, lon, radiusKm = 1.5) {
  const { data } = await client.get('/alerts', {
    params: { lat, lon, radius: radiusKm },
  });
  return data.alerts;
}

// ─── Score ────────────────────────────────────────────────────────────────────

export async function getCrowdScore(lat, lon, radiusKm = 0.5) {
  const { data } = await client.get('/score', {
    params: { lat, lon, radius: radiusKm },
  });
  return data;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function submitReport({ lat, lon, type, crowdSize, note, locationLabel }) {
  const { data } = await client.post('/reports', {
    lat, lon, type, crowdSize, note, locationLabel,
  });
  return data;
}

export async function confirmReport(reportId) {
  const { data } = await client.post(`/reports/${reportId}/confirm`);
  return data;
}

// ─── Devices ─────────────────────────────────────────────────────────────────

export async function registerDeviceToken({ token, lat, lon, platform }) {
  const { data } = await client.post('https://surgealert-api-production.up.railway.app/api/devices/register', {
    token, lat, lon, platform,
  });
  return data;
}
