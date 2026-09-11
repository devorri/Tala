import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { BrandColors, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';

export type ButtonVariant = 'primary' | 'teal' | 'yellow' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BrandButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconSymbolName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function BrandButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: BrandButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#CBD5E1';
    switch (variant) {
      case 'primary':
        return BrandColors.primaryBlue;
      case 'teal':
        return BrandColors.tealGreen;
      case 'yellow':
        return BrandColors.goldenYellow;
      case 'danger':
        return BrandColors.danger;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return BrandColors.primaryBlue;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    switch (variant) {
      case 'primary':
      case 'teal':
      case 'danger':
        return BrandColors.white;
      case 'yellow':
        return BrandColors.charcoal;
      case 'outline':
        return BrandColors.primaryBlue;
      case 'ghost':
        return BrandColors.slate;
      default:
        return BrandColors.white;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? '#CBD5E1' : BrandColors.primaryBlue;
    }
    return 'transparent';
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 38;
      case 'lg':
        return 54;
      default:
        return 46;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 13;
      case 'lg':
        return 16;
      default:
        return 14;
    }
  };

  const iconColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          paddingHorizontal: size === 'sm' ? 14 : size === 'lg' ? 24 : 18,
        },
        variant !== 'ghost' && variant !== 'outline' && !disabled && Shadows.subtle,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <IconSymbol name={icon} size={iconSize} color={iconColor} style={{ marginRight: 6 }} />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: variant === 'yellow' ? '800' : '700',
              },
              textStyle,
            ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <IconSymbol name={icon} size={iconSize} color={iconColor} style={{ marginLeft: 6 }} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.2,
  },
});
