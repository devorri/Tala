import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors, BorderRadius, Glass, Spacing, Shadows } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ChatMessage } from '@/context/AppContext';

interface ChatBubbleProps {
  message: ChatMessage;
  onSelectSuggestion?: (suggestion: string) => void;
}

export function ChatBubble({ message, onSelectSuggestion }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <IconSymbol name="sprout" size={16} color={BrandColors.white} />
        </View>
      )}

      <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.botBubble,
            Shadows.subtle,
          ]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {message.text}
          </Text>
        </View>

        <Text style={styles.timestamp}>{message.timestamp}</Text>

        {/* Suggestion Chips */}
        {message.suggestionChips && message.suggestionChips.length > 0 && (
          <View style={styles.suggestionsWrapper}>
            <Text style={styles.suggestionsLabel}>MGA MAAARING ITANONG (QUICK PROMPTS):</Text>
            <View style={styles.chipsRow}>
              {message.suggestionChips.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onSelectSuggestion?.(chip)}
                  style={styles.chip}
                  activeOpacity={0.7}>
                  <IconSymbol name="chat" size={12} color={BrandColors.primaryBlueDark} />
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
    gap: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BrandColors.tealGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '88%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    backgroundColor: BrandColors.primaryBlue,
    borderBottomRightRadius: BorderRadius.xs,
  },
  botBubble: {
    backgroundColor: Glass.surface,
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  userText: {
    color: BrandColors.white,
    fontWeight: '500',
  },
  botText: {
    color: Glass.text,
  },
  timestamp: {
    fontSize: 10,
    color: Glass.mutedText,
    marginTop: 3,
    paddingHorizontal: 4,
  },
  suggestionsWrapper: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  suggestionsLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Glass.mutedText,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontSize: 11.5,
    color: BrandColors.primaryBlueDark,
    fontWeight: '600',
  },
});
