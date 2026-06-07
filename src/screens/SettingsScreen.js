// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../utils/theme';

const RADIUS_OPTIONS   = [0.25, 0.5, 1.0, 1.5, 2.0];
const SENSITIVITY_OPTS = [
  { label:'50+ people',  value:50  },
  { label:'100+ people', value:100 },
  { label:'200+ people', value:200 },
];

export function SettingsScreen() {
  const [pushEnabled,    setPush]        = useState(true);
  const [socialEnabled,  setSocial]      = useState(true);
  const [reportsEnabled, setReports]     = useState(true);
  const [quietHours,     setQuietHours]  = useState(false);
  const [alertRadius,    setRadius]      = useState(0.5);
  const [sensitivity,    setSensitivity] = useState(100);

  useEffect(() => {
    AsyncStorage.getItem('settings').then(raw => {
      if (!raw) return;
      try {
        const s = JSON.parse(raw);
        if (s.pushEnabled    !== undefined) setPush(s.pushEnabled);
        if (s.socialEnabled  !== undefined) setSocial(s.socialEnabled);
        if (s.reportsEnabled !== undefined) setReports(s.reportsEnabled);
        if (s.quietHours     !== undefined) setQuietHours(s.quietHours);
        if (s.radius         !== undefined) setRadius(s.radius);
        if (s.sensitivity    !== undefined) setSensitivity(s.sensitivity);
      } catch {}
    });
  }, []);

  async function save() {
    await AsyncStorage.setItem('settings', JSON.stringify({
      pushEnabled, socialEnabled, reportsEnabled, quietHours,
      radius:alertRadius, sensitivity,
    }));
    Alert.alert('Saved', 'Your preferences have been saved.');
  }

  function Row({ label, sub, right }) {
    return (
      <View style={st.row}>
        <View style={{ flex:1, paddingRight:spacing.sm }}>
          <Text style={st.rowLabel}>{label}</Text>
          {sub && <Text style={st.rowSub}>{sub}</Text>}
        </View>
        {right}
      </View>
    );
  }

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content}>
      <Text style={st.title}>Settings</Text>

      <Text style={st.sectionLabel}>NOTIFICATIONS</Text>
      <View style={st.section}>
        <Row label="Push alerts" sub="Notify when surges detected nearby"
          right={<Switch value={pushEnabled} onValueChange={setPush}
            trackColor={{ true:colors.primary, false:colors.border }} thumbColor="#fff" />} />
        <Row label="Quiet hours" sub="Silence alerts 10pm – 7am"
          right={<Switch value={quietHours} onValueChange={setQuietHours}
            trackColor={{ true:colors.primary, false:colors.border }} thumbColor="#fff" />} />
      </View>

      <Text style={st.sectionLabel}>ALERT RADIUS</Text>
      <View style={[st.section, { padding:spacing.md }]}>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:spacing.sm }}>
          {RADIUS_OPTIONS.map(r => (
            <TouchableOpacity key={r}
              style={[st.chip, alertRadius === r && st.chipActive]}
              onPress={() => setRadius(r)}>
              <Text style={[st.chipText, alertRadius === r && { color:colors.primary }]}>
                {r < 1 ? `${Math.round(r * 5280)} ft` : `${r} mi`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={st.sectionLabel}>MIN. CROWD SIZE</Text>
      <View style={st.section}>
        {SENSITIVITY_OPTS.map(opt => (
          <TouchableOpacity key={opt.value}
            style={[st.row, { gap:spacing.md }]}
            onPress={() => setSensitivity(opt.value)}>
            <View style={[st.radio, sensitivity === opt.value && st.radioActive]}>
              {sensitivity === opt.value && <View style={st.radioDot} />}
            </View>
            <Text style={st.rowLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={st.sectionLabel}>DATA SOURCES</Text>
      <View style={st.section}>
        <Row label="Social media signals" sub="Spike detection in your area"
          right={<Switch value={socialEnabled} onValueChange={setSocial}
            trackColor={{ true:colors.primary, false:colors.border }} thumbColor="#fff" />} />
        <Row label="Community reports" sub="Reports from nearby users"
          right={<Switch value={reportsEnabled} onValueChange={setReports}
            trackColor={{ true:colors.primary, false:colors.border }} thumbColor="#fff" />} />
      </View>

      <TouchableOpacity style={st.saveBtn} onPress={save}>
        <Text style={st.saveBtnText}>Save Preferences</Text>
      </TouchableOpacity>
      <Text style={[typography.micro, { textAlign:'center', marginTop:spacing.xl }]}>
        SurgeAlert v1.0.0
      </Text>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container:    { flex:1, backgroundColor:colors.bg },
  content:      { padding:spacing.lg, paddingBottom:spacing.xxl },
  title:        { fontSize:22, fontWeight:'600', color:colors.text, letterSpacing:-0.3, marginBottom:spacing.xl },
  sectionLabel: { ...typography.mono, color:colors.textMuted, marginBottom:spacing.sm, marginTop:spacing.md },
  section:      { backgroundColor:colors.bgTertiary, borderRadius:12, borderWidth:1, borderColor:colors.border, overflow:'hidden', marginBottom:spacing.sm },
  row:          { flexDirection:'row', alignItems:'center', padding:spacing.md, borderBottomWidth:1, borderBottomColor:colors.borderLight },
  rowLabel:     { fontSize:13, fontWeight:'500', color:colors.text },
  rowSub:       { ...typography.micro, marginTop:2 },
  chip:         { paddingHorizontal:spacing.md, paddingVertical:spacing.sm, borderRadius:20, borderWidth:1, borderColor:colors.border, backgroundColor:colors.bgSecondary },
  chipActive:   { borderColor:colors.primary, backgroundColor:colors.primaryLight },
  chipText:     { fontSize:12, fontWeight:'500', color:colors.textMuted },
  radio:        { width:18, height:18, borderRadius:9, borderWidth:1.5, borderColor:colors.border, alignItems:'center', justifyContent:'center' },
  radioActive:  { borderColor:colors.primary },
  radioDot:     { width:8, height:8, borderRadius:4, backgroundColor:colors.primary },
  saveBtn:      { backgroundColor:colors.primary, borderRadius:12, padding:spacing.lg, alignItems:'center', marginTop:spacing.xl },
  saveBtnText:  { fontSize:15, fontWeight:'600', color:'#fff' },
});
