import React, { useMemo, useState } from 'react';
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
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { BrandButton } from '@/components/ui/BrandButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type CalendarDay = { date: string; day: number; isCurrentMonth: boolean };

function buildMonth(month: Date): CalendarDay[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date: formatDateKey(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month.getMonth(),
    };
  });
}

export default function CalendarScreen() {
  const { calendarEvents, addCalendarEvent, toggleCalendarEventCompleted } = useApp();
  const [selectedDay, setSelectedDay] = useState(() => formatDateKey(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventType, setNewEventType] = useState<'planting' | 'irrigation' | 'fertilizer' | 'traditional_lunar'>('irrigation');

  const calendarDays = useMemo(() => buildMonth(visibleMonth), [visibleMonth]);
  const selectedEvents = calendarEvents.filter((event) => event.date === selectedDay);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(visibleMonth);

  const moveMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDay(formatDateKey(today));
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const selectCalendarDay = (date: string) => {
    const selected = new Date(`${date}T12:00:00`);
    setSelectedDay(date);
    setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
  };

  const handleSaveEvent = async () => {
    if (!newEventTitle) return;
    await addCalendarEvent({
      date: selectedDay,
      title: newEventTitle,
      description: newEventDesc || 'Farm activity',
      type: newEventType,
      time: '07:00 AM',
      syncedWithGoogle: false,
    });
    setNewEventTitle('');
    setNewEventDesc('');
    setIsAddModalVisible(false);
  };

  const getEventIcon = (type: string): IconSymbolName => {
    switch (type) {
      case 'irrigation':
        return 'water.drop';
      case 'fertilizer':
        return 'leaf';
      case 'traditional_lunar':
        return 'sun.max';
      case 'harvest':
        return 'sprout';
      default:
        return 'calendar';
    }
  };

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Kalendaryo ng Pagtatanim"
        subtitle="Schedules, AWD Cycles, at Lunar Lore"
        rightActionIcon="add"
        onRightAction={() => setIsAddModalVisible(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Supabase calendar status */}
        <View style={[styles.googleSyncCard, Shadows.subtle]}>
          <View style={styles.googleSyncLeft}>
            <View style={styles.googleIconCircle}>
              <IconSymbol name="cloud.sync" size={18} color={BrandColors.primaryBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.googleSyncTitle}>Supabase Calendar</Text>
              <Text style={styles.googleSyncSubtitle}>
                Planting schedules, crop activities, and farm reminders are saved here.
              </Text>
            </View>
          </View>
          <StatusBadge label="SAVED" type="optimal" size="sm" />
        </View>

        {/* Full monthly planner */}
        <View style={styles.monthPlanner}>
          <View style={styles.monthToolbar}>
            <TouchableOpacity style={styles.todayButton} onPress={goToToday} activeOpacity={0.8}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
            <View style={styles.monthNav}>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => moveMonth(-1)}>
                <IconSymbol name="chevron.left" size={18} color={Glass.text} />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{monthLabel}</Text>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => moveMonth(1)}>
                <IconSymbol name="chevron.right" size={18} color={Glass.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekdayRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekdayLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.monthGrid}>
            {calendarDays.map((day) => {
              const isSelected = selectedDay === day.date;
              const isToday = formatDateKey(new Date()) === day.date;
              const dayEvents = calendarEvents.filter((event) => event.date === day.date);

              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => selectCalendarDay(day.date)}
                  style={[
                    styles.monthCell,
                    !day.isCurrentMonth && styles.monthCellMuted,
                    isSelected && styles.monthCellSelected,
                  ]}
                  activeOpacity={0.8}>
                  <Text style={[styles.monthDayNumber, !day.isCurrentMonth && styles.monthDayNumberMuted, isToday && styles.todayNumber]}>
                    {day.day}
                  </Text>
                  <View style={styles.monthEvents}>
                    {dayEvents.slice(0, 2).map((event) => (
                      <View key={event.id} style={[styles.monthEventPill, event.completed && styles.monthEventPillCompleted]}>
                        <Text numberOfLines={1} style={[styles.monthEventText, event.completed && styles.monthEventTextCompleted]}>
                          {event.completed ? '✓ ' : ''}{event.title}
                        </Text>
                      </View>
                    ))}
                    {dayEvents.length > 2 && <Text style={styles.moreEventsText}>+{dayEvents.length - 2} more</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rice Stage Indicator Banner */}
        <View style={[styles.cropStageCard, Shadows.subtle]}>
          <View style={styles.stageHeader}>
            <IconSymbol name="sprout" size={18} color={BrandColors.tealGreenDark} />
            <Text style={styles.stageTitle}>Kasalukuyang Yugto ng Palay: Araw 28 (Vegetative Tillering)</Text>
          </View>
          <Text style={styles.stageDesc}>
            Mahalaga ang pagpapanatili ng katamtamang kahalumigmigan. Isagawa ang SEMINA AWD method
            upang mapalalim ang mga ugat bago sumapit ang panicle initiation.
          </Text>
        </View>

        {/* List of Events */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeaderRow}>
            <Text style={styles.eventsSectionTitle}>Mga Gawain at Paalala</Text>
            <TouchableOpacity onPress={() => setIsAddModalVisible(true)} activeOpacity={0.7}>
              <Text style={styles.addText}>+ Magdagdag ng Gawain</Text>
            </TouchableOpacity>
          </View>

          {selectedEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, event.completed && styles.eventCardCompleted, Shadows.subtle]}>
              <View style={styles.eventLeft}>
                <View
                  style={[
                    styles.eventIconCircle,
                    {
                      backgroundColor:
                        event.type === 'traditional_lunar'
                          ? BrandColors.goldenYellowLight
                          : event.type === 'irrigation'
                          ? BrandColors.primaryBlueLight
                          : BrandColors.tealGreenLight,
                    },
                  ]}>
                  <IconSymbol
                    name={getEventIcon(event.type)}
                    size={20}
                    color={
                      event.type === 'traditional_lunar'
                        ? BrandColors.goldenYellowDark
                        : event.type === 'irrigation'
                        ? BrandColors.primaryBlueDark
                        : BrandColors.tealGreenDark
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.eventTitleRow}>
                    <Text style={[styles.eventTitle, event.completed && styles.eventTitleCompleted]}>{event.title}</Text>
                    {event.time && <Text style={styles.eventTime}>{event.time}</Text>}
                  </View>
                  <Text style={styles.eventDesc}>{event.description}</Text>
                  {event.stage && <Text style={styles.eventStage}>Yugto: {event.stage}</Text>}
                </View>
              </View>

              <View style={styles.eventFooter}>
                <Text style={styles.eventDateBadge}>{event.date}</Text>
                <TouchableOpacity
                  onPress={() => toggleCalendarEventCompleted(event.id)}
                  style={[styles.completeButton, event.completed && styles.completeButtonDone]}
                  activeOpacity={0.8}>
                  <IconSymbol name="checkmark" size={13} color={event.completed ? '#14291E' : Glass.text} />
                  <Text style={[styles.completeButtonText, event.completed && styles.completeButtonTextDone]}>
                    {event.completed ? 'Natapos na' : 'Markahan tapos'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {selectedEvents.length === 0 && (
            <View style={[styles.emptyEventsCard, Shadows.subtle]}>
              <Text style={styles.emptyEventsText}>No farm activities scheduled for this date.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={isAddModalVisible} transparent animationType="slide">
        <SafeAreaView style={styles.modalOverlay} edges={['top', 'right', 'bottom', 'left']}>
          <View style={[styles.modalCard, Shadows.medium]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Magdagdag ng Gawain sa Bukid</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <IconSymbol name="close" size={20} color={BrandColors.slate} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Pangalan ng Gawain</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Hal. Pagpapatubig sa Palayan"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholderTextColor={BrandColors.mutedText}
            />

            <Text style={styles.inputLabel}>Kategorya ng Gawain</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: Spacing.sm }}>
              {(['irrigation', 'fertilizer', 'planting', 'traditional_lunar'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewEventType(t)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    borderRadius: BorderRadius.sm,
                    backgroundColor: newEventType === t ? BrandColors.tealGreen : '#F1F5F9',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: newEventType === t ? BrandColors.white : BrandColors.slate,
                    }}>
                    {t === 'irrigation' ? 'Patubig' : t === 'fertilizer' ? 'Abono' : t === 'planting' ? 'Tanim' : 'Buwan'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Detalye / Tala</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              placeholder="Ilarawan ang gagawin o obserbasyon..."
              multiline
              value={newEventDesc}
              onChangeText={setNewEventDesc}
              placeholderTextColor={BrandColors.mutedText}
            />

            <View style={styles.modalButtons}>
              <BrandButton
                title="Kanselahin"
                onPress={() => setIsAddModalVisible(false)}
                variant="ghost"
                style={{ flex: 1 }}
              />
              <BrandButton
                title="I-save sa Kalendaryo"
                onPress={handleSaveEvent}
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
  emptyEventsCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  emptyEventsText: {
    color: Glass.mutedText,
    fontSize: 12,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  googleSyncCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  googleSyncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  googleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Glass.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleSyncTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Glass.text,
  },
  googleSyncSubtitle: {
    fontSize: 11,
    color: Glass.mutedText,
    marginTop: 2,
    lineHeight: 15,
  },
  monthPlanner: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  monthToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 8,
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Glass.surfaceSoft,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  todayButtonText: { color: Glass.text, fontSize: 11, fontWeight: '800' },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthNavButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Glass.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: { color: Glass.text, fontSize: 13, fontWeight: '800', minWidth: 122, textAlign: 'center' },
  weekdayRow: { flexDirection: 'row', marginBottom: 4 },
  weekdayLabel: {
    width: `${100 / 7}%`,
    color: Glass.mutedText,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell: {
    width: `${100 / 7}%`,
    minHeight: 64,
    paddingHorizontal: 3,
    paddingTop: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  monthCellMuted: { backgroundColor: 'rgba(0,0,0,0.12)' },
  monthCellSelected: { backgroundColor: 'rgba(163, 230, 53, 0.16)' },
  monthDayNumber: {
    color: Glass.text,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  monthDayNumberMuted: { color: 'rgba(255,255,255,0.35)' },
  todayNumber: {
    color: '#14291E',
    backgroundColor: BrandColors.goldenYellow,
    alignSelf: 'center',
    minWidth: 21,
    paddingVertical: 2,
    borderRadius: 11,
  },
  monthEvents: { gap: 2, marginTop: 4 },
  monthEventPill: {
    backgroundColor: 'rgba(163, 230, 53, 0.18)',
    borderLeftWidth: 2,
    borderLeftColor: BrandColors.goldenYellow,
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  monthEventPillCompleted: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderLeftColor: 'rgba(255,255,255,0.45)',
  },
  monthEventText: { color: Glass.text, fontSize: 7.5, fontWeight: '700' },
  monthEventTextCompleted: { color: Glass.mutedText, textDecorationLine: 'line-through' },
  moreEventsText: { color: Glass.mutedText, fontSize: 7.5, fontWeight: '700', paddingLeft: 3 },
  cropStageCard: {
    backgroundColor: Glass.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stageTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#A3E635',
  },
  stageDesc: {
    fontSize: 11.5,
    color: Glass.mutedText,
    lineHeight: 16,
  },
  eventsSection: {
    marginTop: Spacing.xs,
  },
  eventsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
  },
  addText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A3E635',
  },
  eventCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  eventCardCompleted: { backgroundColor: 'rgba(18, 38, 28, 0.55)' },
  eventLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  eventIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Glass.text,
    flex: 1,
  },
  eventTitleCompleted: { color: Glass.mutedText, textDecorationLine: 'line-through' },
  eventTime: {
    fontSize: 11,
    fontWeight: '700',
    color: Glass.mutedText,
    marginLeft: 6,
  },
  eventDesc: {
    fontSize: 12,
    color: Glass.mutedText,
    lineHeight: 16,
    marginVertical: 4,
  },
  eventStage: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.tealGreenDark,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Glass.border,
  },
  eventDateBadge: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Glass.mutedText,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Glass.border,
    backgroundColor: Glass.surfaceSoft,
  },
  completeButtonDone: { backgroundColor: BrandColors.goldenYellow, borderColor: BrandColors.goldenYellow },
  completeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Glass.text,
  },
  completeButtonTextDone: { color: '#14291E' },
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
