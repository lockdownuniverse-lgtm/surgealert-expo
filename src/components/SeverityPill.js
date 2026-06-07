// src/components/SeverityPill.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { severityColor, severityBg, severityBorder, severityLabel, radius } from '../utils/theme';

export function SeverityPill({ severity, size = 'md' }) {
  const color  = severityColor(severity);
  const bg     = severityBg(severity);
  const border = severityBorder(severity);
  const label  = severityLabel(severity);
  const sm     = size === 'sm';

  return (
    <View style={[styles.pill, { backgroundColor:bg, borderColor:border }, sm && styles.pillSm]}>
      <View style={[styles.dot, { backgroundColor:color }]} />
      <Text style={[styles.text, { color }, sm && styles.textSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill:   { flexDirection:'row', alignItems:'center', paddingHorizontal:10, paddingVertical:4, borderRadius:radius.round, borderWidth:1, gap:5 },
  pillSm: { paddingHorizontal:7, paddingVertical:2 },
  dot:    { width:5, height:5, borderRadius:3 },
  text:   { fontSize:10, fontWeight:'700', letterSpacing:0.06, fontFamily:'SpaceMono' },
  textSm: { fontSize:9 },
});
