// src/components/AlertCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { SeverityPill } from './SeverityPill';
import { colors, spacing, radius, typography } from '../utils/theme';

const MESSAGES = {
  HIGH: 'Large crowd surge — avoid this area.',
  MED:  'Elevated crowd activity nearby. Use caution.',
  LOW:  'Unusual crowd activity reported nearby.',
};

export function AlertCard({ alert, onPress }) {
  const age  = formatDistanceToNow(new Date(alert.createdAt), { addSuffix:true });
  const dist = !alert.distanceKm || alert.distanceKm < 0.1
    ? 'Nearby'
    : `${(alert.distanceKm * 0.621371).toFixed(1)} mi away`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <SeverityPill severity={alert.severity} />
        <Text style={styles.meta}>{dist} · {age}</Text>
      </View>
      <Text style={styles.location} numberOfLines={1}>
        {alert.locationLabel || 'Unknown location'}
      </Text>
      <Text style={styles.message}>{MESSAGES[alert.severity]}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {alert.components?.reportCount ?? 0} report{alert.components?.reportCount !== 1 ? 's' : ''}
        </Text>
        {(alert.components?.spikeCount ?? 0) > 0 && (
          <Text style={[styles.footerText, { color:colors.primary, marginLeft:4 }]}>
            · Social spike detected
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:colors.bgCard, borderRadius:radius.lg,
    borderWidth:1, borderColor:colors.border,
    padding:spacing.lg, marginHorizontal:spacing.lg, marginBottom:spacing.md,
  },
  header:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:spacing.sm },
  meta:     { ...typography.micro },
  location: { fontSize:15, fontWeight:'500', color:colors.text, marginBottom:spacing.xs },
  message:  { ...typography.small, marginBottom:spacing.sm },
  footer:   { flexDirection:'row', borderTopWidth:1, borderTopColor:colors.borderLight, paddingTop:spacing.sm, marginTop:spacing.xs },
  footerText: { ...typography.micro },
});
