// IconSymbol mapping using MaterialIcons for cross-platform compatibility

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

export const MAPPING = {
  // Navigation & Core
  'house.fill': 'home',
  'bell.fill': 'notifications',
  'doc.text.viewfinder': 'document-scanner',
  'calendar': 'event',
  'book.fill': 'menu-book',
  'person.fill': 'person',
  'paperplane.fill': 'send',
  
  // Agricultural & Sensors
  'water.drop': 'water-drop',
  'soil.moisture': 'grass',
  'thermostat': 'device-thermostat',
  'humidity': 'opacity',
  'pump': 'autorenew',
  'sprout': 'eco',
  'sun.max': 'wb-sunny',
  'cloud.rain': 'beach-access',
  'chemistry': 'science',
  'analytics': 'insights',
  'warning': 'warning',
  'check.circle': 'check-circle',
  'error': 'error',
  'info': 'info',
  
  // Features
  'camera': 'camera-alt',
  'mic': 'mic',
  'volume': 'volume-up',
  'play': 'play-arrow',
  'pause': 'pause',
  'chat': 'chat',
  'share': 'share',
  'cloud.sync': 'sync',
  'signal.cellular': 'cell-tower',
  'sms': 'sms',
  'bee': 'nature',
  'leaf': 'spa',
  'history': 'history',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.left.forwardslash.chevron.right': 'code',
  'arrow.back': 'arrow-back',
  'refresh': 'refresh',
  'settings': 'settings',
  'filter': 'tune',
  'search': 'search',
  // Weather details & Locations
  'mappin.circle.fill': 'location-on',
  'location': 'my-location',
  'chevron.down': 'keyboard-arrow-down',
  'plus': 'add',
  'checkmark': 'check',
  'cloud.sun': 'wb-cloudy',
  'cloud': 'cloud',
  'cloud.fog': 'cloud-queue',
  'cloud.drizzle': 'grain',
  'cloud.heavyrain': 'thunderstorm',
  'cloud.snow': 'ac-unit',
  'cloud.bolt.rain': 'thunderstorm',
  'close': 'close',
  'add': 'add',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  const iconName = (MAPPING[name] || 'help-outline') as ComponentProps<typeof MaterialIcons>['name'];
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
