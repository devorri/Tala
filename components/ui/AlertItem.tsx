import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AlertItemData } from '@/services/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BrandButton } from '@/components/ui/BrandButton';

interface AlertItemProps {
  alert: AlertItemData;
  onExecuteAction?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function AlertItem({ alert, onExecuteAction, onDismiss }: AlertItemProps) {
  const getSeverityColors = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          border: BrandColors.danger,
          bg: '#FEF2F2',
          icon: 'error' as IconSymbolName,
          iconColor: BrandColors.danger,
        };
      case 'warning':
        return {
          border: BrandColors.goldenYellow,
          bg: '#FFFBEB',
          icon: 'warning' as IconSymbolName,
          iconColor: BrandColors.goldenYellowDark,
        };
      case 'info':
      default:
        return {
          border: BrandColors.primaryBlue,
          bg: '#F0F9FF',
          icon: 'info' as IconSymbolName,
          iconColor: BrandColors.primaryBlue,
        };
    }
  };

  const colors = getSeverityColors();

  return (
    <View style={[styles.card, { borderLeftColor: colors.border }, Shadows.subtle]}>
      <View style={styles.header}>
        <View style={styles.iconTitleRow}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.bg }]}>
            <IconSymbol name={colors.icon} size={20} color={colors.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{alert.title}</Text>
            {alert.tagalogTitle && <Text style={styles.tagalogTitle}>{alert.tagalogTitle}</Text>}
          </View>
        </View>
        {onDismiss && (
          <TouchableOpacity
            onPress={() => onDismiss(alert.id)}
            style={styles.closeButton}
            activeOpacity={0.7}>
            <IconSymbol name="close" size={16} color={BrandColors.slate} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      {/* SMS Fallback Notice */}
      {alert.smsFallbackTriggered && (
        <View style={styles.smsNotice}>
          <IconSymbol name="sms" size={14} color="#B45309" />
          <Text style={styles.smsText}>
            SMS Fallback: {alert.smsRecipient || 'Naipadala sa SMS Gateway (Offline mode)'}
          </Text>
        </View>
      )}

      {/* Footer Info & Actions */}
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{alert.timestamp}</Text>

        {alert.actionRequired && (
          <View style={styles.actionSection}>
            {alert.actionDone ? (
              <StatusBadge label="Naisagawa Na" type="optimal" icon="check.circle" size="sm" />
            ) : (
              <BrandButton
                title={alert.actionRequired}
                onPress={() => onExecuteAction?.(alert.id)}
                size="sm"
                variant={alert.severity === 'critical' ? 'danger' : 'yellow'}
                icon="sprout"
              />
            )}
          </View>
        )}
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
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
    letterSpacing: -0.2,
  },
  tagalogTitle: {
    fontSize: 11,
    color: Glass.mutedText,
    fontWeight: '600',
    marginTop: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 6,
  },
  description: {
    fontSize: 12.5,
    color: Glass.text,
    lineHeight: 18,
    marginVertical: Spacing.xs,
  },
  smsNotice: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.xs,
  },
  smsText: {
    fontSize: 10.5,
    color: '#92400E',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Glass.border,
  },
  timestamp: {
    fontSize: 11,
    color: Glass.mutedText,
    fontWeight: '500',
  },
  actionSection: {
    marginLeft: 'auto',
  },
});
