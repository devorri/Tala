import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Glass, BrandColors, BorderRadius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function SystemControlsScreen() {
  const router = useRouter();
  const {
    smsFallbackActive,
    setSmsFallbackActive,
    smsContacts,
    smsIntervalMinutes,
    saveSmsInterval,
    addSmsContact,
    removeSmsContact,
  } = useApp();
  const [intervalDraft, setIntervalDraft] = useState(String(smsIntervalMinutes));
  const [phoneDraft, setPhoneDraft] = useState('');
  const [savingInterval, setSavingInterval] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => setIntervalDraft(String(smsIntervalMinutes)), [smsIntervalMinutes]);

  const handleSaveInterval = async () => {
    setSavingInterval(true);
    const saved = await saveSmsInterval(Number(intervalDraft));
    setSavingInterval(false);
    if (!saved) Alert.alert('Hindi na-save', 'Pumili ng pagitan na 5 hanggang 1,440 minuto at tiyaking may system_settings row na id 1.');
  };

  const handleAddContact = async () => {
    setSavingContact(true);
    const saved = await addSmsContact(phoneDraft);
    setSavingContact(false);
    if (!saved) {
      Alert.alert('Hindi naidagdag', 'Maglagay ng wastong numero, halimbawa +639171234567.');
      return;
    }
    setPhoneDraft('');
  };

  return (
    <FarmScreen>
      <GradientHeader title="SMS Control Panel" subtitle="Mga tatanggap at pagitan ng SEMINA alerts" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.iconCircle}><IconSymbol name="sms" size={19} color="#A3E635" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>SMS Fallback</Text>
              <Text style={styles.cardDescription}>Gamitin ang nakarehistrong contacts kapag walang internet.</Text>
            </View>
            <Switch
              value={smsFallbackActive}
              onValueChange={setSmsFallbackActive}
              trackColor={{ false: 'rgba(255,255,255,0.18)', true: '#65A30D' }}
              thumbColor={smsFallbackActive ? '#A3E635' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>SMS INTERVAL</Text>
          <Text style={styles.cardTitle}>Gaano kadalas magpapadala?</Text>
          <Text style={styles.cardDescription}>Ito ang `sms_interval_minutes` sa system_settings. Pinapayagan ang 5–1,440 minuto.</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={intervalDraft}
              onChangeText={setIntervalDraft}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="60"
              placeholderTextColor="rgba(255,255,255,0.45)"
            />
            <Text style={styles.inputSuffix}>minuto</Text>
            <TouchableOpacity onPress={handleSaveInterval} disabled={savingInterval} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{savingInterval ? 'Saving…' : 'I-save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.contactsHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>CONTACTS</Text>
              <Text style={styles.cardTitle}>Mga tatanggap ng SMS</Text>
            </View>
            <Text style={styles.contactCount}>{smsContacts.length} naka-save</Text>
          </View>

          {smsContacts.length === 0 ? (
            <Text style={styles.emptyText}>Wala pang contact. Magdagdag ng numero para makatanggap ng fallback alerts.</Text>
          ) : (
            smsContacts.map((contact) => (
              <View key={contact.id} style={styles.contactRow}>
                <View style={styles.contactIcon}><IconSymbol name="person.fill" size={16} color="#A3E635" /></View>
                <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                <TouchableOpacity onPress={() => removeSmsContact(contact.id)} style={styles.removeButton} accessibilityLabel={`Remove ${contact.phoneNumber}`}>
                  <IconSymbol name="close" size={16} color="#FCA5A5" />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.addContactRow}>
            <TextInput
              value={phoneDraft}
              onChangeText={setPhoneDraft}
              keyboardType="phone-pad"
              style={styles.input}
              placeholder="+639171234567"
              placeholderTextColor="rgba(255,255,255,0.45)"
            />
            <TouchableOpacity onPress={handleAddContact} disabled={savingContact} style={styles.addButton}>
              <IconSymbol name="add" size={18} color="#14291E" />
              <Text style={styles.addButtonText}>{savingContact ? '...' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.note}>Ang panel na ito ay nag-uupdate ng contacts at system_settings sa Supabase. Kailangan pa rin ng SEMINA/SMS gateway na gumamit ng mga values na ito kapag magpapadala.</Text>
      </ScrollView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: 120, gap: Spacing.md },
  card: { backgroundColor: Glass.surface, borderWidth: 1, borderColor: Glass.border, borderRadius: BorderRadius.lg, padding: Spacing.md },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: Glass.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: Glass.text, fontSize: 14, fontWeight: '800' },
  cardDescription: { color: Glass.mutedText, fontSize: 11, lineHeight: 16, marginTop: 3 },
  sectionEyebrow: { color: '#A3E635', fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  input: { flex: 1, minHeight: 42, borderRadius: BorderRadius.md, paddingHorizontal: 12, color: Glass.text, backgroundColor: Glass.surfaceSoft, borderWidth: 1, borderColor: Glass.border, fontSize: 13, fontWeight: '600' },
  inputSuffix: { color: Glass.mutedText, fontSize: 11, marginLeft: -2 },
  primaryButton: { backgroundColor: '#A3E635', paddingHorizontal: 13, minHeight: 42, borderRadius: BorderRadius.md, justifyContent: 'center' },
  primaryButtonText: { color: '#14291E', fontSize: 12, fontWeight: '900' },
  contactsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  contactCount: { color: Glass.mutedText, fontSize: 10, fontWeight: '700' },
  emptyText: { color: Glass.mutedText, fontSize: 11.5, lineHeight: 16, marginBottom: 10 },
  contactRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' },
  contactIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: Glass.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  contactPhone: { flex: 1, color: Glass.text, fontSize: 12.5, fontWeight: '700' },
  removeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(239,68,68,0.16)', alignItems: 'center', justifyContent: 'center' },
  addContactRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  addButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 11, borderRadius: BorderRadius.md, backgroundColor: '#A3E635' },
  addButtonText: { color: '#14291E', fontSize: 12, fontWeight: '900' },
  note: { color: 'rgba(255,255,255,0.58)', fontSize: 10.5, lineHeight: 15, paddingHorizontal: 3 },
});
