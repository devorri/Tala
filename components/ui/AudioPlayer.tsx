import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AudioPlayerProps {
  title: string;
  speaker: string;
  duration?: string;
  audioUrl?: string;
}

export function AudioPlayer({ title, speaker, duration = '3:45 min', audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.25);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.05;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const waveformHeights = [14, 22, 34, 18, 28, 40, 24, 16, 32, 20, 10, 26, 36, 18, 30, 22, 14, 28];

  return (
    <View style={[styles.container, Shadows.subtle]}>
      <View style={styles.topRow}>
        <View style={styles.speakerInfo}>
          <Text style={styles.speakerLabel}>REKORD NG NAKATATANDA (ELDER AUDIO)</Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.speaker} numberOfLines={1}>
            Tinig ni: {speaker}
          </Text>
        </View>

        <TouchableOpacity
          onPress={togglePlay}
          style={[
            styles.playButton,
            { backgroundColor: isPlaying ? BrandColors.goldenYellow : BrandColors.primaryBlue },
          ]}
          activeOpacity={0.8}>
          <IconSymbol
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color={isPlaying ? BrandColors.charcoal : BrandColors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Waveform Visualization */}
      <View style={styles.waveformContainer}>
        {waveformHeights.map((h, idx) => {
          const isPassed = idx / waveformHeights.length <= progress;
          return (
            <View
              key={idx}
              style={[
                styles.waveformBar,
                {
                  height: isPlaying ? Math.max(8, h * (0.6 + Math.random() * 0.5)) : h,
                  backgroundColor: isPassed ? BrandColors.tealGreen : '#CBD5E1',
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.durationRow}>
        <Text style={styles.durationText}>{isPlaying ? 'Nagpe-play...' : 'Naka-pause'}</Text>
        <Text style={styles.durationText}>{duration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  speakerInfo: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  speakerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#A3E635',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Glass.text,
  },
  speaker: {
    fontSize: 11.5,
    color: Glass.mutedText,
    marginTop: 1,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  durationText: {
    fontSize: 10.5,
    color: Glass.mutedText,
    fontWeight: '600',
  },
});
