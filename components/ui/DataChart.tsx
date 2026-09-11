import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';

interface BarDataPoint {
  day: string;
  liters: number;
  savedLiters?: number;
}

interface DataChartProps {
  title: string;
  subtitle?: string;
  data: BarDataPoint[];
}

export function DataChart({ title, subtitle, data }: DataChartProps) {
  const maxLiters = Math.max(...data.map((d) => d.liters + (d.savedLiters || 0)), 500);

  return (
    <View style={[styles.card, Shadows.subtle]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: BrandColors.primaryBlue }]} />
          <Text style={styles.legendText}>Nagamit na Tubig (Used Liters)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: BrandColors.tealGreen }]} />
          <Text style={styles.legendText}>Natipid ng SEMINA AWD (Saved)</Text>
        </View>
      </View>

      {/* Chart Bars */}
      <View style={styles.chartContainer}>
        {data.map((item, idx) => {
          const usedHeight = (item.liters / maxLiters) * 110;
          const savedHeight = item.savedLiters ? (item.savedLiters / maxLiters) * 110 : 0;

          return (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barStack}>
                {savedHeight > 0 && (
                  <View
                    style={[
                      styles.barSegment,
                      {
                        height: savedHeight,
                        backgroundColor: BrandColors.tealGreen,
                        opacity: 0.85,
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.barSegment,
                    {
                      height: usedHeight,
                      backgroundColor: BrandColors.primaryBlue,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <Text style={styles.valueLabel}>{item.liters}L</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  header: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
  },
  subtitle: {
    fontSize: 11.5,
    color: Glass.mutedText,
    marginTop: 1,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10.5,
    color: Glass.mutedText,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barStack: {
    width: 18,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    justifyContent: 'flex-end',
  },
  barSegment: {
    width: '100%',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Glass.text,
    marginTop: 6,
  },
  valueLabel: {
    fontSize: 9.5,
    color: Glass.mutedText,
    fontWeight: '500',
  },
});
