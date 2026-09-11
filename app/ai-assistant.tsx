import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AudioModule, RecordingPresets, createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import * as Speech from 'expo-speech';
import { BrandColors, Glass, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { generateGeminiSpeechFile, transcribeVoiceWithGemini } from '@/services/gemini';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { ChatBubble } from '@/components/ui/ChatBubble';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FarmScreen } from '@/components/ui/FarmScreen';

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'speaking';
type ObservableAudioPlayer = AudioPlayer & {
  addListener: (event: 'playbackStatusUpdate', listener: (status: AudioStatus) => void) => { remove: () => void };
};

export default function AiAssistantScreen() {
  const { chatMessages, sendMessage } = useApp();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [lastTranscript, setLastTranscript] = useState('');
  const [preferredVoice, setPreferredVoice] = useState<string | undefined>();
  const scrollViewRef = useRef<ScrollView>(null);
  const speechRunId = useRef(0);
  const geminiPlayer = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  useEffect(() => () => {
    Speech.stop();
    geminiPlayer.current?.remove();
  }, []);

  useEffect(() => {
    const chooseBestInstalledVoice = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const isFilipino = (voice: Speech.Voice) => /^(fil|tl)(-|$)/i.test(voice.language);
        const enhancedFilipino = voices.find((voice) => isFilipino(voice) && voice.quality === Speech.VoiceQuality.Enhanced);
        const filipino = voices.find(isFilipino);
        // Never force an English voice for Tagalog. If Filipino is unavailable,
        // let the operating system choose its own best fallback voice instead.
        setPreferredVoice((enhancedFilipino || filipino)?.identifier);
      } catch (error) {
        console.warn('Could not load device voices:', error);
      }
    };
    void chooseBestInstalledVoice();
  }, []);

  const speakAnswer = async (answer: string) => {
    const runId = ++speechRunId.current;
    const geminiAudioUri = await generateGeminiSpeechFile(answer);
    if (geminiAudioUri && speechRunId.current === runId) {
      await Speech.stop();
      geminiPlayer.current?.remove();
      const player = createAudioPlayer(geminiAudioUri) as ObservableAudioPlayer;
      geminiPlayer.current = player;
      await new Promise<void>((resolve) => {
        const subscription = player.addListener('playbackStatusUpdate', (status) => {
          if (status.didJustFinish || speechRunId.current !== runId) {
            subscription.remove();
            resolve();
          }
        });
        player.play();
      });
      player.remove();
      if (geminiPlayer.current === player) geminiPlayer.current = null;
      return;
    }
    const cleaned = answer
      .replace(/\bAWD\b/g, 'A W D')
      .replace(/%/g, ' porsiyento')
      .replace(/°C/g, ' degrees Celsius')
      .replace(/\s+/g, ' ')
      .trim();
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [cleaned];
    const chunks = sentences.flatMap((sentence) => sentence.length <= 220 ? [sentence] : sentence.match(/.{1,180}(?:\s|$)/g) || [sentence]);

    await Speech.stop();
    for (const chunk of chunks) {
      if (speechRunId.current !== runId) break;
      await new Promise<void>((resolve) => {
        Speech.speak(chunk, {
          language: 'fil-PH',
          voice: preferredVoice,
          rate: 0.68,
          pitch: 0.98,
          useApplicationAudioSession: false,
          onDone: resolve,
          onStopped: resolve,
          onError: () => resolve(),
        });
      });
    }
  };

  const stopSpeaking = async () => {
    speechRunId.current += 1;
    await Speech.stop();
    if (geminiPlayer.current) {
      geminiPlayer.current.pause();
      geminiPlayer.current.remove();
      geminiPlayer.current = null;
    }
    setVoiceState('idle');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    void sendMessage(suggestion).then(speakAnswer);
  };

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Kailangan ang mikropono', 'Pahintulutan ang TALA na gumamit ng mikropono para makapagtanong gamit ang boses.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setVoiceState('recording');
    } catch (error) {
      console.warn('Could not start voice recording:', error);
      Alert.alert('Hindi makapagre-record', 'Subukan muli at tiyaking may pahintulot ang mikropono.');
      setVoiceState('idle');
    }
  };

  const stopAndAsk = async () => {
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      const audioUri = recorder.uri;
      if (!audioUri) throw new Error('No recording URI');
      setVoiceState('transcribing');
      const transcript = await transcribeVoiceWithGemini(audioUri);
      if (!transcript) {
        Alert.alert('Hindi nakuha ang tanong', 'Hindi namin naintindihan ang recording. Subukang magsalita nang mas malinaw at maikli.');
        return;
      }
      setLastTranscript(transcript);
      setVoiceState('speaking');
      const answer = await sendMessage(transcript);
      await speakAnswer(answer);
    } catch (error) {
      console.warn('Could not process voice question:', error);
      Alert.alert('May problema sa voice assistant', 'Hindi naiproseso ang recording. Subukan muli.');
    } finally { setVoiceState('idle'); }
  };

  const handleVoicePress = () => {
    if (recorderState.isRecording || voiceState === 'recording') void stopAndAsk();
    else if (voiceState === 'speaking') void stopSpeaking();
    else if (voiceState === 'idle') void startRecording();
  };

  const isBusy = voiceState === 'transcribing';
  const prompt = voiceState === 'recording'
    ? 'Nakikinig… i-tap muli kapag tapos ka nang magsalita.'
    : voiceState === 'transcribing' ? 'Inaayos ang iyong tanong…'
      : voiceState === 'speaking' ? 'Sumasagot si TALA…'
        : 'I-tap ang mikropono at itanong ang kailangan mo sa bukid.';

  return (
    <FarmScreen>
      <View style={styles.container}>
        <GradientHeader title="TALA AI Agri-Tagapayo" subtitle="Voice-first na kaagapay sa bukid" showBack gradientVariant="tealToYellow" />
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {chatMessages.map((msg) => <ChatBubble key={msg.id} message={msg} onSelectSuggestion={handleSelectSuggestion} />)}
        </ScrollView>
        <View style={[styles.voicePanel, Shadows.medium]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, voiceState === 'recording' && styles.statusDotActive]} />
            <Text style={styles.statusText}>{prompt}</Text>
          </View>
          {lastTranscript ? <Text style={styles.transcript}>Narinig ko: “{lastTranscript}”</Text> : null}
          <TouchableOpacity onPress={handleVoicePress} disabled={isBusy} style={[styles.voiceButton, voiceState === 'recording' && styles.voiceButtonRecording, isBusy && styles.voiceButtonBusy]} activeOpacity={0.8}>
            <IconSymbol name={voiceState === 'speaking' ? 'close' : 'mic'} size={31} color={BrandColors.white} />
          </TouchableOpacity>
          <Text style={styles.tapLabel}>{voiceState === 'recording' ? 'TAPOS NA AKO' : voiceState === 'speaking' ? 'IHINTO ANG PAGSALITA' : isBusy ? 'SANDALI LANG' : 'MAGSALITA SA TALA'}</Text>
        </View>
      </View>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.lg },
  voicePanel: { backgroundColor: Glass.surfaceStrong, borderTopWidth: 1, borderTopColor: Glass.border, paddingHorizontal: Spacing.lg, paddingTop: 14, paddingBottom: Platform.OS === 'ios' ? 24 : 18, alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch', justifyContent: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Glass.mutedText },
  statusDotActive: { backgroundColor: BrandColors.danger },
  statusText: { color: Glass.text, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  transcript: { color: Glass.mutedText, fontSize: 11.5, fontStyle: 'italic', textAlign: 'center', marginTop: 7 },
  voiceButton: { width: 68, height: 68, borderRadius: 34, marginTop: 12, backgroundColor: BrandColors.primaryBlue, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  voiceButtonRecording: { backgroundColor: BrandColors.danger },
  voiceButtonBusy: { opacity: 0.55 },
  tapLabel: { color: Glass.mutedText, fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8, marginTop: 7 },
});
