import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Glass, BorderRadius, Spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SoilScanResult } from '@/services/mock-data';

export function SoilScanResultCard({ result }: { result: SoilScanResult }) {
  return <View style={styles.card}>
    <View style={styles.notice}><IconSymbol name="warning" size={14} color="#92400E" /><Text style={styles.noticeText}>{result.disclaimer}</Text></View>
    <View style={styles.body}>
      <Text style={styles.eyebrow}>AI-ASSISTED SOIL CHECK</Text><Text style={styles.title}>{result.soilAppearance}</Text>
      <Text style={styles.moisture}>Visual moisture: {result.moistureAssessment} • {result.confidence}% confidence</Text>
      {result.imageUri ? <Image source={{ uri: result.imageUri }} style={styles.image} /> : null}
      <Text style={styles.sectionTitle}>Mga napuna sa larawan</Text>
      {result.observations.map((item, index) => <View key={index} style={styles.item}><Text style={styles.bullet}>•</Text><Text style={styles.itemText}>{item}</Text></View>)}
      <View style={styles.tip}><IconSymbol name="sprout" size={16} color="#A3E635" /><View style={{ flex: 1 }}><Text style={styles.tipTitle}>Susunod na hakbang</Text><Text style={styles.tipText}>{result.recommendation}</Text></View></View>
    </View>
  </View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: Glass.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Glass.border, overflow: 'hidden', marginBottom: Spacing.lg }, notice: { flexDirection: 'row', gap: 8, padding: 9, backgroundColor: '#FEF3C7', alignItems: 'center' }, noticeText: { flex: 1, color: '#92400E', fontSize: 10.5, lineHeight: 14, fontWeight: '700' }, body: { padding: Spacing.md }, eyebrow: { color: '#A3E635', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 }, title: { color: Glass.text, fontSize: 16, fontWeight: '900', marginTop: 3 }, moisture: { color: Glass.mutedText, fontSize: 11.5, marginTop: 3 }, image: { width: '100%', height: 165, borderRadius: BorderRadius.md, marginTop: Spacing.sm }, sectionTitle: { color: Glass.text, fontSize: 12.5, fontWeight: '800', marginTop: Spacing.md, marginBottom: 6 }, item: { flexDirection: 'row', gap: 6, marginBottom: 4 }, bullet: { color: '#A3E635', fontSize: 14 }, itemText: { flex: 1, color: Glass.mutedText, fontSize: 12, lineHeight: 16 }, tip: { flexDirection: 'row', gap: 8, backgroundColor: Glass.surfaceSoft, borderRadius: BorderRadius.md, borderLeftWidth: 3, borderLeftColor: '#A3E635', padding: 10, marginTop: Spacing.sm }, tipTitle: { color: Glass.text, fontSize: 11.5, fontWeight: '800' }, tipText: { color: Glass.mutedText, fontSize: 11.5, lineHeight: 16, marginTop: 2 } });
