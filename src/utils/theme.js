// src/utils/theme.js
export const colors = {
  primary:      '#D85A30',
  primaryLight: 'rgba(216,90,48,0.12)',
  primaryBorder:'rgba(216,90,48,0.35)',
  primaryDark:  '#993C1D',
  high:         '#f04438',
  highBg:       'rgba(240,68,56,0.12)',
  highBorder:   'rgba(240,68,56,0.35)',
  med:          '#f79009',
  medBg:        'rgba(247,144,9,0.12)',
  medBorder:    'rgba(247,144,9,0.35)',
  low:          '#12b76a',
  lowBg:        'rgba(18,183,106,0.1)',
  lowBorder:    'rgba(18,183,106,0.3)',
  none:         '#6b7280',
  noneBg:       'rgba(107,114,128,0.1)',
  text:         '#e2e4e9',
  textMuted:    '#6b7280',
  textLight:    '#4b5563',
  border:       '#1e2028',
  borderLight:  '#1a1d24',
  bg:           '#0a0b0e',
  bgSecondary:  '#0f1014',
  bgTertiary:   '#111317',
  bgCard:       '#111317',
};

export const spacing = { xs:4, sm:8, md:12, lg:16, xl:24, xxl:32 };
export const radius  = { sm:6, md:8, lg:12, xl:18, round:999 };

export const fonts = {
  mono: 'SpaceMono',
  sans: 'System',
};

export const typography = {
  h1:    { fontSize:26, fontWeight:'600', color:'#e2e4e9', letterSpacing:-0.5 },
  h2:    { fontSize:20, fontWeight:'600', color:'#e2e4e9', letterSpacing:-0.3 },
  h3:    { fontSize:15, fontWeight:'500', color:'#e2e4e9' },
  body:  { fontSize:14, fontWeight:'400', color:'#e2e4e9', lineHeight:20 },
  small: { fontSize:12, fontWeight:'400', color:'#6b7280' },
  micro: { fontSize:10, fontWeight:'400', color:'#4b5563' },
  mono:  { fontSize:11, fontWeight:'500', color:'#6b7280', letterSpacing:0.08, fontFamily:'SpaceMono' },
  label: { fontSize:10, fontWeight:'600', letterSpacing:0.1, fontFamily:'SpaceMono' },
};

export function severityColor(s) {
  return { HIGH:'#f04438', MED:'#f79009', LOW:'#12b76a' }[s] ?? '#6b7280';
}
export function severityBg(s) {
  return { HIGH:'rgba(240,68,56,0.12)', MED:'rgba(247,144,9,0.12)', LOW:'rgba(18,183,106,0.1)' }[s] ?? 'rgba(107,114,128,0.1)';
}
export function severityBorder(s) {
  return { HIGH:'rgba(240,68,56,0.35)', MED:'rgba(247,144,9,0.35)', LOW:'rgba(18,183,106,0.3)' }[s] ?? 'rgba(107,114,128,0.2)';
}
export function severityLabel(s) {
  return { HIGH:'HIGH', MED:'MEDIUM', LOW:'LOW', NONE:'CLEAR' }[s] ?? 'CLEAR';
}
