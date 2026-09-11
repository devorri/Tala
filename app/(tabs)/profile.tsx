import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { Glass } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { farmerProfile, smsFallbackActive, setSmsFallbackActive, farmLocation } = useApp();

  const menuItems: {
    title: string;
    sub: string;
    icon: IconSymbolName;
    route: any;
    badge?: string;
  }[] = [
    {
      title: 'Ulat at Banta ng Panahon',
      sub: 'Kasalukuyang panahon at abiso sa foliar spray',
      icon: 'sun.max',
      route: '/weather',
    },
    {
      title: 'Paglaki ng Palay & Kalendaryo',
      sub: 'Talaan ng taas, yugto (Day 28), at gawain sa bukid',
      icon: 'sprout',
      route: '/growth-tracker',
      badge: 'Day 28',
    },
    {
      title: 'Digital Records & AWD Water Savings',
      sub: 'Kasaysayan ng patubig, Supabase logs, at survey',
      icon: 'analytics',
      route: '/records',
    },
    {
      title: 'Ulat ng Sakahan',
      sub: 'Buod ng sensors, patubig, alerts, at mga gawain',
      icon: 'analytics',
      route: '/reports',
    },
    {
      title: 'TALA AI Tagapayo sa Sakahan',
      sub: 'Magtanong at humingi ng tulong ukol sa peste',
      icon: 'chat',
      route: '/ai-assistant',
    },
    {
      title: 'Kaibigang Insekto at Biodiversity',
      sub: 'Gabay sa pollinator at kaibigang insekto sa palayan',
      icon: 'bee',
      route: '/pollinators',
    },
  ];

  return (
    <FarmScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Profile at Sistema</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/system-controls')}
            activeOpacity={0.7}
          >
            <IconSymbol name="settings" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Dark Forest Green Profile Card (Dribbble Style) */}
        <View style={styles.profileForestCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {farmerProfile.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.farmerName}>{farmerProfile.name}</Text>
              <Text style={styles.farmName}>{farmerProfile.farmName}</Text>
              <TouchableOpacity
                onPress={() => router.push('/weather')}
                style={styles.locationRow}
                activeOpacity={0.8}
              >
                <IconSymbol name="location" size={13} color="#A3E635" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {farmLocation.label}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileMetricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>2.5 Has</Text>
              <Text style={styles.metricLabel}>Laki ng Bukid</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>RC-222</Text>
              <Text style={styles.metricLabel}>Bariedad ng Palay</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>Day 28</Text>
              <Text style={styles.metricLabel}>Yugto ng Tanim</Text>
            </View>
          </View>
        </View>

        {/* SEMINA ESP32 Hardware Status Card */}
        <View style={styles.nodeCard}>
          <View style={styles.nodeHeaderRow}>
            <View style={styles.nodeTitleRow}>
              <IconSymbol name="signal.cellular" size={18} color="#15803D" />
              <Text style={styles.nodeTitle}>SEMINA Hardware Gateway</Text>
            </View>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineBadgeText}>ONLINE • 92% Solar</Text>
            </View>
          </View>

          <View style={styles.nodeGrid}>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel}>Hardware Node:</Text>
              <Text style={styles.nodeVal}>{farmerProfile.seminaNodeId}</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel}>Database & Control:</Text>
              <Text style={styles.nodeVal}>Supabase REST (sensor_logs)</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel}>Patubig Algorithm:</Text>
              <Text style={styles.nodeVal}>AWD Solar Pulse Irrigation</Text>
            </View>
          </View>

          <View style={styles.smsToggleRow}>
            <Text style={styles.smsToggleLabel}>I-enable ang GSM SMS Alerts Fallback</Text>
            <Switch
              value={smsFallbackActive}
              onValueChange={setSmsFallbackActive}
              trackColor={{ false: '#CBD5E1', true: '#1C3829' }}
              thumbColor={smsFallbackActive ? '#A3E635' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Streamlined Menu Navigation Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SEMINA Smart Modules</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.menuRow, idx < menuItems.length - 1 && styles.menuRowBorder]}
                onPress={() => router.push(item.route)}
                activeOpacity={0.75}
              >
                <View style={styles.menuIconWrapper}>
                  <IconSymbol name={item.icon} size={18} color="#A3E635" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSub} numberOfLines={1}>
                    {item.sub}
                  </Text>
                </View>

                {item.badge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{item.badge}</Text>
                  </View>
                )}

                <IconSymbol name="chevron.right" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout / Switch Account */}
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          style={styles.logoutBtn}
          activeOpacity={0.8}
        >
          <IconSymbol name="close" size={16} color="#EF4444" />
          <Text style={styles.logoutText}>Mag-log out o Mag-switch ng Account</Text>
        </TouchableOpacity>

        <View style={styles.appInfoBox}>
          <Text style={styles.appInfoText}>TALA Mobile App • Project SEMINA v1.0</Text>
        </View>
      </ScrollView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Glass.text,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Glass.surfaceSoft,
    borderWidth: 1,
    borderColor: Glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileForestCard: {
    backgroundColor: Glass.surface,
    borderWidth: 1,
    borderColor: Glass.border,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#A3E635',
    fontSize: 18,
    fontWeight: '800',
  },
  farmerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  farmName: {
    fontSize: 12.5,
    color: Glass.mutedText,
    fontWeight: '500',
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11.5,
    color: '#A3E635',
    fontWeight: '700',
  },
  profileMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 10,
    color: Glass.mutedText,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nodeCard: {
    backgroundColor: Glass.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  nodeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nodeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nodeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Glass.text,
  },
  onlineBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  onlineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  nodeGrid: {
    gap: 6,
    marginBottom: 12,
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nodeLabel: {
    fontSize: 11.5,
    color: Glass.mutedText,
  },
  nodeVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Glass.text,
  },
  smsToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Glass.border,
  },
  smsToggleLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Glass.text,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Glass.text,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: Glass.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Glass.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Glass.border,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Glass.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Glass.text,
  },
  menuSub: {
    fontSize: 10.5,
    color: Glass.mutedText,
    marginTop: 1,
  },
  badgePill: {
    backgroundColor: Glass.surfaceSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A3E635',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EF4444',
  },
  appInfoBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  appInfoText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
});
