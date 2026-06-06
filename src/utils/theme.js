// src/utils/theme.js
export const colors = {
  primary:      '#D85A30',
  primaryLight: '#FAECE7',
  primaryBorder:'#F5C4B3',
  primaryDark:  '#993C1D',
  high:         '#D85A30',
  highBg:       '#FAECE7',
  med:          '#EF9F27',
  medBg:        '#FAEEDA',
  low:          '#639922',
  lowBg:        '#EAF3DE',
  none:         '#5F5E5A',
  noneBg:       '#F1EFE8',
  text:         '#1A1A18',
  textMuted:    '#5F5E5A',
  textLight:    '#888780',
  border:       '#D3D1C7',
  borderLight:  '#E8E6DF',
  bg:           '#FFFFFF',
  bgSecondary:  '#F6F4EE',
  info:         '#185FA5',
};

export const spacing = { xs:4, sm:8, md:12, lg:16, xl:24, xxl:32 };
export const radius  = { sm:6, md:10, lg:14, xl:20, round:999 };

export const typography = {
  h1:    { fontSize:26, fontWeight:'700', color:colors.text },
  h2:    { fontSize:20, fontWeight:'600', color:colors.text },
  h3:    { fontSize:16, fontWeight:'600', color:colors.text },
  body:  { fontSize:15, fontWeight:'400', color:colors.text, lineHeight:22 },
  small: { fontSize:13, fontWeight:'400', color:colors.textMuted },
  micro: { fontSize:11, fontWeight:'400', color:colors.textLight },
  label: { fontSize:11, fontWeight:'600', letterSpacing:0.5 },
};

export function severityColor(s) {
  return { HIGH:colors.high, MED:colors.med, LOW:colors.low }[s] ?? colors.none;
}
export function severityBg(s) {
  return { HIGH:colors.highBg, MED:colors.medBg, LOW:colors.lowBg }[s] ?? colors.noneBg;
}
export function severityLabel(s) {
  return { HIGH:'HIGH', MED:'MEDIUM', LOW:'LOW', NONE:'CLEAR' }[s] ?? 'CLEAR';
}
