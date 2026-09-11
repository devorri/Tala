import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandButton } from '@/components/ui/BrandButton';

interface ControlToggleProps {
  status: 'ACTIVE' | 'IDLE' | 'SCHEDULED' | 'PULSING';
  mode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF';
  onToggleStatus: () => void;
  onChangeMode: (newMode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF') => void;
  systemName?: string;
  tagalogName?: string;
}

export function ControlToggle({
  status,
  mode,
  onToggleStatus,
  onChangeMode,
  systemName = 'Smart Irrigation Valve',
  tagalogName = 'Pangunahing Patubig sa Palayan',
}: ControlToggleProps) {
  const [showUndoNotice, setShowUndoNotice] = useState(false);
  const isActive = status === 'ACTIVE';

  const handleAction = () => {
    onToggleStatus();
    setShowUndoNotice(true);
    setTimeout(() => {
      setShowUndoNotice(false);
    }, 5000);
  };

  const handleModeSwitch = () => {
    const nextMode = mode === 'AUTO' ? 'MANUAL' : 'AUTO';
    onChangeMode(nextMode);
  };

  return (
    <View style={[styles.container, Shadows.medium]}>
      {/* Farmer Control Header */}
      <View style={styles.topBanner}>
        <View style={styles.badgeRow}>
          <IconSymbol name="leaf" size={14} color={BrandColors.tealGreenDark} />
          <Text style={styles.badgeText}>FARMER-FIRST CONTROL • IKAW ANG MAY PASIYA</Text>
        </View>
        <TouchableOpacity
          onPress={handleModeSwitch}
          activeOpacity={0.7}
          style={[
            styles.modePill,
            {
              backgroundColor:
                mode === 'AUTO' ? BrandColors.primaryBlueLight : BrandColors.goldenYellowLight,
            },
          ]}>
          <Text
            style={[
              styles.modePillText,
              {
                color:
                  mode === 'AUTO' ? BrandColors.primaryBlueDark : BrandColors.goldenYellowDark,
              },
            ]}>
            {mode === 'AUTO' ? 'MODE: SMART AUTO' : 'MODE: MANUAL OVERRIDE'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={[styles.statusIndicator, { backgroundColor: isActive ? BrandColors.tealGreen : BrandColors.slate }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.systemName}>{systemName}</Text>
            <Text style={styles.tagalogName}>{tagalogName}</Text>
          </View>
          <View
            style={[
              styles.stateBadge,
              {
                backgroundColor: isActive ? BrandColors.tealGreenLight : '#F1F5F9',
              },
            ]}>
            <Text
              style={[
                styles.stateBadgeText,
                {
                  color: isActive ? BrandColors.tealGreenDark : BrandColors.slate,
                },
              ]}>
              {isActive ? 'BUMUBUKAS (ACTIVE)' : 'SARADO (IDLE)'}
            </Text>
          </View>
        </View>

        <Text style={styles.advisoryText}>
          {isActive
            ? 'Kasalukuyang nagpapadaloy ng 150L/min patubig. Maaari mong ihinto anumang sandali.'
            : mode === 'AUTO'
            ? 'SEMINA AWD Algorithm: Naka-antabay sa 40% soil moisture bago magkusa. Ikaw ay palaging may opsyon na magbukas ngayon.'
            : 'Manual Mode: Naka-hold ang automated schedule. Pindutin ang buton sa ibaba upang magpatubig.'}
        </Text>

        {/* Action Button */}
        <View style={styles.buttonRow}>
          <BrandButton
            title={isActive ? 'Ihinto ang Patubig (Stop / Close)' : 'Buksan ang Patubig (Open Valve)'}
            onPress={handleAction}
            variant={isActive ? 'danger' : 'primary'}
            icon={isActive ? 'pause' : 'water.drop'}
            fullWidth
            size="md"
          />
        </View>

        {/* Reversibility Banner */}
        {showUndoNotice && (
          <View style={styles.undoContainer}>
            <Text style={styles.undoText}>
              {isActive ? 'Nagsimula ang patubig.' : 'Naisara ang balbula.'}
            </Text>
            <TouchableOpacity onPress={handleAction} activeOpacity={0.7}>
              <Text style={styles.undoButton}>PAWALANG-BISA (UNDO)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topBanner: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    letterSpacing: 0.5,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  modePillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  body: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  systemName: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
  },
  tagalogName: {
    fontSize: 11,
    color: Glass.mutedText,
    fontWeight: '500',
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  stateBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  advisoryText: {
    fontSize: 12,
    color: Glass.mutedText,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  buttonRow: {
    marginTop: 2,
  },
  undoContainer: {
    marginTop: Spacing.sm,
    backgroundColor: BrandColors.goldenYellowLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  undoText: {
    fontSize: 11.5,
    color: Glass.text,
    fontWeight: '600',
  },
  undoButton: {
    fontSize: 11.5,
    fontWeight: '900',
    color: BrandColors.primaryBlueDark,
    textDecorationLine: 'underline',
  },
});
