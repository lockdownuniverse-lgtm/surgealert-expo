// src/components/CitySearch.js
import React, { useState } from 'react';
import {
  View, TextInput, FlatList, TouchableOpacity,
  Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, typography } from '../utils/theme';

const GOOGLE_API_KEY = 'AIzaSyA-XDvgDxmxF1HqrB66DRdJ51pKAxelYqI';

export function CitySearch({ onLocationSelected, onClose }) {
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);

  async function search(text) {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&types=(cities)&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.predictions || []);
    } catch (err) {
      console.warn('[search] Autocomplete error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectPlace(place) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.place_id}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const loc = data.results[0]?.geometry?.location;
      if (loc) {
        onLocationSelected({
          lat: loc.lat,
          lon: loc.lng,
          label: place.description,
        });
        onClose();
      }
    } catch (err) {
      console.warn('[search] Geocode error:', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Search any city or neighborhood…"
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={search}
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color={colors.primary} style={{ margin: spacing.md }} />}

      <FlatList
        data={results}
        keyExtractor={item => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.result} onPress={() => selectPlace(item)}>
            <Text style={styles.resultMain} numberOfLines={1}>
              {item.structured_formatting?.main_text || item.description}
            </Text>
            <Text style={styles.resultSub} numberOfLines={1}>
              {item.structured_formatting?.secondary_text || ''}
            </Text>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:colors.bg, zIndex:9999, elevation:9999 },
  inputRow:    { flexDirection:'row', alignItems:'center', padding:spacing.lg, paddingTop:54, gap:spacing.md, borderBottomWidth:1, borderBottomColor:colors.border },
  input:       { flex:1, backgroundColor:colors.bgTertiary, borderRadius:radius.lg, paddingHorizontal:spacing.md, paddingVertical:spacing.sm, color:colors.text, fontSize:15, borderWidth:1, borderColor:colors.border },
  cancelBtn:   { paddingHorizontal:spacing.sm },
  cancelText:  { color:colors.primary, fontSize:15, fontWeight:'500' },
  result:      { padding:spacing.lg, borderBottomWidth:1, borderBottomColor:colors.border },
  resultMain:  { fontSize:15, fontWeight:'500', color:colors.text, marginBottom:2 },
  resultSub:   { ...typography.small },
});
