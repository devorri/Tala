import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ImageBackground,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FarmLocation, useApp } from '@/context/AppContext';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { GlassCard } from '@/components/ui/GlassCard';

export const DEFAULT_FARM_BG = require('@/assets/images/home-bg2.jpg');

const LOCATION_PRESETS: FarmLocation[] = [
  { latitude: 15.7167, longitude: 120.9, label: 'Science City of Muñoz, Nueva Ecija', isGpsDetected: false },
  { latitude: 15.4828, longitude: 120.596, label: 'Cabanatuan City, Nueva Ecija', isGpsDetected: false },
  { latitude: 15.0343, longitude: 120.684, label: 'San Fernando, Pampanga', isGpsDetected: false },
];

export default function WeatherScreen() {
  const {
    weatherData,
    isWeatherLoading,
    farmLocation,
    setFarmLocation,
    detectDeviceLocation,
    isLocatingGps,
    refreshWeather,
    farmerProfile,
  } = useApp();

  const [selectedTab, setSelectedTab] = useState<'hourly' | 'daily'>('hourly');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLocatePhone = async () => {
    const res = await detectDeviceLocation();
    if (!res) {
      Alert.alert(
        'Kailangan ng Permiso sa Lokasyon',
        'Pakibuksan ang Settings ng iyong telepono at tiyaking naka-ON ang Lokasyon (GPS) para sa TALA upang makuha ang pinakatumpak na ulat-panahon sa iyong aktwal na kinalalagyan.'
      );
    }
  };

  const handleUseGPS = async () => {
    const location = await detectDeviceLocation();
    if (location) setModalVisible(false);
  };

  const handleSelectPreset = (location: FarmLocation) => {
    setFarmLocation(location);
    setModalVisible(false);
  };

  const todayDateStr = new Date().toLocaleDateString('tl-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ImageBackground
      source={DEFAULT_FARM_BG}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isWeatherLoading} onRefresh={refreshWeather} tintColor="#A3E635" />
        }
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {farmerProfile.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.greetingSub}>TALA • Project SEMINA</Text>
              <Text style={styles.userName}>{farmerProfile.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.locationBtn}
            onPress={() => setModalVisible(true)}
            disabled={isLocatingGps}
            activeOpacity={0.8}
          >
            {isLocatingGps ? (
              <ActivityIndicator size="small" color="#A3E635" />
            ) : (
              <IconSymbol name="location" size={16} color="#A3E635" />
            )}
            <Text style={styles.locationBtnText} numberOfLines={1}>
              {isLocatingGps ? 'Pagtukoy...' : farmLocation.label.split(',')[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Big Glassmorphism Hero Panel (Inspired by LibraSmart UI) */}
        <GlassCard variant="panel" style={styles.heroGlassPanel}>
          <View style={styles.panelHeaderRow}>
            <View style={styles.schoolBadge}>
              <Text style={styles.schoolBadgeText}>SEMINA SMART CLIMATE STATION</Text>
            </View>
            <Text style={styles.heroDate}>{todayDateStr}</Text>
          </View>

          <View style={styles.heroMainRow}>
            {/* Left Title & Description */}
            <View style={styles.heroTextSection}>
              <Text style={styles.heroTitle}>
                Panahon at Banta ng Ulan
              </Text>
              <Text style={styles.heroDescription}>
                Real-time regional weather forecast at agri-decision advisory para sa mas maagap na pagpapatubig at pag-spray sa palayan.
              </Text>

              {/* Action Buttons Row */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={styles.cyanActionBtn}
                  onPress={handleLocatePhone}
                  disabled={isLocatingGps}
                  activeOpacity={0.8}
                >
                  {isLocatingGps ? (
                    <ActivityIndicator size="small" color="#0F172A" />
                  ) : (
                    <IconSymbol name="location" size={16} color="#0F172A" />
                  )}
                  <Text style={styles.cyanActionBtnText}>
                    {isLocatingGps ? 'Pagtukoy ng GPS...' : 'I-detect ang Aking Lokasyon'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.glassActionBtn}
                  onPress={() => refreshWeather()}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="refresh" size={16} color="#FFFFFF" />
                  <Text style={styles.glassActionBtnText}>I-refresh</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Sub-Card: Live Weather Badge (Like "5 active transactions" card) */}
            <GlassCard variant="subcard" style={styles.heroRightSubCard}>
              <View style={styles.subCardTop}>
                <Text style={styles.subCardLabel}>KASALUKUYAN</Text>
                <IconSymbol
                  name={(weatherData?.icon as IconSymbolName) || 'sun.max'}
                  size={26}
                  color="#FACC15"
                />
              </View>
              <Text style={styles.subCardTemp}>
                {weatherData ? `${weatherData.temperature}°C` : '24°C'}
              </Text>
              <Text style={styles.subCardCondition} numberOfLines={1}>
                {weatherData?.conditionTagalog ?? 'Maaraw na may Ulap'}
              </Text>
              <Text style={styles.subCardHeat}>
                Damang Init: {weatherData ? `${weatherData.feelsLike}°C` : '36°C'}
              </Text>
            </GlassCard>
          </View>

          {/* Bottom 4-Column High-Contrast Stats Row */}
          {weatherData && (
            <View style={styles.bottomStatsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>{weatherData.humidity}%</Text>
                <Text style={styles.statLabel}>Halumigmig</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>{weatherData.rainPct}%</Text>
                <Text style={styles.statLabel}>Tsansa ng Ulan</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>{weatherData.windSpeed} km/h</Text>
                <Text style={styles.statLabel}>Bilis ng Hangin</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>{weatherData.uvIndex}</Text>
                <Text style={styles.statLabel}>UV Index</Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* Section Header + Filter Tabs */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ulat-Panahon sa Rehiyon</Text>
          <View style={styles.togglePillContainer}>
            <TouchableOpacity
              style={[styles.togglePill, selectedTab === 'hourly' && styles.togglePillActive]}
              onPress={() => setSelectedTab('hourly')}
            >
              <Text style={[styles.togglePillText, selectedTab === 'hourly' && styles.togglePillTextActive]}>
                Oras-oras
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.togglePill, selectedTab === 'daily' && styles.togglePillActive]}
              onPress={() => setSelectedTab('daily')}
            >
              <Text style={[styles.togglePillText, selectedTab === 'daily' && styles.togglePillTextActive]}>
                7-Araw
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forecast Content based on Selected Tab */}
        {selectedTab === 'hourly' && weatherData?.hourly && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
            {weatherData.hourly.map((h, i) => (
              <GlassCard key={i} variant="subcard" style={[styles.hourlyCard, i === 0 && styles.hourlyCardActive]}>
                <Text style={[styles.hourlyTime, i === 0 && styles.hourlyTextActive]}>{h.time}</Text>
                <IconSymbol
                  name={h.icon as IconSymbolName}
                  size={24}
                  color={i === 0 ? '#A3E635' : '#FFFFFF'}
                />
                <Text style={[styles.hourlyTemp, i === 0 && styles.hourlyTextActive]}>{h.temp}°</Text>
                {h.rainPct > 10 && (
                  <Text style={styles.hourlyRain}>{h.rainPct}% ulan</Text>
                )}
              </GlassCard>
            ))}
          </ScrollView>
        )}

        {selectedTab === 'daily' && weatherData?.daily && (
          <View style={styles.dailyContainer}>
            {weatherData.daily.map((d, idx) => (
              <GlassCard key={idx} variant="subcard" style={[styles.dailyCardRow, idx === 0 && styles.dailyCardRowToday]}>
                <Text style={[styles.dailyDayName, idx === 0 && styles.textLime]}>{d.day}</Text>
                <View style={styles.dailyCenterInfo}>
                  <IconSymbol
                    name={d.icon as IconSymbolName}
                    size={20}
                    color={idx === 0 ? '#A3E635' : '#FACC15'}
                  />
                  <Text style={styles.dailyCondText} numberOfLines={1}>
                    {d.conditionTagalog}
                  </Text>
                </View>
                <Text style={[styles.dailyTempRange, idx === 0 && styles.textLime]}>
                  {d.high}° / {d.low}°
                </Text>
              </GlassCard>
            ))}
          </View>
        )}

        {/* 2x2 Agri-Telemetry & Decision Grid */}
        {weatherData && (
          <View style={styles.advisoryGridSection}>
            <Text style={styles.sectionTitle}>Agri-Decision Advisory (Bintana ng Gawain)</Text>
            
            <View style={styles.grid2x2}>
              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>Bintana ng Spray</Text>
                  <IconSymbol name="sprout" size={18} color="#A3E635" />
                </View>
                <Text style={styles.gridCardVal}>
                  {weatherData.rainPct < 30 ? 'Mainam' : 'Ipabukas'}
                </Text>
                <Text style={styles.gridCardSub}>
                  {weatherData.rainPct < 30 ? 'Mababa ang tsansa ng ulan' : 'May banta ng pagbuhos'}
                </Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>Damang Init</Text>
                  <IconSymbol name="sun.max" size={18} color="#FACC15" />
                </View>
                <Text style={styles.gridCardVal}>{weatherData.feelsLike}°C</Text>
                <Text style={styles.gridCardSub}>
                  {weatherData.feelsLike >= 35 ? 'Kailangan ng patubig' : 'Normal na temperatura'}
                </Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>Bilis ng Hangin</Text>
                  <IconSymbol name="paperplane.fill" size={18} color="#38BDF8" />
                </View>
                <Text style={styles.gridCardVal}>{weatherData.windSpeed} km/h</Text>
                <Text style={styles.gridCardSub}>
                  {weatherData.windSpeed > 15 ? 'Malakas ang hangin' : 'Ligtas sa foliar spray'}
                </Text>
              </GlassCard>

              <GlassCard variant="subcard" style={styles.gridCard}>
                <View style={styles.gridCardTop}>
                  <Text style={styles.gridCardLabel}>UV Exposure</Text>
                  <IconSymbol name="thermostat" size={18} color="#FB923C" />
                </View>
                <Text style={styles.gridCardVal}>{weatherData.uvIndex} Index</Text>
                <Text style={styles.gridCardSub}>
                  {weatherData.uvIndex > 7 ? 'Mataas (Mag-ingat)' : 'Katamtaman'}
                </Text>
              </GlassCard>
            </View>
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Open-Meteo Weather Model • Updated: {weatherData?.fetchedAt ?? 'Ngayon'}
          </Text>
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* Location Calibration Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalOverlay} edges={['top', 'right', 'bottom', 'left']}>
          <GlassCard variant="panel" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <IconSymbol name="location" size={20} color="#A3E635" />
                <Text style={styles.modalTitle}>I-calibrate ang Lokasyon ng Bukid</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <IconSymbol name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Pumili ng bayan sa Central Luzon o gamitin ang GPS para sa pinakatumpak na ulat sa sakahan.
            </Text>

            {/* GPS Button */}
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={handleUseGPS}
              disabled={isLocatingGps}
              activeOpacity={0.8}
            >
              {isLocatingGps ? (
                <ActivityIndicator color="#0F172A" size="small" />
              ) : (
                <IconSymbol name="paperplane.fill" size={18} color="#0F172A" />
              )}
              <Text style={styles.gpsButtonText}>
                {isLocatingGps ? 'Pagtukoy ng GPS...' : 'Gamitin ang Aking GPS Location'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.presetSectionLabel}>MGA REGIONAL PRESETS:</Text>

            <ScrollView style={styles.presetList} showsVerticalScrollIndicator={false}>
              {LOCATION_PRESETS.map((preset, i) => {
                const isSelected = farmLocation.label === preset.label;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                    onPress={() => handleSelectPreset(preset)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name="location"
                      size={18}
                      color={isSelected ? '#A3E635' : '#94A3B8'}
                    />
                    <Text style={[styles.presetText, isSelected && styles.presetTextSelected]}>
                      {preset.label}
                    </Text>
                    {isSelected && <IconSymbol name="checkmark" size={18} color="#A3E635" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </GlassCard>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 40,
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
  avatarInitials: {
    color: '#A3E635',
    fontWeight: '800',
    fontSize: 14,
  },
  greetingSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  locationBtnText: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 140,
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
  schoolBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  schoolBadgeText: {
    color: '#FACC15',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroDate: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '500',
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
  cyanActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#06B6D4', // Vibrant cyan pill
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  cyanActionBtnText: {
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
    alignSelf: 'stretch',
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
  subCardHeat: {
    fontSize: 9,
    color: '#FACC15',
    marginTop: 4,
    fontWeight: '600',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
  togglePillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  togglePillActive: {
    backgroundColor: '#06B6D4',
  },
  togglePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  togglePillTextActive: {
    color: '#0F172A',
  },
  hourlyList: {
    gap: 10,
    marginBottom: 20,
  },
  hourlyCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
    width: 76,
  },
  hourlyCardActive: {
    borderColor: '#06B6D4',
  },
  hourlyTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hourlyRain: {
    fontSize: 9,
    fontWeight: '700',
    color: '#38BDF8',
  },
  hourlyTextActive: {
    color: '#06B6D4',
  },
  dailyContainer: {
    gap: 8,
    marginBottom: 20,
  },
  dailyCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  dailyCardRowToday: {
    borderColor: '#06B6D4',
  },
  dailyDayName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    width: '32%',
  },
  dailyCenterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dailyCondText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyTempRange: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  textLime: {
    color: '#A3E635',
  },
  advisoryGridSection: {
    marginBottom: 20,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
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
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gridCardSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
    lineHeight: 13,
  },
  footerRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
    maxHeight: '80%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 16,
  },
  gpsButton: {
    backgroundColor: '#06B6D4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  gpsButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  presetSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  presetList: {
    maxHeight: 220,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 6,
    gap: 10,
  },
  presetCardSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06B6D4',
  },
  presetText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  presetTextSelected: {
    color: '#06B6D4',
    fontWeight: '800',
  },
});
