// src/components/SeverityPill.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { severityColor, severityBg, severityLabel, radius, typography } from '../utils/theme';

export function SeverityPill({ severity, size = 'md' }) {
  const color = severityColor(severity);
  const bg    = severityBg(severity);
  const label = severityLabel(severity);
  const isSmall = size === 'sm';

  return (
    <View style={[styles.pill, { backgroundColor:bg, borderColor:color }, isSmall && styles.pillSm]}>
      <View style={[styles.dot, { backgroundColor:color }]} />
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection:'row', alignItems:'center',
    paddingHorizontal:10, paddingVertical:5,
    borderRadius:radius.round, borderWidth:1, gap:5,
  },
  pillSm:  { paddingHorizontal:7, paddingVertical:3 },
  dot:     { width:6, height:6, borderRadius:3 },
  text:    { ...typography.label, fontSize:12 },
  textSm:  { fontSize:10 },
});
