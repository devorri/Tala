import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';

export default function TabLayout() {
  const { unreadAlertsCount } = useApp();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A3E635', // Lime accent
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.55)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={20} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarBadge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: 9,
          },
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.scannerButton,
                focused && styles.scannerButtonActive,
              ]}>
              <IconSymbol
                size={22}
                name="doc.text.viewfinder"
                color={focused ? '#1C3829' : '#1C3829'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.select({ ios: 24, android: 16, default: 16 }),
    left: 24,
    right: 24,
    height: 64,
    borderRadius: 30,
    backgroundColor: '#1C3829', // Dark Forest Green Frosted Pill Bar
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  tabBarItem: {
    paddingVertical: 1,
  },
  scannerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#A3E635', // Vibrant Lime Pill Button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
  },
  scannerButtonActive: {
    backgroundColor: '#BEF264',
    transform: [{ scale: 1.05 }],
  },
});
