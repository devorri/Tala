import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { DataChart } from '@/components/ui/DataChart';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { BrandButton } from '@/components/ui/BrandButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MOCK_DIGITAL_RECORDS } from '@/services/mock-data';

export default function RecordsScreen() {
  const { farmerNotes, addFarmerNote } = useApp();
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);

  const quiz = MOCK_DIGITAL_RECORDS.surveyQuiz;

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    addFarmerNote(newNoteText);
    setNewNoteText('');
  };

  const handleExportSheets = () => {
    Alert.alert(
      'Google Sheets Export',
      'Matagumpay na nai-export ang talaan ng patubig at telemetry sa "TALA_SEMINA_FarmerJuan_Records.xlsx" sa iyong Google Drive.'
    );
  };

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Mga Tala at Kasaysayan"
        subtitle="Digital Records, AWD Water Savings, at Field Logs"
        showBack
        gradientVariant="summerVibe"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Total Impact Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, Shadows.subtle]}>
            <View style={styles.summaryIconCircle}>
              <IconSymbol name="water.drop" size={20} color={BrandColors.primaryBlue} />
            </View>
            <Text style={styles.summaryVal}>1,450 Liters</Text>
            <Text style={styles.summaryLabel}>Natipid na Tubig (AWD)</Text>
            <Text style={styles.summarySub}>Katumbas ng 28% water reduction</Text>
          </View>

          <View style={[styles.summaryCard, Shadows.subtle]}>
            <View style={[styles.summaryIconCircle, { backgroundColor: BrandColors.goldenYellowLight }]}>
              <IconSymbol name="sun.max" size={20} color={BrandColors.goldenYellowDark} />
            </View>
            <Text style={styles.summaryVal}>38.6 kWh</Text>
            <Text style={styles.summaryLabel}>Solar Energy Generated</Text>
            <Text style={styles.summarySub}>Zero-cost pumping power</Text>
          </View>
        </View>

        {/* Google Sheets Export Card */}
        <View style={[styles.exportCard, Shadows.subtle]}>
          <View style={styles.exportLeft}>
            <IconSymbol name="analytics" size={22} color={BrandColors.tealGreenDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.exportTitle}>Google Sheets Cloud Sync</Text>
              <Text style={styles.exportDesc}>
                I-download o i-sync ang kumpletong logs ng irigasyon at sensor readings.
              </Text>
            </View>
          </View>
          <BrandButton
            title="I-export (CSV/Sheets)"
            onPress={handleExportSheets}
            variant="teal"
            size="sm"
          />
        </View>

        {/* Water Consumption Chart */}
        <DataChart
          title="Lingguhang Konsumo at Tipid sa Tubig"
          subtitle="Paghahambing ng Nagamit vs Natipid sa pamamagitan ng SEMINA"
          data={MOCK_DIGITAL_RECORDS.waterUsageThisWeek}
        />

        {/* Farmer Field Notes Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Talaan ng Magsasaka (Field Diary)</Text>
          <View style={[styles.noteInputCard, Shadows.subtle]}>
            <TextInput
              placeholder="Isulat ang ginawang abono, lagay ng palay, o panahon..."
              value={newNoteText}
              onChangeText={setNewNoteText}
              style={styles.noteInput}
              multiline
              placeholderTextColor={BrandColors.mutedText}
            />
            <View style={styles.noteInputFooter}>
              <Text style={styles.noteAuthorText}>May-akda: Ka Juan Dela Cruz</Text>
              <BrandButton
                title="Itala sa Diary"
                onPress={handleAddNote}
                variant="primary"
                size="sm"
                icon="sprout"
              />
            </View>
          </View>

          {farmerNotes.map((note) => (
            <View key={note.id} style={[styles.noteItemCard, Shadows.subtle]}>
              <View style={styles.noteItemTop}>
                <Text style={styles.noteItemAuthor}>{note.author}</Text>
                <Text style={styles.noteItemDate}>{note.date}</Text>
              </View>
              <Text style={styles.noteItemText}>{note.text}</Text>
            </View>
          ))}
        </View>

        {/* Farmer Educational Survey & Quiz */}
        <View style={[styles.quizCard, Shadows.subtle]}>
          <View style={styles.quizHeader}>
            <IconSymbol name="sprout" size={18} color={BrandColors.tealGreenDark} />
            <Text style={styles.quizTitle}>Pagsasanay: Karunungan sa Pagtitipid ng Tubig</Text>
          </View>
          <Text style={styles.quizQuestion}>{quiz.question}</Text>

          <View style={styles.optionsList}>
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === quiz.correctIndex;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedQuizAnswer(idx);
                    setIsQuizAnswered(true);
                  }}
                  style={[
                    styles.optionBtn,
                    isSelected &&
                      (isCorrect ? styles.optionBtnCorrect : styles.optionBtnWrong),
                  ]}
                  activeOpacity={0.75}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected &&
                        (isCorrect ? styles.optionTextCorrect : styles.optionTextWrong),
                    ]}>
                    {idx + 1}. {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isQuizAnswered && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>
                {selectedQuizAnswer === quiz.correctIndex ? '✓ Tama ang iyong sagot!' : 'Paliwanag:'}
              </Text>
              <Text style={styles.explanationText}>{quiz.explanation}</Text>
            </View>
          )}
        </View>
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
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  summaryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.primaryBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '900',
    color: Glass.text,
  },
  summaryLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Glass.text,
    marginTop: 2,
  },
  summarySub: {
    fontSize: 10,
    color: Glass.mutedText,
    marginTop: 2,
  },
  exportCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  exportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  exportTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Glass.text,
  },
  exportDesc: {
    fontSize: 11,
    color: Glass.mutedText,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: BrandColors.charcoal,
    marginBottom: Spacing.xs,
  },
  noteInputCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  noteInput: {
    height: 60,
    fontSize: 13,
    color: BrandColors.charcoal,
    textAlignVertical: 'top',
  },
  noteInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  noteAuthorText: {
    fontSize: 11,
    color: BrandColors.slate,
    fontWeight: '600',
  },
  noteItemCard: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  noteItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteItemAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
  },
  noteItemDate: {
    fontSize: 11,
    color: BrandColors.slate,
  },
  noteItemText: {
    fontSize: 12,
    color: BrandColors.charcoal,
    lineHeight: 17,
  },
  quizCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  quizTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  quizQuestion: {
    fontSize: 12.5,
    fontWeight: '700',
    color: BrandColors.charcoal,
    lineHeight: 18,
    marginVertical: Spacing.xs,
  },
  optionsList: {
    gap: 6,
    marginTop: Spacing.xs,
  },
  optionBtn: {
    backgroundColor: BrandColors.white,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionBtnCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  optionBtnWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 12,
    color: BrandColors.charcoal,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#15803D',
    fontWeight: '800',
  },
  optionTextWrong: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  explanationBox: {
    backgroundColor: BrandColors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.tealGreen,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 11.5,
    color: BrandColors.charcoal,
    lineHeight: 16,
  },
});
