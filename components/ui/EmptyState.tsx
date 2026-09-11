import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors, Glass, Spacing } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { BrandButton } from '@/components/ui/BrandButton';

interface EmptyStateProps {
  icon?: IconSymbolName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'sprout',
  title,
  description,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <IconSymbol name={icon} size={32} color={BrandColors.tealGreen} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <BrandButton
          title={actionTitle}
          onPress={onAction}
          variant="teal"
          size="sm"
          style={{ marginTop: Spacing.md }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BrandColors.tealGreenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Glass.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Glass.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
});
