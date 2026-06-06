// src/navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';

import { MapScreen }      from '../screens/MapScreen';
import { AlertsScreen }   from '../screens/AlertsScreen';
import { ReportScreen }   from '../screens/ReportScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SeverityPill }   from '../components/SeverityPill';
import { colors, spacing, typography } from '../utils/theme';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = { Map:'🗺', Alerts:'🔔', Report:'＋', Settings:'⚙️' };

function TabIcon({ name, focused }) {
  return <Text style={{ fontSize:20, opacity:focused ? 1 : 0.45 }}>{TAB_ICONS[name]}</Text>;
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon:  ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor:colors.border, borderTopWidth:1, paddingBottom:4, height:58 },
        tabBarLabelStyle: { ...typography.micro, marginTop:2 },
      })}
    >
      <Tab.Screen name="Map"      component={MapScreen} />
      <Tab.Screen name="Alerts"   component={AlertsScreen} />
      <Tab.Screen name="Report"   component={ReportScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="Tabs"        component={Tabs} />
        <Stack.Screen
          name="AlertDetail"
          component={AlertDetailScreen}
          options={{ headerShown:true, title:'Alert Details', headerTintColor:colors.primary }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AlertDetailScreen({ route }) {
  const { alert } = route.params;
  const age = formatDistanceToNow(new Date(alert.createdAt), { addSuffix:true });
  return (
    <ScrollView style={ds.container} contentContainerStyle={ds.content}>
      <SeverityPill severity={alert.severity} />
      <Text style={[typography.h2, { marginTop:spacing.lg }]}>
        {alert.locationLabel || 'Unknown location'}
      </Text>
      <Text style={[typography.small, { marginTop:spacing.xs }]}>Reported {age}</Text>

      <View style={ds.statRow}>
        {[
          { val:alert.score,                                    label:'Danger score' },
          { val:alert.distanceKm ? `${(alert.distanceKm*0.621).toFixed(1)} mi` : '—', label:'Distance' },
          { val:alert.components?.reportCount ?? 0,             label:'Reports' },
        ].map(({ val, label }) => (
          <View key={label} style={ds.stat}>
            <Text style={ds.statValue}>{val}</Text>
            <Text style={ds.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[typography.label, { color:colors.textMuted, marginTop:spacing.xl, marginBottom:spacing.sm }]}>
        DATA SOURCES
      </Text>
      <View style={ds.card}>
        <View style={ds.sourceRow}>
          <Text style={ds.sourceIcon}>👥</Text>
          <View>
            <Text style={ds.sourceTitle}>Community reports</Text>
            <Text style={typography.micro}>{alert.components?.reportCount ?? 0} reports · {alert.components?.reportScore ?? 0}/60 pts</Text>
          </View>
        </View>
        {(alert.components?.spikeCount ?? 0) > 0 && (
          <View style={[ds.sourceRow, { borderTopWidth:1, borderTopColor:colors.borderLight }]}>
            <Text style={ds.sourceIcon}>📱</Text>
            <View>
              <Text style={ds.sourceTitle}>Social media spike</Text>
              <Text style={typography.micro}>{alert.components?.spikeScore ?? 0}/40 pts</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const ds = StyleSheet.create({
  container: { flex:1, backgroundColor:colors.bgSecondary },
  content:   { padding:spacing.lg, paddingBottom:spacing.xxl },
  statRow:   { flexDirection:'row', marginTop:spacing.xl, gap:spacing.sm },
  stat:      { flex:1, backgroundColor:colors.bg, borderRadius:12, borderWidth:1, borderColor:colors.border, padding:spacing.md, alignItems:'center' },
  statValue: { ...typography.h2, color:colors.primary },
  statLabel: { ...typography.micro, marginTop:2 },
  card:      { backgroundColor:colors.bg, borderRadius:12, borderWidth:1, borderColor:colors.border, overflow:'hidden' },
  sourceRow: { flexDirection:'row', alignItems:'center', gap:spacing.md, padding:spacing.md },
  sourceIcon:  { fontSize:22 },
  sourceTitle: { ...typography.small, fontWeight:'600', marginBottom:2 },
});
