import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { BrandButton } from '@/components/ui/BrandButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FarmScreen } from '@/components/ui/FarmScreen';

export default function LoginScreen() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('0917 842 1993');
  const [email, setEmail] = useState('juan.delacruz@tala.ph');
  const [password, setPassword] = useState('••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <FarmScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('@/assets/images/TALA-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>TALA</Text>
          <Text style={styles.appSubtitle}>Traditional Agri-Land Advisor</Text>
          <Text style={styles.projectTag}>PROJECT SEMINA • SMART AGRI SYSTEM</Text>
        </View>

        {/* Login Form Card */}
        <View style={[styles.card, Shadows.medium]}>
          {/* Method Selector */}
          <View style={styles.methodSelector}>
            <TouchableOpacity
              onPress={() => setAuthMethod('phone')}
              style={[styles.methodTab, authMethod === 'phone' && styles.methodTabActive]}
              activeOpacity={0.8}>
              <IconSymbol
                name="sms"
                size={16}
                color={authMethod === 'phone' ? BrandColors.primaryBlue : BrandColors.slate}
              />
              <Text
                style={[
                  styles.methodTabText,
                  authMethod === 'phone' && styles.methodTabTextActive,
                ]}>
                Numero ng Telepono
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAuthMethod('email')}
              style={[styles.methodTab, authMethod === 'email' && styles.methodTabActive]}
              activeOpacity={0.8}>
              <IconSymbol
                name="paperplane.fill"
                size={16}
                color={authMethod === 'email' ? BrandColors.primaryBlue : BrandColors.slate}
              />
              <Text
                style={[
                  styles.methodTabText,
                  authMethod === 'email' && styles.methodTabTextActive,
                ]}>
                Email Address
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          {authMethod === 'phone' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Phone Number (May SMS Gateway Sync)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+63</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.textInput}
                  placeholder="917 123 4567"
                  keyboardType="phone-pad"
                  placeholderTextColor={BrandColors.mutedText}
                />
              </View>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.textInput}
                  placeholder="magsasaka@domain.ph"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={BrandColors.mutedText}
                />
              </View>
            </View>
          )}

          {isOtpMode ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>One-Time PIN (OTP)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={otpCode}
                  onChangeText={setOtpCode}
                  style={styles.textInput}
                  placeholder="Ipasok ang 6-digit SMS code"
                  keyboardType="number-pad"
                  placeholderTextColor={BrandColors.mutedText}
                />
              </View>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password / Passcode ng Bukid</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.textInput}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor={BrandColors.mutedText}
                />
              </View>
            </View>
          )}

          {/* Toggle OTP / Password */}
          <TouchableOpacity
            onPress={() => setIsOtpMode(!isOtpMode)}
            style={styles.toggleOtp}
            activeOpacity={0.7}>
            <Text style={styles.toggleOtpText}>
              {isOtpMode ? 'Gamitin ang Password sa halip' : 'Mag-login gamit ang SMS OTP (Walang password)'}
            </Text>
          </TouchableOpacity>

          {/* Login Buttons */}
          <View style={styles.actions}>
            <BrandButton
              title="Mag-log in sa Dashboard"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              fullWidth
            />

            <BrandButton
              title="Demo Access: Ka Juan Dela Cruz"
              onPress={handleLogin}
              variant="teal"
              size="md"
              icon="sprout"
              fullWidth
            />
          </View>
        </View>

        {/* Offline & SEMINA notice */}
        <View style={styles.noticeBox}>
          <IconSymbol name="signal.cellular" size={18} color={BrandColors.tealGreenDark} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>SEMINA Smart Offline Sync</Text>
            <Text style={styles.noticeDesc}>
              Awtomatikong gumagana ang mga alerto at rekomendasyon kahit mahina ang data gamit ang
              lokal na SMS fallback gateway.
            </Text>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Glass.surface,
    padding: 6,
    ...Shadows.medium,
    marginBottom: Spacing.sm,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: BrandColors.primaryBlueDark,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },
  projectTag: {
    fontSize: 10,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  card: {
    backgroundColor: Glass.surfaceSoft,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.lg,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  methodTabActive: {
    backgroundColor: Glass.surfaceSoft,
    ...Shadows.subtle,
  },
  methodTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: BrandColors.slate,
  },
  methodTabTextActive: {
    color: BrandColors.primaryBlueDark,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: BrandColors.charcoal,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 48,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.slate,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.charcoal,
    fontWeight: '600',
  },
  toggleOtp: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  toggleOtpText: {
    fontSize: 11.5,
    color: BrandColors.primaryBlue,
    fontWeight: '700',
  },
  actions: {
    gap: Spacing.sm,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: BrandColors.tealGreenLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.tealGreenDark,
    marginBottom: 2,
  },
  noticeDesc: {
    fontSize: 11,
    color: BrandColors.charcoal,
    lineHeight: 15,
  },
});
