import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandButton } from '@/components/ui/BrandButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function GrowthTrackerScreen() {
  const { growthRecords } = useApp();
  const [selectedRecordId, setSelectedRecordId] = useState(growthRecords[0]?.id || 'grow-01');
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [newHeight, setNewHeight] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const activeRecord = growthRecords.find((r) => r.id === selectedRecordId) || growthRecords[0];

  const handleSaveLog = () => {
    if (!newHeight) return;
    activeRecord.logs.push({
      date: `Day ${activeRecord.currentDay + 1}`,
      height: parseFloat(newHeight),
      notes: newNotes || 'Naitalang bagong sukat ng palay',
    });
    setNewHeight('');
    setNewNotes('');
    setIsLogModalVisible(false);
  };

  const progressPercent = Math.min(
    100,
    (activeRecord.currentDay / activeRecord.targetHarvestDays) * 100
  );

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Tagasubaybay ng Paglaki"
        subtitle="Plant Growth Tracker & Height Timeline"
        showBack
        rightActionIcon="add"
        onRightAction={() => setIsLogModalVisible(true)}
        gradientVariant="tealToYellow"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Plot Selector Bar */}
        <View style={styles.selectorRow}>
          {growthRecords.map((rec) => {
            const isSelected = rec.id === selectedRecordId;
            return (
              <TouchableOpacity
                key={rec.id}
                onPress={() => setSelectedRecordId(rec.id)}
                style={[styles.selectorTab, isSelected && styles.selectorTabActive]}
                activeOpacity={0.8}>
                <Text style={[styles.selectorText, isSelected && styles.selectorTextActive]}>
                  {rec.cropType}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Main Crop Overview Card */}
        <View style={[styles.overviewCard, Shadows.medium]}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.plotLabel}>{activeRecord.plotName}</Text>
              <Text style={styles.cropTitle}>{activeRecord.cropType}</Text>
              <Text style={styles.plantedDate}>Naitanim: {activeRecord.plantingDate}</Text>
            </View>
            <StatusBadge
              label={`${activeRecord.healthScore}% MALUSOG`}
              type="optimal"
              icon="sprout"
            />
          </View>

          {/* Progress to Harvest */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Araw {activeRecord.currentDay} ng {activeRecord.targetHarvestDays} Hanggang Ani
              </Text>
              <Text style={styles.progressPercentText}>{progressPercent.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressSub}>
              Yugto: Vegetative Tillering • Naka-schedule ang harvest sa Nobyembre 2026
            </Text>
          </View>

          {/* Current Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>{activeRecord.heightCm} cm</Text>
              <Text style={styles.metricName}>Kasalukuyang Taas</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>18-22</Text>
              <Text style={styles.metricName}>Uhay / Tillers bawat Puno</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>94%</Text>
              <Text style={styles.metricName}>Health Index</Text>
            </View>
          </View>
        </View>

        {/* Height Timeline Chart */}
        <View style={[styles.chartCard, Shadows.subtle]}>
          <Text style={styles.chartTitle}>Kasaysayan ng Pagtaas (Height Growth Timeline)</Text>
          <View style={styles.timelineRow}>
            {activeRecord.logs.map((log, idx) => (
              <View key={idx} style={styles.timelineCol}>
                <View style={styles.barStack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: (log.height / 60) * 100,
                        backgroundColor: BrandColors.tealGreen,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barHeightText}>{log.height}cm</Text>
                <Text style={styles.barDateText}>{log.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Observation Notes List */}
        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesTitle}>Mga Obserbasyon sa Sakahan</Text>
            <TouchableOpacity onPress={() => setIsLogModalVisible(true)}>
              <Text style={styles.addNoteText}>+ Bagong Sukat</Text>
            </TouchableOpacity>
          </View>

          {activeRecord.logs.map((log, idx) => (
            <View key={idx} style={[styles.logCard, Shadows.subtle]}>
              <View style={styles.logTop}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logHeight}>{log.height} cm</Text>
              </View>
              <Text style={styles.logNotes}>{log.notes}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Log Modal */}
      <Modal visible={isLogModalVisible} transparent animationType="slide">
        <SafeAreaView style={styles.modalOverlay} edges={['top', 'right', 'bottom', 'left']}>
          <View style={[styles.modalCard, Shadows.medium]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Itala ang Bagong Sukat</Text>
              <TouchableOpacity onPress={() => setIsLogModalVisible(false)}>
                <IconSymbol name="close" size={20} color={BrandColors.slate} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Taas ng Halaman (sa Sentimetro / cm)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Hal. 52"
              keyboardType="numeric"
              value={newHeight}
              onChangeText={setNewHeight}
              placeholderTextColor={BrandColors.mutedText}
            />

            <Text style={styles.inputLabel}>Mga Napunang Katangian / Obserbasyon</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              placeholder="Hal. Matingkad ang kulay ng dahon, walang senyales ng uod..."
              multiline
              value={newNotes}
              onChangeText={setNewNotes}
              placeholderTextColor={BrandColors.mutedText}
            />

            <View style={styles.modalButtons}>
              <BrandButton
                title="Kanselahin"
                onPress={() => setIsLogModalVisible(false)}
                variant="ghost"
                style={{ flex: 1 }}
              />
              <BrandButton
                title="I-save ang Sukat"
                onPress={handleSaveLog}
                variant="teal"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  selectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  selectorTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Glass.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorTabActive: {
    backgroundColor: BrandColors.tealGreen,
    borderColor: BrandColors.tealGreen,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: Glass.mutedText,
  },
  selectorTextActive: {
    color: BrandColors.white,
  },
  overviewCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  plotLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    textTransform: 'uppercase',
  },
  cropTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Glass.text,
  },
  plantedDate: {
    fontSize: 11,
    color: Glass.mutedText,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Glass.text,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.primaryBlueDark,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.primaryBlue,
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 10.5,
    color: Glass.mutedText,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '900',
    color: BrandColors.charcoal,
  },
  metricName: {
    fontSize: 10,
    color: BrandColors.slate,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  chartCard: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: BrandColors.charcoal,
    marginBottom: Spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timelineCol: {
    alignItems: 'center',
  },
  barStack: {
    width: 24,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barHeightText: {
    fontSize: 11,
    fontWeight: '800',
    color: BrandColors.charcoal,
    marginTop: 4,
  },
  barDateText: {
    fontSize: 10,
    color: BrandColors.slate,
  },
  notesSection: {
    marginTop: Spacing.xs,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  addNoteText: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
  },
  logCard: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  logHeight: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
  },
  logNotes: {
    fontSize: 11.5,
    color: BrandColors.slate,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: BrandColors.slate,
    marginBottom: 4,
    marginTop: Spacing.xs,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    padding: 10,
    fontSize: 13,
    color: BrandColors.charcoal,
    backgroundColor: '#F8FAFC',
    marginBottom: Spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
