import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { FarmScreen } from '@/components/ui/FarmScreen';

export default function PollinatorsScreen() {
  const beneficialCreatures = [
    {
      name: 'Pukyutan at Ligwan (Native Honeybees)',
      role: 'Pangunahing Tagapaglipat ng Poleng (Pollination)',
      impact: 'Nagpapataas ng ani ng gulay at katabing tanim ng 35%.',
      tips: 'Iwasan ang chemical insecticide spray sa umaga (7am-11am) kapag sila ay aktibo.',
      icon: 'bee',
      color: BrandColors.goldenYellowDark,
    },
    {
      name: 'Tutubi (Dragonflies & Damselflies)',
      role: 'Likas na Maninila ng Lamok at Gamu-gamo',
      impact: 'Kumakain ng hanggang 30 insektong peste bawat araw.',
      tips: 'Panatilihin ang malinis at dumadaloy na tubig sa kanal ng palayan.',
      icon: 'sprout',
      color: BrandColors.tealGreen,
    },
    {
      name: 'Putakti (Parasitoid Wasps - Trichogramma)',
      role: 'Kaaway ng Rice Stem Borer at Leaf Folder',
      impact: 'Nangingitlog sa loob ng itlog ng peste upang hindi mapisa.',
      tips: 'Magtanim ng Marigold at Zinnia sa pilapil bilang kanilang tahanan.',
      icon: 'leaf',
      color: BrandColors.primaryBlue,
    },
  ];

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Pollinator & Nature Corner"
        subtitle="Biodiversity at Kaibigang Insekto sa Sakahan"
        showBack
        gradientVariant="summerVibe"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.heroCard, Shadows.medium]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Buhay na Pilapil: Kalikasan at Palay</Text>
              <Text style={styles.heroSubtitle}>
                Ang malusog na palayan ay hindi sterile — ito ay may masiglang ekolohiya ng mga
                kaibigang bubuyog, gagamba, at tutubi.
              </Text>
            </View>
            <View style={styles.beeCircle}>
              <IconSymbol name="bee" size={32} color={BrandColors.goldenYellowDark} />
            </View>
          </View>
        </View>

        {/* Beneficial Creatures List */}
        <Text style={styles.sectionTitle}>Mga Kaibigang Insekto sa Bukid</Text>

        {beneficialCreatures.map((creature, idx) => (
          <View key={idx} style={[styles.creatureCard, Shadows.subtle]}>
            <View style={styles.creatureHeader}>
              <View style={[styles.creatureIconWrapper, { backgroundColor: creature.color + '1A' }]}>
                <IconSymbol
                  name={creature.icon as IconSymbolName}
                  size={22}
                  color={creature.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.creatureName}>{creature.name}</Text>
                <Text style={styles.creatureRole}>{creature.role}</Text>
              </View>
            </View>

            <View style={styles.impactBox}>
              <Text style={styles.impactLabel}>Bentahe sa Ani:</Text>
              <Text style={styles.impactText}>{creature.impact}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipLabel}>Paano Aakitin sa Bukid:</Text>
              <Text style={styles.tipText}>{creature.tips}</Text>
            </View>
          </View>
        ))}

        {/* Action Guide for Rice Dikes */}
        <View style={[styles.guideCard, Shadows.subtle]}>
          <Text style={styles.guideTitle}>4 Hakbang sa Pagtataguyod ng Floral Dikes (Pilapil)</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>1</Text>
            <Text style={styles.stepContent}>
              <Text style={{ fontWeight: '800' }}>Magtanim ng Bulaklak:</Text> Itanim ang Dilaw na
              Marigold, Cosmos, at Zinnia sa kahabaan ng pilapil.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>2</Text>
            <Text style={styles.stepContent}>
              <Text style={{ fontWeight: '800' }}>Lemongrass (Tanglad) Border:</Text> Nagtataboy ng
              masasamang insekto habang nagiging silungan ng mga gagamba.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>3</Text>
            <Text style={styles.stepContent}>
              <Text style={{ fontWeight: '800' }}>Iwasan ang Broad-Spectrum Spray:</Text> Gumamit ng
              fermented Kakawate tea sa halip na synthetic chemicals.
            </Text>
          </View>
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
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Glass.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: Glass.mutedText,
    lineHeight: 16,
  },
  beeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BrandColors.goldenYellowLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
    marginBottom: Spacing.xs,
  },
  creatureCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  creatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  creatureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatureName: {
    fontSize: 13,
    fontWeight: '800',
    color: Glass.text,
  },
  creatureRole: {
    fontSize: 11,
    color: BrandColors.tealGreenDark,
    fontWeight: '600',
  },
  impactBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  impactLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: BrandColors.charcoal,
    marginBottom: 2,
  },
  impactText: {
    fontSize: 11.5,
    color: BrandColors.slate,
    lineHeight: 16,
  },
  tipBox: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.tealGreen,
  },
  tipLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11.5,
    color: BrandColors.charcoal,
    lineHeight: 16,
  },
  guideCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: BrandColors.charcoal,
    marginBottom: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BrandColors.goldenYellow,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: '900',
    color: BrandColors.charcoal,
  },
  stepContent: {
    fontSize: 11.5,
    color: BrandColors.charcoal,
    flex: 1,
    lineHeight: 16,
  },
});
