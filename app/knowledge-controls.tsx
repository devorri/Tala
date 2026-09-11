import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FarmScreen } from '@/components/ui/FarmScreen';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Glass, BorderRadius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { KnowledgeArticle } from '@/services/mock-data';
import { uploadKnowledgeMediaToSupabase } from '@/services/supabase';

const categories: { id: KnowledgeArticle['category']; label: string }[] = [
  { id: 'traditional_practice', label: 'Gawi' }, { id: 'soil_care', label: 'Lupa/Tubig' }, { id: 'biodiversity', label: 'Kalikasan' }, { id: 'audio_elder', label: 'Kuwento' },
];

export default function KnowledgeControlsScreen() {
  const { articles, publishKnowledgeArticle, removeKnowledgeArticle } = useApp();
  const [title, setTitle] = useState(''); const [summary, setSummary] = useState(''); const [content, setContent] = useState('');
  const [category, setCategory] = useState<KnowledgeArticle['category']>('traditional_practice');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Kailangan ng permiso', 'Payagan ang photo library para makapag-attach ng larawan.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };
  const publish = async () => {
    if (!title.trim() || !summary.trim() || !content.trim()) { Alert.alert('Kulang ang post', 'Lagyan ng pamagat, maikling buod, at buong kuwento.'); return; }
    setIsPublishing(true);
    const uploadedUrl = imageUri ? await uploadKnowledgeMediaToSupabase(imageUri) : null;
    if (imageUri && !uploadedUrl) { setIsPublishing(false); Alert.alert('Hindi na-upload', 'Suriin kung may upload permission ang bucket na Files.'); return; }
    const mediaUrl = uploadedUrl ?? undefined;
    publishKnowledgeArticle({ title: title.trim(), tagalogTitle: 'Bagong gabay mula sa TALA', author: 'TALA Knowledge Editor', role: 'Community post', location: 'TALA Farm Network', category, summary: summary.trim(), content: content.trim(), iconName: 'book.fill', tags: ['Community', 'TALA'], mediaUrl });
    setTitle(''); setSummary(''); setContent(''); setImageUri(null); setIsPublishing(false); Alert.alert('Nai-publish', 'Lalabas na ang post sa Feed ng Sakahan.');
  };
  const posts = articles.filter((article) => article.id.startsWith('post-'));
  return <FarmScreen><GradientHeader title="Knowledge Post Control" subtitle="Mag-publish ng gabay sa Feed ng Sakahan" showBack />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}><Text style={styles.eyebrow}>BAGONG POST</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Pamagat ng gabay" placeholderTextColor="rgba(255,255,255,0.45)" />
        <TextInput value={summary} onChangeText={setSummary} style={styles.input} placeholder="Maikling buod para sa feed" placeholderTextColor="rgba(255,255,255,0.45)" multiline />
        <TextInput value={content} onChangeText={setContent} style={[styles.input, styles.bodyInput]} placeholder="Buong kaalaman, proseso, o kuwento…" placeholderTextColor="rgba(255,255,255,0.45)" multiline textAlignVertical="top" />
        <TouchableOpacity onPress={chooseImage} style={styles.mediaButton}>
          <IconSymbol name="camera" size={18} color="#A3E635" /><Text style={styles.mediaButtonText}>{imageUri ? 'Palitan ang larawan' : 'Mag-attach ng larawan'}</Text>
        </TouchableOpacity>
        {imageUri ? <View style={styles.previewWrap}><Image source={{ uri: imageUri }} style={styles.preview} /><TouchableOpacity onPress={() => setImageUri(null)} style={styles.clearMedia}><IconSymbol name="close" size={15} color="#FFFFFF" /></TouchableOpacity></View> : null}
        <View style={styles.categoryRow}>{categories.map((item) => <TouchableOpacity key={item.id} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.categoryActive]}><Text style={[styles.categoryText, category === item.id && styles.categoryTextActive]}>{item.label}</Text></TouchableOpacity>)}</View>
        <TouchableOpacity onPress={publish} disabled={isPublishing} style={styles.publishButton}><IconSymbol name="add" size={18} color="#14291E" /><Text style={styles.publishText}>{isPublishing ? 'Nag-a-upload…' : 'I-publish sa Feed'}</Text></TouchableOpacity>
      </View>
      <View style={styles.card}><Text style={styles.eyebrow}>NAI-PUBLISH NA POST</Text>{posts.length === 0 ? <Text style={styles.empty}>Wala ka pang sariling post.</Text> : posts.map((post) => <View key={post.id} style={styles.postRow}><View style={{ flex: 1 }}><Text style={styles.postTitle}>{post.title}</Text><Text style={styles.postSummary} numberOfLines={1}>{post.summary}</Text></View><TouchableOpacity onPress={() => removeKnowledgeArticle(post.id)} style={styles.remove}><IconSymbol name="close" size={16} color="#FCA5A5" /></TouchableOpacity></View>)}</View>
      <Text style={styles.note}>Sa kasalukuyan, ang curated starter articles ay naka-lock. Ang posts mula rito ay puwedeng alisin habang bukas ang app.</Text>
    </ScrollView></FarmScreen>;
}
const styles = StyleSheet.create({ content: { padding: Spacing.md, paddingBottom: 120, gap: Spacing.md }, card: { backgroundColor: Glass.surface, borderWidth: 1, borderColor: Glass.border, borderRadius: BorderRadius.lg, padding: Spacing.md }, eyebrow: { color: '#A3E635', fontSize: 10, fontWeight: '900', letterSpacing: 0.8, marginBottom: 9 }, input: { minHeight: 43, color: Glass.text, fontSize: 12.5, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Glass.surfaceSoft, borderWidth: 1, borderColor: Glass.border, borderRadius: BorderRadius.md, marginBottom: 9 }, bodyInput: { minHeight: 120 }, mediaButton: { minHeight: 40, borderRadius: BorderRadius.md, paddingHorizontal: 11, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Glass.surfaceSoft, borderWidth: 1, borderColor: Glass.border }, mediaButtonText: { color: Glass.text, fontSize: 11.5, fontWeight: '700' }, previewWrap: { height: 150, marginBottom: 10, borderRadius: BorderRadius.md, overflow: 'hidden', position: 'relative' }, preview: { width: '100%', height: '100%' }, clearMedia: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }, categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }, category: { borderRadius: BorderRadius.full, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: Glass.surfaceSoft, borderWidth: 1, borderColor: Glass.border }, categoryActive: { backgroundColor: '#A3E635', borderColor: '#A3E635' }, categoryText: { color: Glass.mutedText, fontSize: 10, fontWeight: '800' }, categoryTextActive: { color: '#14291E' }, publishButton: { minHeight: 44, borderRadius: BorderRadius.md, backgroundColor: '#A3E635', flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' }, publishText: { color: '#14291E', fontSize: 12.5, fontWeight: '900' }, empty: { color: Glass.mutedText, fontSize: 12 }, postRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)' }, postTitle: { color: Glass.text, fontSize: 12.5, fontWeight: '800' }, postSummary: { color: Glass.mutedText, fontSize: 10.5, marginTop: 2 }, remove: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'rgba(239,68,68,0.15)' }, note: { color: 'rgba(255,255,255,0.60)', fontSize: 10.5, lineHeight: 15, paddingHorizontal: 3 } });
