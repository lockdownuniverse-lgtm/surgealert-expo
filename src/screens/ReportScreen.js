// src/screens/ReportScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { submitReport } from '../services/api';
import { colors, spacing, radius, typography } from '../utils/theme';

const TYPES = [
  { key:'crowd',  label:'Crowd Surge',  icon:'👥' },
  { key:'block',  label:'Road Blocked', icon:'🚧' },
  { key:'police', label:'Heavy Police', icon:'🚔' },
  { key:'other',  label:'Other',        icon:'⚠️' },
];

const SIZES = [
  { value:1, label:'Very small', sub:'Under 20 people' },
  { value:2, label:'Small',      sub:'20–50 people' },
  { value:3, label:'Medium',     sub:'50–100 people' },
  { value:4, label:'Large',      sub:'100–300 people' },
  { value:5, label:'Massive',    sub:'300+ people' },
];

export function ReportScreen({ navigation }) {
  const { location } = useLocation();
  const [selectedType, setType]     = useState('crowd');
  const [crowdSize, setCrowdSize]   = useState(3);
  const [note, setNote]             = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!location) {
      Alert.alert('Location unavailable', 'We need your location to submit a report.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitReport({
        lat:location.lat, lon:location.lon,
        type:selectedType, crowdSize,
        note:note.trim() || undefined,
      });
      Alert.alert(
        result.alertFired ? '🚨 Alert Triggered' : '✓ Report Submitted',
        result.alertFired
          ? 'Your report triggered a surge alert. Nearby users will be notified.'
          : 'Thanks for the report. We\'ll watch this area.',
        [{ text:'OK', onPress:() => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert('Submission failed', err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Report Surge Activity</Text>
      <Text style={styles.sub}>Anonymous · Helps warn everyone nearby</Text>

      <Text style={styles.sectionLabel}>WHAT ARE YOU SEEING?</Text>
      <View style={styles.typeGrid}>
        {TYPES.map(t => (
          <TouchableOpacity key={t.key}
            style={[styles.typeCard, selectedType === t.key && styles.typeCardActive]}
            onPress={() => setType(t.key)} activeOpacity={0.75}>
            <Text style={styles.typeIcon}>{t.icon}</Text>
            <Text style={[styles.typeLabel, selectedType === t.key && { color:colors.primary }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>CROWD SIZE</Text>
      <View style={styles.sizeList}>
        {SIZES.map(s => (
          <TouchableOpacity key={s.value}
            style={[styles.sizeRow, crowdSize === s.value && styles.sizeRowActive]}
            onPress={() => setCrowdSize(s.value)} activeOpacity={0.75}>
            <View style={[styles.radio, crowdSize === s.value && styles.radioActive]}>
              {crowdSize === s.value && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex:1 }}>
              <Text style={[styles.sizeName, crowdSize === s.value && { color:colors.text }]}>{s.label}</Text>
              <Text style={styles.sizeSub}>{s.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>ADD A NOTE (OPTIONAL)</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="e.g. Moving fast toward the park entrance…"
        placeholderTextColor={colors.textLight}
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={200}
      />

      <TouchableOpacity
        style={[styles.submitBtn, submitting && { opacity:0.6 }]}
        onPress={handleSubmit} disabled={submitting} activeOpacity={0.8}>
        {submitting
          ? <ActivityIndicator color={colors.bg} />
          : <Text style={styles.submitText}>Submit Report</Text>}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>Reports are anonymous. Nothing tied to your identity.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:colors.bg },
  content:      { padding:spacing.lg, paddingBottom:spacing.xxl },
  title:        { fontSize:22, fontWeight:'600', color:colors.text, letterSpacing:-0.3, marginBottom:spacing.xs },
  sub:          { ...typography.small, marginBottom:spacing.xl },
  sectionLabel: { ...typography.mono, color:colors.textMuted, marginBottom:spacing.sm, marginTop:spacing.lg },
  typeGrid:     { flexDirection:'row', flexWrap:'wrap', gap:spacing.sm },
  typeCard:     {
    width:'47%', backgroundColor:colors.bgTertiary, borderRadius:radius.lg,
    borderWidth:1, borderColor:colors.border, padding:spacing.lg,
    alignItems:'center', gap:spacing.sm,
  },
  typeCardActive: { borderColor:colors.primary, backgroundColor:colors.primaryLight },
  typeIcon:     { fontSize:26 },
  typeLabel:    { fontSize:12, fontWeight:'500', color:colors.textMuted, textAlign:'center' },
  sizeList:     { backgroundColor:colors.bgTertiary, borderRadius:radius.lg, borderWidth:1, borderColor:colors.border, overflow:'hidden' },
  sizeRow:      { flexDirection:'row', alignItems:'center', padding:spacing.md, gap:spacing.md, borderBottomWidth:1, borderBottomColor:colors.borderLight },
  sizeRowActive:{ backgroundColor:'rgba(216,90,48,0.06)' },
  radio:        { width:18, height:18, borderRadius:9, borderWidth:1.5, borderColor:colors.border, alignItems:'center', justifyContent:'center' },
  radioActive:  { borderColor:colors.primary },
  radioDot:     { width:8, height:8, borderRadius:4, backgroundColor:colors.primary },
  sizeName:     { fontSize:13, fontWeight:'500', color:colors.textMuted },
  sizeSub:      { ...typography.micro, marginTop:1 },
  noteInput:    {
    backgroundColor:colors.bgTertiary, borderRadius:radius.lg,
    borderWidth:1, borderColor:colors.border,
    padding:spacing.md, minHeight:80, color:colors.text,
    fontSize:14, textAlignVertical:'top',
  },
  submitBtn:    { backgroundColor:colors.primary, borderRadius:radius.lg, padding:spacing.lg, alignItems:'center', marginTop:spacing.xl },
  submitText:   { fontSize:15, fontWeight:'600', color:'#fff' },
  disclaimer:   { ...typography.micro, textAlign:'center', marginTop:spacing.md },
});
