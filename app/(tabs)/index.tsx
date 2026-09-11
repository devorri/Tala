import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { GlassCard } from '@/components/ui/GlassCard';

export const HOME_BG_IMAGE = require('@/assets/images/home-bg2.jpg');

export default function HomeScreen() {
  const router = useRouter();
  const {
    sensorData,
    refreshSensors,
    isRefreshing,
    isSupabaseConnected,
    toggleIrrigation,
    alerts,
    unreadAlertsCount,
    farmerProfile,
    weatherData,
    farmLocation,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'paddy' | 'alerts'>('all');

  const categories = [
    { key: 'all', label: 'Lahat' },
    { key: 'paddy', label: 'Palayan' },
    { key: 'alerts', label: `Alerto (${unreadAlertsCount})` },
  ];

  const topAlert = alerts.find((a) => !a.actionDone);

  const quickAccess: { title: string; icon: IconSymbolName; route: any }[] = [
    { title: 'Voice AI', icon: 'mic', route: '/ai-assistant' },
    { title: 'Knowledge', icon: 'book.fill', route: '/(tabs)/knowledge' },
    { title: 'Reports', icon: 'analytics', route: '/reports' },
    { title: 'Calendar', icon: 'calendar', route: '/(tabs)/calendar' },
  ];

  const shortcutModules: {
    title: string;
    sub: string;
    icon: IconSymbolName;
    route?: any;
  }[] = [
    {
      title: 'AI Crop Disease Scanner',
      sub: 'Kunan ng larawan ang dahon para sa mabilisang pagsusuri',
      icon: 'doc.text.viewfinder',
      route: '/(tabs)/scanner',
    },
    {
      title: 'pH Sensor',
      sub: `Current pH: ${sensorData.hydroponics.pH.toFixed(2)}`,
      icon: 'chemistry',
    },
    {
      title: 'Growth Tracker & Kalendaryo',
      sub: 'Talaan ng yugto (Day 28) at kalusugan ng palay',
      icon: 'sprout',
      route: '/growth-tracker',
    },
    {
      title: 'Digital Records & AWD Logs',
      sub: 'Kasaysayan ng patubig at water conservation savings',
      icon: 'analytics',
      route: '/records',
    },
  ];

  return (
    <ImageBackground
      source={HOME_BG_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshSensors}
            tintColor="#A3E635"
          />
        }
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {farmerProfile.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.greetingSub}>Maligayang pagbabalik!</Text>
              <Text style={styles.userName}>{farmerProfile.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/(tabs)/alerts')}
            activeOpacity={0.7}
          >
            <IconSymbol name="bell.fill" size={18} color="#FFFFFF" />
            {unreadAlertsCount > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeDotText}>{unreadAlertsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Glassmorphism Panel (LibraSmart Style) */}
        <GlassCard variant="panel" style={styles.heroGlassPanel}>
          <View style={styles.panelHeaderRow}>
            <View style={styles.badgeTag}>
              <Text style={styles.badgeTagText}>PROJECT SEMINA • SMART AGRI NODE</Text>
            </View>
            <View style={styles.solarBadge}>
              <IconSymbol name="sun.max" size={12} color="#FACC15" />
              <Text style={styles.solarText}>{sensorData.solarBattery}% Solar</Text>
            </View>
          </View>

          <View style={styles.heroMainRow}>
            <View style={styles.heroTextSection}>
              <Text style={styles.heroTitle}>TALA Smart Agriculture</Text>
              <Text style={styles.heroDescription}>
                Automated AWD pulse irrigation, microclimate monitoring, at AI crop disease detection para sa palayan.
              </Text>

              {/* Action Buttons Row */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={[
                    styles.primaryActionBtn,
                    sensorData.irrigationStatus === 'ACTIVE' && styles.primaryActionBtnActive,
                  ]}
                  onPress={() => toggleIrrigation()}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="water.drop" size={16} color="#0F172A" />
                  <Text style={styles.primaryActionBtnText}>
                    {sensorData.irrigationStatus === 'ACTIVE' ? 'Patubig: Bukas' : 'Buksan ang Gate'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.glassActionBtn}
                  onPress={() => router.push('/(tabs)/scanner')}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="doc.text.viewfinder" size={16} color="#FFFFFF" />
                  <Text style={styles.glassActionBtnText}>I-scan ang Palay</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Sub-Card: Live Status */}
            <TouchableOpacity
              style={{ alignSelf: 'stretch' }}
              onPress={() => router.push('/weather')}
              activeOpacity={0.85}
            >
              <GlassCard variant="subcard" style={styles.heroRightSubCard}>
                <View style={styles.subCardTop}>
                  <Text style={styles.subCardLabel}>PANAHON</Text>
                  <IconSymbol
                    name={(weatherData?.icon as IconSymbolName) || 'sun.max'}
                    size={24}
                    color="#FACC15"
                  />
                </View>
                <Text style={styles.subCardTemp}>
                  {weatherData ? `${weatherData.temperature}°C` : `${sensorData.temperature}°C`}
                </Text>
                <Text style={styles.subCardCondition} numberOfLines={1}>
                  {weatherData?.conditionTagalog ?? 'Maaraw na may Ulap'}
                </Text>
                <Text style={styles.subCardLocation} numberOfLines={1}>
                  📍 {farmLocation.label.split(',')[0]}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* Bottom 4-Column Stats Row */}
          <View style={styles.bottomStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{sensorData.waterLevel}%</Text>
              <Text style={styles.statLabel}>Tubig sa Paddy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{sensorData.soilMoisture}%</Text>
              <Text style={styles.statLabel}>Moisture ng Lupa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>94%</Text>
              <Text style={styles.statLabel}>Kalusugan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>10%</Text>
              <Text style={styles.statLabel}>Banta ng Peste</Text>
            </View>
          </View>
        </GlassCard>

        {/* Always-visible paths to the newer SEMINA screens */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAccessStrip}>
          {quickAccess.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.quickAccessCard}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}>
              <View style={styles.quickAccessIcon}>
                <IconSymbol name={item.icon} size={18} color="#A3E635" />
              </View>
              <Text style={styles.quickAccessText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryStrip}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.key as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Smart Alert Banner */}
        {topAlert && (activeCategory === 'all' || activeCategory === 'alerts') && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => router.push('/(tabs)/alerts')}
            activeOpacity={0.85}
          >
            <View style={styles.alertBannerHeader}>
              <IconSymbol name="warning" size={16} color="#F59E0B" />
              <Text style={styles.alertBannerTitle} numberOfLines={1}>
                {topAlert.title}
              </Text>
            </View>
            <Text style={styles.alertBannerDesc} numberOfLines={2}>
              {topAlert.description}
            </Text>
          </TouchableOpacity>
        )}

        {/* Live sensor telemetry from the latest sensor_logs row */}
        {(activeCategory === 'all' || activeCategory === 'paddy') && (
          <View style={styles.telemetrySection}>
            <View style={styles.telemetryHeader}>
              <Text style={styles.sectionTitle}>Sensor Logs</Text>
              <View style={styles.telemetryStatus}>
                <View style={[
                  styles.telemetryStatusDot,
                  isSupabaseConnected ? styles.telemetryStatusDotOnline : styles.telemetryStatusDotOffline,
                ]} />
                <Text style={styles.telemetryStatusText} numberOfLines={1}>
                  {isSupabaseConnected ? sensorData.lastUpdated : 'Waiting for sensor data'}
                </Text>
              </View>
            </View>

            <View style={styles.grid2x2}>
              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>water_level</Text>
                  <IconSymbol name="water.drop" size={18} color="#38BDF8" />
                </View>
                <Text style={styles.gridCardVal}>{sensorData.waterLevel}%</Text>
                <Text style={styles.gridCardSub}>AWD Target: 70-85%</Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>ph_value</Text>
                  <IconSymbol name="chemistry" size={18} color="#A3E635" />
                </View>
                <Text style={styles.gridCardVal}>{sensorData.hydroponics.pH.toFixed(2)}</Text>
                <Text style={styles.gridCardSub}>
                  {sensorData.hydroponics.pHStatus === 'optimal' ? 'Optimal range' : sensorData.hydroponics.pHStatus}
                </Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>soil_moisture</Text>
                  <IconSymbol name="soil.moisture" size={18} color="#4ADE80" />
                </View>
                <Text style={styles.gridCardVal}>{sensorData.soilMoisture}%</Text>
                <Text style={styles.gridCardSub}>Latest sensor reading</Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>pump_status</Text>
                  <IconSymbol name="water.drop" size={18} color="#38BDF8" />
                </View>
                <Text style={styles.gridCardVal}>
                  {sensorData.irrigationStatus === 'ACTIVE' ? 'ON' : 'OFF'}
                </Text>
                <Text style={styles.gridCardSub}>Latest sensor reading</Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>temperature</Text>
                  <IconSymbol name="thermostat" size={18} color="#FB923C" />
                </View>
                <Text style={styles.gridCardVal}>{sensorData.temperature.toFixed(1)}°C</Text>
                <Text style={styles.gridCardSub}>Latest sensor reading</Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>humidity</Text>
                  <IconSymbol name="humidity" size={18} color="#60A5FA" />
                </View>
                <Text style={styles.gridCardVal}>{sensorData.humidity.toFixed(0)}%</Text>
                <Text style={styles.gridCardSub}>Latest sensor reading</Text>
              </GlassCard>
            </View>
          </View>
        )}

        {/* Smart Modules Hub */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Mga Matalinong Serbisyo</Text>
          
          <View style={styles.moduleGrid}>
            {shortcutModules.map((m, idx) => {
              const card = (
                <GlassCard variant="subcard" style={styles.moduleCard}>
                  <View style={styles.moduleIconWrapper}>
                    <IconSymbol name={m.icon} size={20} color="#A3E635" />
                  </View>
                  <Text style={styles.moduleTitle}>{m.title}</Text>
                  <Text style={styles.moduleSub} numberOfLines={2}>
                    {m.sub}
                  </Text>
                </GlassCard>
              );

              return m.route ? (
                <TouchableOpacity
                  key={idx}
                  style={{ width: '48%' }}
                  onPress={() => router.push(m.route)}
                  activeOpacity={0.8}
                >
                  {card}
                </TouchableOpacity>
              ) : (
                <View key={idx} style={{ width: '48%' }}>
                  {card}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 20, 14, 0.45)', // Atmospheric dark tint
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 90, // Leave room for floating tab bar
  },
  quickAccessStrip: {
    gap: 10,
    paddingBottom: 14,
  },
  quickAccessCard: {
    minWidth: 105,
    backgroundColor: 'rgba(18, 38, 28, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 6,
  },
  quickAccessIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#A3E635',
    fontWeight: '800',
    fontSize: 14,
  },
  greetingSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  heroGlassPanel: {
    padding: 20,
    marginBottom: 20,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  badgeTagText: {
    color: '#FACC15',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  solarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  solarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroMainRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroTextSection: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  heroDescription: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 14,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#A3E635', // Vibrant Lime Pill
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  primaryActionBtnActive: {
    backgroundColor: '#38BDF8',
  },
  primaryActionBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  glassActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroRightSubCard: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
  },
  subCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  subCardTemp: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subCardCondition: {
    fontSize: 10.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  subCardLocation: {
    fontSize: 9,
    color: '#A3E635',
    marginTop: 4,
    fontWeight: '700',
  },
  bottomStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  statCol: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryStrip: {
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryPillActive: {
    backgroundColor: '#A3E635',
    borderColor: '#A3E635',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  categoryPillTextActive: {
    color: '#0F172A',
  },
  alertBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  alertBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertBannerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FDE68A',
  },
  alertBannerDesc: {
    fontSize: 11.5,
    color: '#FEF3C7',
    lineHeight: 16,
  },
  telemetrySection: {
    marginBottom: 20,
  },
  telemetryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  telemetryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  telemetryStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  telemetryStatusDotOnline: {
    backgroundColor: '#4ADE80',
  },
  telemetryStatusDotOffline: {
    backgroundColor: '#F59E0B',
  },
  telemetryStatusText: {
    color: 'rgba(255, 255, 255, 0.68)',
    fontSize: 10,
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    padding: 14,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  gridCardVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gridCardSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
  },
  modulesSection: {
    marginBottom: 20,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    padding: 14,
  },
  moduleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  moduleSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 14,
  },
});
