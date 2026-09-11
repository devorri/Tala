import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ScanResultCard } from '@/components/ui/ScanResultCard';
import { BrandButton } from '@/components/ui/BrandButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MOCK_CROP_DISEASES, CropScanResult, SoilScanResult } from '@/services/mock-data';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { scanCropWithGemini, scanSoilWithGemini } from '@/services/gemini';
import { SoilScanResultCard } from '@/components/ui/SoilScanResultCard';

export default function ScannerScreen() {
  const { scans, addScanResult, addScanResultFromAI } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<CropScanResult | null>(scans[0] || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'crop' | 'soil'>('crop');
  const [soilResult, setSoilResult] = useState<SoilScanResult | null>(null);

  const samplePresets: { key: keyof typeof MOCK_CROP_DISEASES; title: string; subtitle: string }[] = [
    { key: 'rice_blast', title: 'Rice Blast', subtitle: 'Tukod-Langit sa Dahon' },
    { key: 'bacterial_blight', title: 'Bacterial Blight', subtitle: 'Pangungulubot ng Dahon' },
    { key: 'brown_spot', title: 'Brown Spot', subtitle: 'Kayumangging Batik' },
    { key: 'healthy_leaf', title: 'Healthy Rice Foliage', subtitle: 'Walang Sakit / Malusog' },
  ];

  /**
   * Perform a real AI scan using Gemini Vision.
   * Falls back to mock data if the API call fails.
   */
  const performAiScan = async (imageUri: string) => {
    console.log('[Scanner] performAiScan called with URI:', imageUri);
    setIsScanning(true);
    try {
      console.log('[Scanner] Calling scanCropWithGemini...');
      const aiResult = await scanCropWithGemini(imageUri);
      console.log('[Scanner] AI result:', aiResult ? 'SUCCESS' : 'null (falling back to mock)');
      if (aiResult) {
        const newScan = addScanResultFromAI(aiResult, imageUri);
        setCurrentResult(newScan);
      } else {
        // Fallback to mock data if AI is unavailable
        console.warn('[Scanner] AI returned null — using mock fallback');
        const newScan = addScanResult('rice_blast', imageUri);
        setCurrentResult(newScan);
      }
    } catch (err) {
      console.error('[Scanner] performAiScan error:', err);
      // Fallback to mock data on any error
      const newScan = addScanResult('rice_blast', imageUri);
      setCurrentResult(newScan);
    } finally {
      setIsScanning(false);
    }
  };

  const performSoilScan = async (imageUri: string) => {
    setIsScanning(true);
    try {
      const aiResult = await scanSoilWithGemini(imageUri);
      setSoilResult(aiResult ? { ...aiResult, imageUri } : {
        soilAppearance: 'Mukhang tuyong loam soil', confidence: 72, moistureAssessment: 'Tuyo sa ibabaw', imageUri,
        observations: ['May nakikitang maliliit na bitak sa ibabaw.', 'Maluwag ang upper layer ngunit walang nakikitang standing water.', 'Kailangan pa ng aktwal na probe o laboratory check para sa pH at nutrients.'],
        recommendation: 'Suriin ang soil-moisture sensor bago magpatubig. Kung mababa ang reading, magbigay ng banayad na patubig at obserbahan muli pagkatapos ng ilang oras.',
        disclaimer: 'AI-assisted visual assessment lamang ito, hindi laboratory soil test.',
      });
    } finally { setIsScanning(false); }
  };

  const runSelectedMode = async (imageUri: string) => {
    setSelectedImage(imageUri);
    if (scanMode === 'soil') await performSoilScan(imageUri);
    else await performAiScan(imageUri);
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Kailangan ng Pahintulot',
          'Pahintulutan ang TALA na gamitin ang iyong gallery upang makapagsuri ng dahon ng palay.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await runSelectedMode(result.assets[0].uri);
      }
    } catch {
      // If image picker itself fails, fall back to mock
      simulateAiDiagnosis('rice_blast');
    }
  };

  const handleTakePhoto = async () => {
    console.log('[Scanner] handleTakePhoto pressed');
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log('[Scanner] Camera permission granted:', permissionResult.granted);
      if (!permissionResult.granted) {
        Alert.alert(
          'Kailangan ng Pahintulot',
          'Pahintulutan ang TALA na gamitin ang camera upang kumuha ng litrato ng palay.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('[Scanner] Camera result canceled:', result.canceled);
      if (!result.canceled && result.assets[0].uri) {
        await runSelectedMode(result.assets[0].uri);
      }
    } catch (err) {
      console.error('[Scanner] handleTakePhoto error:', err);
      simulateAiDiagnosis('brown_spot');
    }
  };

  /** Mock-only diagnosis used by sample presets */
  const simulateAiDiagnosis = (
    diseaseKey: keyof typeof MOCK_CROP_DISEASES,
    imageUri?: string
  ) => {
    setIsScanning(true);
    setTimeout(() => {
      const newScan = addScanResult(diseaseKey, imageUri || selectedImage || undefined);
      setCurrentResult(newScan);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title={scanMode === 'crop' ? 'AI Crop Scanner' : 'AI Soil Check'}
        subtitle={scanMode === 'crop' ? 'Matalinong Pagsusuri ng Sakit sa Palay' : 'Visual soil assessment para sa bukid'}
        gradientVariant="tealToYellow"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.modeSwitch}>
          <TouchableOpacity onPress={() => { setScanMode('crop'); setSelectedImage(null); setSoilResult(null); }} style={[styles.modeButton, scanMode === 'crop' && styles.modeButtonActive]}>
            <IconSymbol name="leaf" size={17} color={scanMode === 'crop' ? '#14291E' : Glass.text} /><Text style={[styles.modeText, scanMode === 'crop' && styles.modeTextActive]}>Crop Health</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setScanMode('soil'); setSelectedImage(null); }} style={[styles.modeButton, scanMode === 'soil' && styles.modeButtonActive]}>
            <IconSymbol name="soil.moisture" size={17} color={scanMode === 'soil' ? '#14291E' : Glass.text} /><Text style={[styles.modeText, scanMode === 'soil' && styles.modeTextActive]}>Soil Check</Text>
          </TouchableOpacity>
        </View>
        {/* Scanner Viewfinder / Action Card */}
        <AnimatedCard delay={100}>
          <View style={[styles.viewfinderCard, Shadows.medium]}>
            <View style={styles.viewfinderFrame}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
              ) : (
                <View style={styles.viewfinderPlaceholder}>
                  <View style={styles.cameraCircle}>
                    <IconSymbol name="camera" size={30} color={BrandColors.tealGreen} />
                  </View>
                  <Text style={styles.viewfinderText}>
                    {scanMode === 'crop' ? 'Kunan ang dahon o palay para sa AI-assisted crop health check.' : 'Kunan ang lupa nang malapitan para sa AI-assisted visual soil check.'}
                  </Text>
                </View>
              )}

              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Scanning loading overlay */}
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color={BrandColors.goldenYellow} />
                  <Text style={styles.scanningText}>{scanMode === 'crop' ? 'Sinusuri ang patterns ng dahon gamit ang AI...' : 'Sinusuri ang nakikitang kondisyon ng lupa...'}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <BrandButton
                title="Kumuha ng Litrato"
                onPress={handleTakePhoto}
                variant="teal"
                size="md"
                icon="camera"
                style={{ flex: 1, marginRight: 6 }}
              />
              <BrandButton
                title="Mag-upload (Gallery)"
                onPress={handlePickImage}
                variant="outline"
                size="md"
                icon="doc.text.viewfinder"
                style={{ flex: 1, marginLeft: 6 }}
              />
            </View>
          </View>
        </AnimatedCard>

        {/* Quick Sample Presets */}
        {scanMode === 'crop' && <AnimatedCard delay={180}>
          <View style={styles.presetsSection}>
            <Text style={styles.presetsTitle}>O subukan ang mga Halimbawang Pagsusuri:</Text>
            <View style={styles.presetButtonsGrid}>
              {samplePresets.map((preset) => (
                <TouchableOpacity
                  key={preset.key}
                  onPress={() => simulateAiDiagnosis(preset.key)}
                  style={styles.presetBtn}
                  activeOpacity={0.75}>
                  <Text style={styles.presetBtnTitle}>{preset.title}</Text>
                  <Text style={styles.presetBtnSub}>{preset.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </AnimatedCard>}

        {/* Latest Scan Result */}
        {scanMode === 'crop' && currentResult && (
          <AnimatedCard delay={240}>
            <View style={styles.resultSection}>
              <Text style={styles.sectionHeaderTitle}>Resulta ng Pagsusuri (AI Analysis)</Text>
              <ScanResultCard result={currentResult} />
            </View>
          </AnimatedCard>
        )}

        {scanMode === 'soil' && soilResult && <AnimatedCard delay={240}><View style={styles.resultSection}><Text style={styles.sectionHeaderTitle}>Resulta ng Soil Check</Text><SoilScanResultCard result={soilResult} /></View></AnimatedCard>}

        {/* Past Scans History */}
        {scanMode === 'crop' && <AnimatedCard delay={300}>
          <View style={styles.historySection}>
            <Text style={styles.sectionHeaderTitle}>Kasaysayan ng mga Na-scan (Past Scans)</Text>
            {scans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                onPress={() => setCurrentResult(scan)}
                style={[styles.historyItem, Shadows.subtle]}
                activeOpacity={0.8}>
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyDot,
                      {
                        backgroundColor:
                          scan.severity === 'high'
                            ? BrandColors.danger
                            : scan.severity === 'moderate'
                            ? BrandColors.goldenYellow
                            : BrandColors.tealGreen,
                      },
                    ]}
                  />
                  <View>
                    <Text style={styles.historyTitle}>{scan.diseaseName}</Text>
                    <Text style={styles.historySub}>{scan.dateScanned} • {scan.confidence.toFixed(1)}% Confidence</Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={18} color={BrandColors.slate} />
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>}
      </ScrollView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  modeSwitch: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  modeButton: { flex: 1, minHeight: 44, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Glass.border, backgroundColor: Glass.surface, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
  modeButtonActive: { backgroundColor: '#A3E635', borderColor: '#A3E635' },
  modeText: { color: Glass.text, fontSize: 12, fontWeight: '800' },
  modeTextActive: { color: '#14291E' },
  viewfinderCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  viewfinderFrame: {
    height: 190,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  viewfinderPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  cameraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs + 2,
  },
  viewfinderText: {
    color: '#94A3B8',
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: BrandColors.goldenYellow,
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  scanningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanningText: {
    color: BrandColors.white,
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
  },
  presetsSection: {
    marginBottom: Spacing.lg,
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Glass.mutedText,
    marginBottom: 8,
  },
  presetButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: Glass.surfaceSoft,
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Glass.border,
    width: '48%',
  },
  presetBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.primaryBlueDark,
  },
  presetBtnSub: {
    fontSize: 10,
    color: Glass.mutedText,
    marginTop: 1,
  },
  resultSection: {
    marginTop: Spacing.xs,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  historySection: {
    marginTop: Spacing.sm,
  },
  historyItem: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Glass.text,
  },
  historySub: {
    fontSize: 10.5,
    color: Glass.mutedText,
    marginTop: 1,
  },
});
