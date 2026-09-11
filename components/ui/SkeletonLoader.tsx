import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { BrandColors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.xs,
  style,
}: SkeletonBoxProps) {
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeletonBox,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

export function SkeletonSensorCard({ width = '48%' }: { width?: DimensionValue }) {
  return (
    <View style={[styles.sensorCardSkeleton, { width }, Shadows.subtle]}>
      <View style={styles.rowBetween}>
        <SkeletonBox width={36} height={36} borderRadius={18} />
        <SkeletonBox width={54} height={18} borderRadius={9} />
      </View>
      <SkeletonBox width="60%" height={12} style={{ marginTop: 12 }} />
      <SkeletonBox width="40%" height={10} style={{ marginTop: 4 }} />
      <View style={styles.valueRow}>
        <SkeletonBox width="45%" height={26} borderRadius={6} />
        <SkeletonBox width={20} height={14} style={{ marginLeft: 6 }} />
      </View>
      <SkeletonBox width="100%" height={6} borderRadius={3} style={{ marginTop: 8 }} />
      <SkeletonBox width="75%" height={10} style={{ marginTop: 8 }} />
    </View>
  );
}

export function SkeletonSensorGrid() {
  return (
    <View style={styles.gridRow}>
      <SkeletonSensorCard />
      <SkeletonSensorCard />
      <SkeletonSensorCard />
      <SkeletonSensorCard />
    </View>
  );
}

export function SkeletonAlertItem() {
  return (
    <View style={[styles.alertSkeleton, Shadows.subtle]}>
      <View style={styles.rowBetween}>
        <View style={styles.iconTitleRow}>
          <SkeletonBox width={32} height={32} borderRadius={16} />
          <View style={{ flex: 1, gap: 4 }}>
            <SkeletonBox width="80%" height={14} />
            <SkeletonBox width="50%" height={10} />
          </View>
        </View>
      </View>
      <SkeletonBox width="100%" height={12} style={{ marginTop: 10 }} />
      <SkeletonBox width="90%" height={12} style={{ marginTop: 4 }} />
      <View style={styles.alertFooter}>
        <SkeletonBox width={60} height={10} />
        <SkeletonBox width={110} height={28} borderRadius={8} />
      </View>
    </View>
  );
}

export function SkeletonArticleCard() {
  return (
    <View style={[styles.articleSkeleton, Shadows.subtle]}>
      <View style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <SkeletonBox width={32} height={32} borderRadius={16} />
          <View style={{ flex: 1, gap: 4 }}>
            <SkeletonBox width="60%" height={12} />
            <SkeletonBox width="40%" height={10} />
          </View>
        </View>
        <SkeletonBox width={20} height={20} borderRadius={10} />
      </View>
      <SkeletonBox width="85%" height={16} style={{ marginTop: 12 }} />
      <SkeletonBox width="55%" height={12} style={{ marginTop: 4 }} />
      <SkeletonBox width="100%" height={12} style={{ marginTop: 8 }} />
      <SkeletonBox width="92%" height={12} style={{ marginTop: 4 }} />
      <View style={styles.tagsRow}>
        <SkeletonBox width={50} height={20} borderRadius={10} />
        <SkeletonBox width={65} height={20} borderRadius={10} />
        <SkeletonBox width={55} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

export function SkeletonWeatherCard() {
  return (
    <View style={[styles.weatherSkeleton, Shadows.subtle]}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width={70} height={32} borderRadius={8} />
          <SkeletonBox width="70%" height={14} />
          <SkeletonBox width="50%" height={10} />
        </View>
        <SkeletonBox width={56} height={56} borderRadius={28} />
      </View>
      <View style={styles.metricsRow}>
        <SkeletonBox width={45} height={36} borderRadius={8} />
        <SkeletonBox width={45} height={36} borderRadius={8} />
        <SkeletonBox width={45} height={36} borderRadius={8} />
        <SkeletonBox width={45} height={36} borderRadius={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBox: {
    backgroundColor: '#E2E8F0',
  },
  sensorCardSkeleton: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  alertSkeleton: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderLeftWidth: 4,
    borderLeftColor: '#CBD5E1',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  articleSkeleton: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  weatherSkeleton: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
