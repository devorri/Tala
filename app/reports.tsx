import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Glass, BrandColors, BorderRadius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ReportsScreen() {
  const { sensorData, alerts, calendarEvents, weatherData, isSupabaseConnected } = useApp();
  const pendingAlerts = alerts.filter((alert) => !alert.actionDone).length;
  const pendingTasks = calendarEvents.filter((event) => !event.completed).length;

  const metrics = [
    { label: 'Water level', value: `${sensorData.waterLevel}%`, icon: 'water.drop' as const, accent: '#38BDF8' },
    { label: 'Soil moisture', value: `${sensorData.soilMoisture}%`, icon: 'soil.moisture' as const, accent: '#A3E635' },
    { label: 'Temperature', value: `${sensorData.temperature.toFixed(1)}°C`, icon: 'thermostat' as const, accent: '#FB923C' },
    { label: 'Humidity', value: `${sensorData.humidity.toFixed(0)}%`, icon: 'humidity' as const, accent: '#60A5FA' },
  ];

  return (
    <FarmScreen>
      <GradientHeader title="Ulat ng Sakahan" subtitle="Live snapshot ng SEMINA at mga gawain" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View><Text style={styles.eyebrow}>LIVE REPORT</Text><Text style={styles.statusTitle}>SEMINA Node 01</Text></View>
          <View style={styles.online}><View style={styles.onlineDot} /><Text style={styles.onlineText}>{isSupabaseConnected ? 'CONNECTED' : 'OFFLINE DATA'}</Text></View>
        </View>

        <View style={styles.metricGrid}>{metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <IconSymbol name={metric.icon} size={19} color={metric.accent} />
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}</View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patubig at Kalagayan</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Irrigation mode</Text><Text style={styles.rowValue}>{sensorData.irrigationMode} • {sensorData.irrigationStatus}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Hydroponic pH</Text><Text style={styles.rowValue}>{sensorData.hydroponics.pH.toFixed(2)} • {sensorData.hydroponics.pHStatus}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Weather</Text><Text style={styles.rowValue}>{weatherData ? `${weatherData.conditionTagalog}, ${weatherData.temperature}°C` : 'Loading forecast…'}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Last telemetry</Text><Text style={styles.rowValue}>{sensorData.lastUpdated}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mga Kailangan ng Pansin</Text>
          <View style={styles.attentionRow}><IconSymbol name="warning" size={18} color="#FACC15" /><Text style={styles.attentionText}>{pendingAlerts} aktibong alerto</Text></View>
          <View style={styles.attentionRow}><IconSymbol name="calendar" size={18} color="#A3E635" /><Text style={styles.attentionText}>{pendingTasks} gawaing hindi pa namamarkahang tapos</Text></View>
        </View>

        <Text style={styles.note}>Ang ulat na ito ay live snapshot mula sa kasalukuyang TALA data. Para sa history at field diary, gamitin ang Digital Records.</Text>
      </ScrollView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: 120, gap: Spacing.md },
  statusCard: { backgroundColor: Glass.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Glass.border, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: '#A3E635', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  statusTitle: { color: Glass.text, fontSize: 17, fontWeight: '900', marginTop: 2 },
  online: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Glass.surfaceSoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: BorderRadius.full },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A3E635' },
  onlineText: { color: Glass.text, fontSize: 9, fontWeight: '900' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  metricCard: { width: '48%', backgroundColor: Glass.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Glass.border, padding: Spacing.md },
  metricValue: { color: Glass.text, fontSize: 19, fontWeight: '900', marginTop: 9 },
  metricLabel: { color: Glass.mutedText, fontSize: 10.5, marginTop: 2 },
  card: { backgroundColor: Glass.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Glass.border, padding: Spacing.md },
  sectionTitle: { color: Glass.text, fontSize: 14, fontWeight: '800', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 14, paddingVertical: 9, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' },
  rowLabel: { flex: 0.42, color: Glass.mutedText, fontSize: 11 },
  rowValue: { flex: 0.58, color: Glass.text, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  attentionRow: { flexDirection: 'row', gap: 9, alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' },
  attentionText: { color: Glass.text, fontSize: 12, fontWeight: '700' },
  note: { color: 'rgba(255,255,255,0.62)', fontSize: 10.5, lineHeight: 15, paddingHorizontal: 3 },
});
