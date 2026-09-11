import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BrandColors, BorderRadius } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';

export type StatusType = 'normal' | 'optimal' | 'warning' | 'critical' | 'info' | 'active' | 'sms';

interface StatusBadgeProps {
  label: string;
  type?: StatusType;
  icon?: IconSymbolName;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export function StatusBadge({ label, type = 'normal', icon, style, size = 'md' }: StatusBadgeProps) {
  const getColors = () => {
    switch (type) {
      case 'optimal':
      case 'active':
        return { bg: BrandColors.tealGreenLight, text: BrandColors.tealGreenDark, dot: BrandColors.tealGreen };
      case 'warning':
        return { bg: BrandColors.goldenYellowLight, text: BrandColors.goldenYellowDark, dot: BrandColors.goldenYellow };
      case 'critical':
        return { bg: BrandColors.dangerLight, text: BrandColors.danger, dot: BrandColors.danger };
      case 'info':
        return { bg: BrandColors.primaryBlueLight, text: BrandColors.primaryBlueDark, dot: BrandColors.primaryBlue };
      case 'sms':
        return { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      default:
        return { bg: '#F1F5F9', text: BrandColors.slate, dot: BrandColors.slate };
    }
  };

  const colors = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 10,
        },
        style,
      ]}>
      {icon ? (
        <IconSymbol name={icon} size={isSmall ? 12 : 14} color={colors.text} style={{ marginRight: 4 }} />
      ) : (
        <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      )}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
