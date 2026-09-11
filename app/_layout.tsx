import React, { useEffect } from 'react';
import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppContext';
import { BrandColors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent auto-hiding splash until fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: BrandColors.tealGreen,
      background: '#08140E',
      card: '#12261C',
      text: BrandColors.white,
      border: 'rgba(255,255,255,0.14)',
    },
  };

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemeProvider value={customTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="weather"
            options={{
              presentation: 'card',
              title: 'Weather & Climate',
            }}
          />
          <Stack.Screen
            name="growth-tracker"
            options={{
              presentation: 'card',
              title: 'Growth Tracker',
            }}
          />
          <Stack.Screen
            name="records"
            options={{
              presentation: 'card',
              title: 'Digital Records',
            }}
          />
          <Stack.Screen
            name="ai-assistant"
            options={{
              presentation: 'card',
              title: 'AI Assistant',
            }}
          />
          <Stack.Screen
            name="pollinators"
            options={{
              presentation: 'card',
              title: 'Pollinator Corner',
            }}
          />
          <Stack.Screen
            name="system-controls"
            options={{ presentation: 'card', title: 'SMS Control Panel' }}
          />
          <Stack.Screen
            name="reports"
            options={{ presentation: 'card', title: 'Farm Reports' }}
          />
          <Stack.Screen
            name="knowledge-controls"
            options={{ presentation: 'card', title: 'Knowledge Post Control' }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Impormasyon',
            }}
          />
        </Stack>
        <StatusBar style="light" />
        </ThemeProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
