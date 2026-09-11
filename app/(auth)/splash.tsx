import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SPLASH_BG = require('@/assets/images/home-bg2.jpg');

export default function SplashScreen() {
  const router = useRouter();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [entrance]);

  return (
    <ImageBackground source={SPLASH_BG} style={styles.background} resizeMode="cover">
      <View style={styles.darkOverlay} />
      <View style={styles.bottomShade} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><IconSymbol name="sprout" size={17} color="#A3E635" /></View>
          <Text style={styles.brandName}>TALA</Text>
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: entrance,
              transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
            },
          ]}>
          <Text style={styles.eyebrow}>SMART AGRICULTURE · PROJECT SEMINA</Text>
          <Text style={styles.headline}>YOUR FARM,{`\n`}SMARTER.</Text>
          <Text style={styles.description}>
            Monitor crop health, optimize resources, and grow with data-driven farm insights.
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.86}>
            <View style={styles.arrowCircle}><IconSymbol name="arrow.back" size={19} color="#FFFFFF" style={styles.forwardArrow} /></View>
            <Text style={styles.startText}>Get Started</Text>
            <Text style={styles.chevrons}>››</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink} activeOpacity={0.75}>
            <Text style={styles.loginText}>May account na? Mag-login</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#0A1B11' },
  darkOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 20, 10, 0.22)' },
  bottomShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  safeArea: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 10, paddingBottom: 22 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(11, 35, 18, 0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  brandName: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { paddingTop: 70 },
  eyebrow: { color: '#D9F99D', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  headline: { color: '#FFFFFF', fontSize: 37, lineHeight: 38, fontWeight: '900', letterSpacing: -0.9 },
  description: { color: 'rgba(255,255,255,0.93)', maxWidth: 275, fontSize: 12, lineHeight: 18, marginTop: 13, marginBottom: 22 },
  startButton: { height: 56, borderRadius: 28, backgroundColor: '#9ADD43', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)' },
  arrowCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#183B25' },
  forwardArrow: { transform: [{ rotate: '180deg' }] },
  startText: { flex: 1, color: '#15351F', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  chevrons: { color: '#578B32', fontSize: 27, fontWeight: '500', lineHeight: 28, letterSpacing: -4, paddingRight: 8 },
  loginLink: { alignSelf: 'center', paddingTop: 14, paddingBottom: 2 },
  loginText: { color: 'rgba(255,255,255,0.86)', fontSize: 11.5, fontWeight: '700', textDecorationLine: 'underline' },
});
