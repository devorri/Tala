import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { BrandColors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightActionIcon?: IconSymbolName;
  onRightAction?: () => void;
  badgeCount?: number;
  gradientVariant?: 'summerVibe' | 'blueToTeal' | 'tealToYellow';
}

export function GradientHeader({
  title,
  subtitle,
  showBack = false,
  showLogo = true,
  rightActionIcon,
  onRightAction,
  badgeCount,
  gradientVariant = 'summerVibe',
}: GradientHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
              activeOpacity={0.7}>
              <IconSymbol name="arrow.back" size={24} color={BrandColors.white} />
            </TouchableOpacity>
          ) : showLogo ? (
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/TALA-logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.brandSubtitle}>PROJECT SEMINA</Text>
                <Text style={styles.brandTitle}>TALA</Text>
              </View>
            </View>
          ) : (
            <View style={{ width: 24 }} />
          )}

          {rightActionIcon ? (
            <TouchableOpacity
              onPress={onRightAction}
              style={styles.iconButton}
              activeOpacity={0.7}>
              <IconSymbol name={rightActionIcon} size={24} color={BrandColors.white} />
              {badgeCount !== undefined && badgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // The shared FarmScreen owns the device inset; this is visual spacing only.
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(18, 38, 28, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    ...Shadows.medium,
  },
  content: {
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.white,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A3E635',
    letterSpacing: 0.8,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: BrandColors.white,
    letterSpacing: 1,
    lineHeight: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#A3E635',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#1C3829',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1C3829',
  },
  titleSection: {
    marginTop: Spacing.xs,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: '500',
    marginTop: 2,
  },
});
