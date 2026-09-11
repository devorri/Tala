import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { CropScanResult } from '@/services/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ScanResultCardProps {
  result: CropScanResult;
}

export function ScanResultCard({ result }: ScanResultCardProps) {
  const isHealthy = result.confidence > 90 && result.severity === 'low' && !result.diseaseName.includes('Blast') && !result.diseaseName.includes('Blight') && !result.diseaseName.includes('Spot');

  return (
    <View style={[styles.card, Shadows.medium]}>
      {/* Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <IconSymbol name="warning" size={14} color="#92400E" />
        <Text style={styles.disclaimerText}>
          PAALALA: Paunang babala lamang (Early Warning), hindi pinal na diagnosis ng Agronomist.
        </Text>
      </View>

      <View style={styles.body}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cropName}>{result.cropName}</Text>
            <Text style={styles.diseaseName}>{result.diseaseName}</Text>
            <Text style={styles.tagalogName}>({result.tagalogName})</Text>
          </View>
          <StatusBadge
            label={`${result.confidence.toFixed(1)}% Katiyakan`}
            type={isHealthy ? 'optimal' : result.severity === 'high' ? 'critical' : 'warning'}
            size="sm"
          />
        </View>

        {/* Confidence Meter */}
        <View style={styles.meterContainer}>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${result.confidence}%`,
                  backgroundColor: isHealthy
                    ? BrandColors.tealGreen
                    : result.severity === 'high'
                    ? BrandColors.danger
                    : BrandColors.goldenYellow,
                },
              ]}
            />
          </View>
        </View>

        {/* Scanned Image Preview if available */}
        {result.imageUri && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: result.imageUri }} style={styles.scannedImage} resizeMode="cover" />
          </View>
        )}

        {/* Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="analytics" size={16} color={BrandColors.primaryBlue} />
            <Text style={styles.sectionTitle}>Mga Napunang Sintomas (Observed Symptoms)</Text>
          </View>
          {result.symptoms.map((symptom, idx) => (
            <View key={idx} style={styles.symptomRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>

        {/* Traditional Filipino Solution */}
        <View style={[styles.solutionBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
          <View style={styles.solutionHeader}>
            <IconSymbol name="leaf" size={16} color={BrandColors.tealGreenDark} />
            <Text style={[styles.solutionTitle, { color: BrandColors.tealGreenDark }]}>
              Tradisyonal na Solusyon (Folk / Organic Remedy)
            </Text>
          </View>
          <Text style={styles.solutionContent}>{result.traditionalRemedy}</Text>
        </View>

        {/* Scientific / Agronomist Standard Solution */}
        <View style={[styles.solutionBox, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
          <View style={styles.solutionHeader}>
            <IconSymbol name="chemistry" size={16} color={BrandColors.primaryBlueDark} />
            <Text style={[styles.solutionTitle, { color: BrandColors.primaryBlueDark }]}>
              Modernong Gabay (PhilRice / DA Recommendation)
            </Text>
          </View>
          <Text style={styles.solutionContent}>{result.scientificSolution}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.lg,
  },
  disclaimerBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  disclaimerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
    lineHeight: 14,
  },
  body: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cropName: {
    fontSize: 11,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '800',
    color: Glass.text,
    letterSpacing: -0.3,
  },
  tagalogName: {
    fontSize: 12,
    fontWeight: '600',
    color: Glass.mutedText,
  },
  meterContainer: {
    marginVertical: Spacing.xs + 2,
  },
  meterTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  imageWrapper: {
    height: 160,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  scannedImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Glass.text,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bullet: {
    color: BrandColors.primaryBlue,
    fontSize: 14,
    marginRight: 6,
    lineHeight: 16,
  },
  symptomText: {
    fontSize: 12,
    color: Glass.text,
    flex: 1,
    lineHeight: 16,
  },
  solutionBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  solutionTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  solutionContent: {
    fontSize: 12,
    color: Glass.text,
    lineHeight: 17,
  },
});
