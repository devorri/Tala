import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
  variant?: 'panel' | 'subcard' | 'pill';
}

export function GlassCard({
  children,
  style,
  intensity = 45,
  tint = 'dark',
  variant = 'panel',
}: GlassCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'subcard':
        return styles.subcard;
      case 'pill':
        return styles.pill;
      case 'panel':
      default:
        return styles.panel;
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={intensity}
          tint={tint}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={styles.webBackdrop} />
      )}
      <View style={styles.innerContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  panel: {
    borderRadius: 24,
    backgroundColor: 'rgba(18, 38, 28, 0.72)', // Frosted dark forest glass
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  subcard: {
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.28)', // Darker inner glass shelf
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pill: {
    borderRadius: 30,
    backgroundColor: 'rgba(18, 38, 28, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  webBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18, 38, 28, 0.75)',
    // @ts-ignore
    backdropFilter: 'blur(20px)',
  },
  innerContent: {
    position: 'relative',
    zIndex: 1,
  },
});
