import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle | ViewStyle[];
  direction?: 'up' | 'down' | 'none';
}

export function AnimatedCard({
  children,
  delay = 0,
  duration = 450,
  style,
  direction = 'up',
}: AnimatedCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transAnim = useRef(
    new Animated.Value(direction === 'up' ? 16 : direction === 'down' ? -16 : 0)
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(transAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, fadeAnim, transAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: transAnim }],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
