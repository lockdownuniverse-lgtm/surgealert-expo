// src/screens/AlertsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { useSurgeAlerts } from '../hooks/useSurgeAlerts';
import { AlertCard } from '../components/AlertCard';
import { colors, spacing, typography } from '../utils/theme';

export function AlertsScreen({ navigation }) {
  const { location } = useLocation();
  const { alerts, loading, lastUpdated, refresh } = useSurgeAlerts(location);

  if (!loading && alerts.length === 0) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.title}>Nearby Alerts</Text>
          {lastUpdated && <Text style={s.updated}>Updated {lastUpdated.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</Text>}
        </View>
        <View style={s.empty}>
          <Text style={s.emptyIcon}>✓</Text>
          <Text style={s.emptyTitle}>No active alerts</Text>
          <Text style={s.emptySub}>Nothing detected within 1.5 miles.</Text>
          <TouchableOpacity style={s.refreshBtn} onPress={refresh}>
            <Text style={s.refreshBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <FlatList
        data={alerts}
        keyExtractor={a => String(a.id)}
        ListHeaderComponent={() => (
          <View style={s.header}>
            <Text style={s.title}>Nearby Alerts</Text>
            {lastUpdated && <Text style={s.updated}>Updated {lastUpdated.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</Text>}
          </View>
        )}
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={() => navigation.navigate('AlertDetail', { alert:item })} />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom:spacing.xxl }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex:1, backgroundColor:colors.bg },
  header:         { backgroundColor:colors.bgTertiary, padding:spacing.lg, paddingTop:spacing.xl, borderBottomWidth:1, borderBottomColor:colors.border, marginBottom:spacing.md },
  title:          { fontSize:22, fontWeight:'600', color:colors.text, letterSpacing:-0.3 },
  updated:        { ...typography.micro, marginTop:spacing.xs },
  empty:          { flex:1, alignItems:'center', justifyContent:'center', padding:spacing.xxl },
  emptyIcon:      { fontSize:40, color:colors.low, marginBottom:spacing.md },
  emptyTitle:     { fontSize:16, fontWeight:'500', color:colors.low, marginBottom:spacing.sm },
  emptySub:       { ...typography.small, textAlign:'center', marginBottom:spacing.xl },
  refreshBtn:     { borderWidth:1, borderColor:colors.primary, borderRadius:8, paddingHorizontal:spacing.xl, paddingVertical:spacing.sm },
  refreshBtnText: { ...typography.small, color:colors.primary, fontWeight:'600' },
});
