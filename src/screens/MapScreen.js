// src/screens/MapScreen.js
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView, RefreshControl,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { useSurgeAlerts } from '../hooks/useSurgeAlerts';
import { SeverityPill } from '../components/SeverityPill';
import { AlertCard } from '../components/AlertCard';
import { colors, spacing, radius, typography, severityColor } from '../utils/theme';

export function MapScreen({ navigation }) {
  const { location, loading:locLoading, error:locError } = useLocation();
  const { alerts, score, loading, lastUpdated, refresh, highestSeverity } = useSurgeAlerts(location);
  const mapRef = useRef(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude:       location.lat,
        longitude:      location.lon,
        latitudeDelta:  0.02,
        longitudeDelta: 0.02,
      }, 800);
    }
  }, [location?.lat, location?.lon]);

  if (locLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.small, { marginTop:spacing.md }]}>Getting your location…</Text>
      </View>
    );
  }

  if (locError) {
    return (
      <View style={styles.centered}>
        <Text style={[typography.h3, { color:colors.high }]}>Location unavailable</Text>
        <Text style={[typography.small, { marginTop:spacing.sm, textAlign:'center' }]}>
          {locError}{'\n'}Please enable location in Settings.
        </Text>
      </View>
    );
  }

  const initialRegion = location ? {
    latitude:       location.lat,
    longitude:      location.lon,
    latitudeDelta:  0.02,
    longitudeDelta: 0.02,
  } : undefined;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {alerts.map(alert => (
          <React.Fragment key={alert.id}>
            <Circle
              center={{ latitude:alert.lat, longitude:alert.lon }}
              radius={400}
              fillColor="rgba(216,90,48,0.15)"
              strokeColor={severityColor(alert.severity)}
              strokeWidth={1.5}
            />
            <Marker
              coordinate={{ latitude:alert.lat, longitude:alert.lon }}
              title={alert.locationLabel || 'Surge Alert'}
              description={`${alert.severity} · Score ${alert.score}`}
              pinColor={severityColor(alert.severity)}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Status overlay */}
      <View style={styles.statusBar}>
        <View>
          <Text style={styles.appName}>SurgeAlert</Text>
          {score && <Text style={styles.scoreText}>Score {score.score}/100</Text>}
        </View>
        <SeverityPill severity={highestSeverity} />
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        {loading && !alerts.length ? (
          <View style={styles.sheetLoading}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[typography.small, { marginLeft:spacing.sm }]}>Scanning your area…</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.clearState}>
            <Text style={styles.clearEmoji}>✓</Text>
            <Text style={styles.clearTitle}>Area looks clear</Text>
            <Text style={styles.clearSub}>
              No surge activity detected within 1.5 miles.
              {lastUpdated ? `\nLast checked ${lastUpdated.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}` : ''}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.alertList}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>
              {alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''} Nearby
            </Text>
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onPress={() => navigation.navigate('AlertDetail', { alert })}
              />
            ))}
            <View style={{ height:spacing.xl }} />
          </ScrollView>
        )}
      </View>

      {/* Re-center button */}
      {location && (
        <TouchableOpacity
          style={styles.recenterBtn}
          onPress={() => mapRef.current?.animateToRegion({
            latitude:location.lat, longitude:location.lon,
            latitudeDelta:0.02, longitudeDelta:0.02,
          }, 500)}
        >
          <Text style={{ fontSize:22, color:colors.primary }}>◎</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:colors.bg },
  centered:  { flex:1, justifyContent:'center', alignItems:'center', padding:spacing.xl },
  map:       { flex:1 },
  statusBar: {
    position:'absolute', top:54, left:spacing.lg, right:spacing.lg,
    backgroundColor:colors.bg, borderRadius:radius.lg,
    paddingHorizontal:spacing.lg, paddingVertical:spacing.md,
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:8, elevation:4,
  },
  appName:   { ...typography.h3, color:colors.primary },
  scoreText: { ...typography.micro },
  sheet: {
    position:'absolute', bottom:0, left:0, right:0,
    backgroundColor:colors.bg, borderTopLeftRadius:radius.xl, borderTopRightRadius:radius.xl,
    paddingTop:spacing.sm, maxHeight:'50%',
    shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.08, shadowRadius:10, elevation:10,
  },
  sheetHandle: {
    width:36, height:4, backgroundColor:colors.border,
    borderRadius:2, alignSelf:'center', marginBottom:spacing.md,
  },
  sheetLoading: { flexDirection:'row', alignItems:'center', justifyContent:'center', padding:spacing.xl },
  clearState:   { alignItems:'center', padding:spacing.xl, paddingBottom:spacing.xxl },
  clearEmoji:   { fontSize:36, color:colors.low, marginBottom:spacing.sm },
  clearTitle:   { ...typography.h3, color:colors.low, marginBottom:spacing.xs },
  clearSub:     { ...typography.small, textAlign:'center', lineHeight:20 },
  sectionLabel: { ...typography.label, color:colors.textMuted, marginHorizontal:spacing.lg, marginBottom:spacing.md, marginTop:spacing.sm },
  alertList:    { flex:1 },
  recenterBtn:  {
    position:'absolute', right:spacing.lg, bottom:'52%',
    width:44, height:44, backgroundColor:colors.bg, borderRadius:22,
    alignItems:'center', justifyContent:'center',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:6, elevation:4,
  },
});
