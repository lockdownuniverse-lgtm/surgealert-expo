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
import { CitySearch } from '../components/CitySearch';

export function MapScreen({ navigation }) {
  const { location, loading:locLoading, error:locError } = useLocation();
  const mapRef = useRef(null);
  const [reports, setReports] = React.useState([]);

  // Fetch recent reports for map markers
  React.useEffect(() => {
    async function fetchReports() {
      if (!activeLocation) return;
      try {
        const res = await fetch(
          `https://surgealert-api-production.up.railway.app/api/reports?lat=${activeLocation.lat}&lon=${activeLocation.lon}&radius=5`
        );
        const data = await res.json();
        setReports((data.reports || []).map(r => ({
          ...r,
          offsetLat: r.lat + (Math.random() - 0.5) * 0.006,
          offsetLon: r.lon + (Math.random() - 0.5) * 0.006,
        })));
      } catch (err) {
        console.warn('[reports] fetch failed:', err.message);
      }
    }
    fetchReports();
    const interval = setInterval(fetchReports, 60000);
    return () => clearInterval(interval);
  }, [activeLocation?.lat, activeLocation?.lon]);

  function reportIcon(type) {
    switch(type) {
      case 'police': return '🚔';
      case 'block':  return '🚧';
      case 'crowd':  return '👥';
      default:       return '⚠️';
    }
  }

  function privacyOffset(val) {
    return val + (Math.random() - 0.5) * 0.002;
  }
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchLocation, setSearchLocation] = React.useState(null);
  const activeLocation = searchLocation || location;
  const { alerts, score, loading, lastUpdated, refresh, highestSeverity } = useSurgeAlerts(activeLocation);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.lat, longitude: location.lon,
        latitudeDelta: 0.02, longitudeDelta: 0.02,
      }, 800);
    }
  }, [location?.lat, location?.lon]);

  function handleLocationSelected(loc) {
    setSearchLocation(loc);
    mapRef.current?.animateToRegion({
      latitude: loc.lat, longitude: loc.lon,
      latitudeDelta: 0.02, longitudeDelta: 0.02,
    }, 800);
  }

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
        <Text style={[typography.small, { marginTop:spacing.sm, textAlign:'center' }]}>{locError}</Text>
      </View>
    );
  }

  const initialRegion = location ? {
    latitude: location.lat, longitude: location.lon,
    latitudeDelta: 0.02, longitudeDelta: 0.02,
  } : undefined;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={darkMapStyle}
      >
        {reports.map(report => (
          <Marker
            key={'r-' + report.id}
            coordinate={{
              latitude:  report.offsetLat || report.lat,
              longitude: report.offsetLon || report.lon,
            }}
            title={reportIcon(report.type) + ' ' + (report.type === 'police' ? 'Police Activity' : report.type === 'block' ? 'Road Block' : 'Crowd Reported')}
            description={(report.location_label || '') + ' · ' + Math.round(report.age_minutes) + ' min ago'}
          >
            <View style={styles.reportMarker}>
              <Text style={styles.reportMarkerText}>{reportIcon(report.type)}</Text>
            </View>
          </Marker>
        ))}

        {alerts.map(alert => (
          <React.Fragment key={alert.id}>
            <Circle
              center={{ latitude:alert.lat, longitude:alert.lon }}
              radius={400}
              fillColor={`${severityColor(alert.severity)}22`}
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

      {/* Status bar */}
      {searchOpen && (
        <CitySearch
          onLocationSelected={handleLocationSelected}
          onClose={() => setSearchOpen(false)}
        />
      )}

      <View style={styles.statusBar}>
        <View>
          <Text style={styles.appName}>⚡ SurgeAlert</Text>
          {searchLocation
            ? <Text style={styles.scoreText}>📍 {searchLocation.label}</Text>
            : score && <Text style={styles.scoreText}>Score {score.score}/100</Text>
          }
        </View>
        <TouchableOpacity onPress={() => setSearchOpen(true)} style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
        <SeverityPill severity={highestSeverity} />
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />
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
              No surge activity within 1.5 miles.
              {lastUpdated ? `\nUpdated ${lastUpdated.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}` : ''}
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
              <AlertCard key={alert.id} alert={alert}
                onPress={() => navigation.navigate('AlertDetail', { alert })} />
            ))}
            <View style={{ height:spacing.xl }} />
          </ScrollView>
        )}
      </View>

      {location && (
        <TouchableOpacity style={styles.recenterBtn}
          onPress={() => mapRef.current?.animateToRegion({
            latitude:location.lat, longitude:location.lon,
            latitudeDelta:0.02, longitudeDelta:0.02,
          }, 500)}>
          <Text style={{ fontSize:20, color:colors.primary }}>◎</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const darkMapStyle = [
  { elementType:'geometry', stylers:[{ color:'#141820' }] },
  { elementType:'labels.text.fill', stylers:[{ color:'#6b7280' }] },
  { elementType:'labels.text.stroke', stylers:[{ color:'#0a0b0e' }] },
  { featureType:'road', elementType:'geometry', stylers:[{ color:'#1e2a40' }] },
  { featureType:'road.arterial', elementType:'geometry', stylers:[{ color:'#1a2035' }] },
  { featureType:'water', elementType:'geometry', stylers:[{ color:'#0d1117' }] },
  { featureType:'poi', stylers:[{ visibility:'off' }] },
  { featureType:'transit', stylers:[{ visibility:'off' }] },
];

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:colors.bg },
  centered:  { flex:1, justifyContent:'center', alignItems:'center', padding:spacing.xl, backgroundColor:colors.bg },
  map:       { flex:1 },
  reportMarker: { backgroundColor:'rgba(10,11,14,0.8)', borderRadius:20, padding:4, borderWidth:1, borderColor:'#444' },
  reportMarkerText: { fontSize:18 },
  searchBtn: { padding:8, marginLeft:'auto' },
  searchIcon: { fontSize:20 },
  statusBar: {
    position:'absolute', top:54, left:spacing.lg, right:spacing.lg,
    backgroundColor:colors.bgTertiary, borderRadius:radius.lg,
    paddingHorizontal:spacing.lg, paddingVertical:spacing.md,
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    borderWidth:1, borderColor:colors.border,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.4, shadowRadius:8, elevation:4,
  },
  appName:   { fontSize:14, fontWeight:'600', color:colors.primary, letterSpacing:0.04, fontFamily:'SpaceMono' },
  scoreText: { fontSize:10, color:colors.textMuted, marginTop:2, fontFamily:'SpaceMono' },
  sheet: {
    position:'absolute', bottom:0, left:0, right:0,
    backgroundColor:colors.bgTertiary, borderTopLeftRadius:radius.xl, borderTopRightRadius:radius.xl,
    paddingTop:spacing.sm, maxHeight:'32%',
    borderTopWidth:1, borderColor:colors.border,
    shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.4, shadowRadius:10, elevation:10,
  },
  handle: { width:36, height:3, backgroundColor:colors.border, borderRadius:2, alignSelf:'center', marginBottom:spacing.md },
  sheetLoading: { flexDirection:'row', alignItems:'center', justifyContent:'center', padding:spacing.xl },
  clearState:   { alignItems:'center', padding:spacing.md, paddingBottom:spacing.lg },
  clearEmoji:   { fontSize:22, color:colors.low, marginBottom:4 },
  clearTitle:   { fontSize:15, fontWeight:'600', color:colors.low, marginBottom:2 },
  clearSub:     { ...typography.small, textAlign:'center', lineHeight:20 },
  sectionLabel: { ...typography.mono, color:colors.textMuted, marginHorizontal:spacing.lg, marginBottom:spacing.md, marginTop:spacing.sm },
  alertList:    { flex:1 },
  recenterBtn:  {
    position:'absolute', right:spacing.lg, bottom:'52%',
    width:40, height:40, backgroundColor:colors.bgTertiary, borderRadius:20,
    alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor:colors.border,
  },
});
