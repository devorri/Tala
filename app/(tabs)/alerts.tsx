import { AlertItem } from '@/components/ui/AlertItem';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkeletonAlertItem } from '@/components/ui/SkeletonLoader';
import { BorderRadius, BrandColors, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AlertsScreen() {
  const {
    alerts,
    dismissAlert,
    executeAlertAction,
    unreadAlertsCount,
    farmerProfile,
    smsFallbackActive,
    setSmsFallbackActive,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', label: 'Lahat ng Alerto' },
    { id: 'soil', label: 'Lupa at Patubig' },
    { id: 'ph', label: 'pH ng Lupa' },
    { id: 'weather', label: 'Panahon' },
    { id: 'system', label: 'Sistema' },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'soil') return alert.category === 'soil' || alert.category === 'water';
    return alert.category === selectedCategory;
  });

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Mga Alerto at Abiso"
        subtitle={`${unreadAlertsCount} Bagong Alerto mula sa SEMINA Node`}
        gradientVariant="blueToTeal"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SMS Fallback Gateway Banner */}


        {/* Categories Bar */}
        <AnimatedCard delay={150}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  activeOpacity={0.75}>
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </AnimatedCard>

        {/* Alerts List with Skeletons */}
        <View style={styles.alertsList}>
          {isLoading ? (
            <>
              <SkeletonAlertItem />
              <SkeletonAlertItem />
              <SkeletonAlertItem />
            </>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <AnimatedCard key={alert.id} delay={180 + index * 60}>
                <AlertItem
                  alert={alert}
                  onExecuteAction={executeAlertAction}
                  onDismiss={dismissAlert}
                />
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard delay={200}>
              <EmptyState
                icon="check.circle"
                title="Walang Aktibong Alerto"
                description="Lahat ng sensors at antas ng patubig sa bukid ay nasa normal at optimal na kondisyon."
              />
            </AnimatedCard>
          )}
        </View>

        {/* Educational Note */}
        {!isLoading && (
          <AnimatedCard delay={350}>
            <View style={styles.eduBox}>
              <IconSymbol name="leaf" size={16} color={BrandColors.tealGreenDark} />
              <Text style={styles.eduText}>
                Ang mga alerto ng TALA ay nakadisenyo batay sa PhilRice gabay at Alternate Wetting and
                Drying (AWD) criteria upang maiwasan ang labis na pagbaha sa palayan.
              </Text>
            </View>
          </AnimatedCard>
        )}
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
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  smsGatewayCard: {
    backgroundColor: '#FFFDF0',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  smsGatewayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  smsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.goldenYellowLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsGatewayTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  smsGatewayDesc: {
    fontSize: 11,
    color: BrandColors.slate,
    lineHeight: 15,
    marginTop: 2,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: BrandColors.tealGreen,
    borderColor: BrandColors.tealGreen,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.slate,
  },
  categoryTextActive: {
    color: BrandColors.white,
  },
  alertsList: {
    marginTop: Spacing.xs,
  },
  eduBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: BrandColors.tealGreenLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  eduText: {
    fontSize: 11.5,
    color: BrandColors.tealGreenDark,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
});
