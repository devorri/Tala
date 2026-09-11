import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const farmBackground = require('@/assets/images/home-bg2.jpg');

interface FarmScreenProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/** Shared atmospheric canvas used by every in-app screen. */
export function FarmScreen({ children, style }: FarmScreenProps) {
  return (
    <ImageBackground source={farmBackground} resizeMode="cover" style={styles.background}>
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={[styles.content, style]} edges={['top', 'right', 'bottom', 'left']}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#08140E' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(8, 20, 14, 0.72)' },
  content: { flex: 1 },
});
