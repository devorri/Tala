import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Animated } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { StatusBadge, StatusType } from '@/components/ui/StatusBadge';

interface SensorCardProps {
  title: string;
  tagalogSubtitle?: string;
  value: string | number;
  unit: string;
  icon: IconSymbolName;
  themeColor?: 'blue' | 'teal' | 'yellow' | 'danger';
  statusLabel: string;
  statusType: StatusType;
  progressPercent?: number; // 0 to 100
  secondaryText?: string;
  onPress?: () => void;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function SensorCard({
  title,
  tagalogSubtitle,
  value,
  unit,
  icon,
  themeColor = 'blue',
  statusLabel,
  statusType,
  progressPercent,
  secondaryText,
  onPress,
  style,
  fullWidth = false,
}: SensorCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const getAccentColor = () => {
    switch (themeColor) {
      case 'teal':
        return BrandColors.tealGreen;
      case 'yellow':
        return BrandColors.goldenYellowDark;
      case 'danger':
        return BrandColors.danger;
      case 'blue':
      default:
        return BrandColors.primaryBlue;
    }
  };

  const getLightAccent = () => {
    switch (themeColor) {
      case 'teal':
        return BrandColors.tealGreenLight;
      case 'yellow':
        return BrandColors.goldenYellowLight;
      case 'danger':
        return BrandColors.dangerLight;
      case 'blue':
      default:
        return BrandColors.primaryBlueLight;
    }
  };

  const accentColor = getAccentColor();
  const lightAccent = getLightAccent();

  return (
    <Animated.View
      style={[
        {
          width: fullWidth ? '100%' : '48%',
          transform: [{ scale: scaleAnim }],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, Shadows.subtle, style]}>
        {/* Top Icon & Status Pill */}
        <View style={styles.topRow}>
          <View style={[styles.iconWrapper, { backgroundColor: lightAccent }]}>
            <IconSymbol name={icon} size={18} color={accentColor} />
          </View>
          <StatusBadge label={statusLabel} type={statusType} size="sm" />
        </View>

        {/* Metric Titles */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {tagalogSubtitle && <Text style={styles.tagalogSubtitle}>{tagalogSubtitle}</Text>}
        </View>

        {/* Large Readable Value */}
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>

        {/* Progress Bar Meter */}
        {progressPercent !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                    backgroundColor: accentColor,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Secondary Info */}
        {secondaryText && <Text style={styles.secondaryText}>{secondaryText}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    marginBottom: 2,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Glass.mutedText,
    letterSpacing: -0.2,
  },
  tagalogSubtitle: {
    fontSize: 9.5,
    fontWeight: '600',
    color: Glass.mutedText,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    color: Glass.text,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 12,
    fontWeight: '700',
    color: Glass.mutedText,
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
  secondaryText: {
    fontSize: 10.5,
    color: BrandColors.slate,
    marginTop: 6,
    fontWeight: '500',
  },
});
