import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SensorData,
  AlertItemData,
  CropScanResult,
  KnowledgeArticle,
  CalendarEvent,
  GrowthRecord,
  INITIAL_SENSOR_DATA,
  MOCK_ALERTS,
  MOCK_CROP_DISEASES,
  MOCK_KNOWLEDGE_ARTICLES,
  MOCK_CALENDAR_EVENTS,
  MOCK_GROWTH_RECORDS,
  MOCK_DIGITAL_RECORDS,
  MOCK_AI_RESPONSES,
} from '@/services/mock-data';

import * as Location from 'expo-location';
import {
  fetchLatestSensorLogFromSupabase,
  fetchSystemSettingsFromSupabase,
  fetchContactsFromSupabase,
  addContactToSupabase,
  deleteContactFromSupabase,
  fetchCalendarEventsFromSupabase,
  createCalendarEventInSupabase,
  updateCalendarEventCompletionInSupabase,
  updateSystemSettingsInSupabase,
  mapDbLogToSensorData,
} from '@/services/supabase';
import { askGeminiAssistant, scanCropWithGemini } from '@/services/gemini';
import { fetchWeather, WeatherData } from '@/services/weather';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestionChips?: string[];
}

export interface FarmLocation {
  latitude: number;
  longitude: number;
  label: string;
  isGpsDetected?: boolean;
}

export interface SmsContact {
  id: number;
  phoneNumber: string;
}

interface AppContextType {
  // Sensor state
  sensorData: SensorData;
  toggleIrrigation: (overrideStatus?: 'ACTIVE' | 'IDLE') => void;
  setIrrigationMode: (mode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF') => void;
  toggleHydroPump: () => void;
  refreshSensors: () => Promise<void>;
  isRefreshing: boolean;
  isSupabaseConnected: boolean;

  // Alerts
  alerts: AlertItemData[];
  dismissAlert: (id: string) => void;
  executeAlertAction: (id: string) => void;
  unreadAlertsCount: number;

  // Scans
  scans: CropScanResult[];
  addScanResult: (diseaseKey: keyof typeof MOCK_CROP_DISEASES, customImageUri?: string) => CropScanResult;
  addScanResultFromAI: (aiResult: Omit<CropScanResult, 'id' | 'dateScanned'>, imageUri?: string) => CropScanResult;

  // Knowledge & Bookmarks
  articles: KnowledgeArticle[];
  bookmarkedArticleIds: string[];
  toggleBookmark: (id: string) => void;
  likeArticle: (id: string) => void;
  publishKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'likes' | 'readTime'>) => void;
  removeKnowledgeArticle: (id: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  toggleCalendarEventCompleted: (id: string) => Promise<void>;
  smsContacts: SmsContact[];
  smsIntervalMinutes: number;
  saveSmsInterval: (minutes: number) => Promise<boolean>;
  addSmsContact: (phoneNumber: string) => Promise<boolean>;
  removeSmsContact: (id: number) => Promise<boolean>;

  // Growth & Records
  growthRecords: GrowthRecord[];
  farmerNotes: typeof MOCK_DIGITAL_RECORDS.farmerNotes;
  addFarmerNote: (text: string) => void;

  // AI Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => Promise<string>;

  // Farmer info
  farmerProfile: {
    name: string;
    farmName: string;
    location: string;
    paddyArea: string;
    seminaNodeId: string;
    phone: string;
    fallbackPhone: string;
    emergencyContacts: string[];
    isOnline: boolean;
    smsFallbackActive: boolean;
  };
  smsFallbackActive: boolean;
  setSmsFallbackActive: (active: boolean) => void;

  // Weather
  weatherData: WeatherData | null;
  isWeatherLoading: boolean;
  farmLocation: FarmLocation;
  setFarmLocation: (loc: FarmLocation) => void;
  detectDeviceLocation: () => Promise<FarmLocation | null>;
  isLocatingGps: boolean;
  refreshWeather: (loc?: FarmLocation) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default fallback: Science City of Muñoz, Nueva Ecija
const DEFAULT_FARM_LOCATION: FarmLocation = {
  latitude: 15.7167,
  longitude: 120.9000,
  label: 'Science City of Muñoz, Nueva Ecija',
  isGpsDetected: false,
};

const GPS_REUSE_WINDOW_MS = 60 * 1000;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sensorData, setSensorData] = useState<SensorData>(INITIAL_SENSOR_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [alerts, setAlerts] = useState<AlertItemData[]>(MOCK_ALERTS);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [farmLocation, setFarmLocationState] = useState<FarmLocation>(DEFAULT_FARM_LOCATION);
  const farmLocationRef = useRef<FarmLocation>(DEFAULT_FARM_LOCATION);
  const gpsRequestRef = useRef<Promise<FarmLocation | null> | null>(null);
  const lastGpsLocationRef = useRef<{ location: FarmLocation; detectedAt: number } | null>(null);
  const hasRequestedInitialLocationRef = useRef(false);
  const [scans, setScans] = useState<CropScanResult[]>([
    {
      id: 'scan-init-1',
      dateScanned: '2026-08-25 10:14 AM',
      ...MOCK_CROP_DISEASES.rice_blast,
      imageUri: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'scan-init-2',
      dateScanned: '2026-08-22 03:40 PM',
      ...MOCK_CROP_DISEASES.healthy_leaf,
      imageUri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    },
  ]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>(MOCK_KNOWLEDGE_ARTICLES);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(['know-01', 'know-02']);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(MOCK_GROWTH_RECORDS);
  const [farmerNotes, setFarmerNotes] = useState(MOCK_DIGITAL_RECORDS.farmerNotes);
  const [smsFallbackActive, setSmsFallbackActive] = useState(true);
  const [smsContacts, setSmsContacts] = useState<SmsContact[]>([]);
  const [smsIntervalMinutes, setSmsIntervalMinutes] = useState(60);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Mabuhay! Ako si TALA AI, ang iyong tagapayo sa bukid at kaagapay ng Project SEMINA. May maitutulong ba ako sa iyong patubig, peste sa palay, o kalendaryo ngayon?',
      timestamp: '9:00 AM',
      suggestionChips: [
        'Kumusta ang lupa sa palayan?',
        'Ano ang gamot sa Brown Spot?',
        'Kailan dapat mag-spray ng Kakawate?',
        'Paano gamitin ang AWD mode?',
      ],
    },
  ]);

  const [farmerProfile, setFarmerProfile] = useState({
    name: 'Juan Dela Cruz',
    farmName: 'Bukid Pag-asa (Paddy 1 & 2)',
    location: 'Science City of Muñoz, Nueva Ecija',
    paddyArea: '2.5 Hectares (Hybrid Palay)',
    seminaNodeId: 'SEMINA-ESP32-NODE-01',
    phone: '+63 908 668 8535',
    fallbackPhone: '+63 928 878 1740',
    emergencyContacts: ['+63 908 668 8535', '+63 928 878 1740'],
    isOnline: true,
    smsFallbackActive: true,
  });

  // Fetch telemetry from Supabase
  const loadSupabaseData = async () => {
    try {
      const [dbLog, sysSettings, dbContacts] = await Promise.all([
        fetchLatestSensorLogFromSupabase(),
        fetchSystemSettingsFromSupabase(),
        fetchContactsFromSupabase(),
      ]);

      if (dbLog) {
        setIsSupabaseConnected(true);
        const activeMode = (sysSettings?.mode as 'AUTO' | 'ON' | 'OFF' | 'MANUAL') || 'AUTO';
        const mapped = mapDbLogToSensorData(dbLog, activeMode);
        setSensorData((prev) => ({
          ...prev,
          ...mapped,
          hydroponics: {
            ...prev.hydroponics,
            ...(mapped.hydroponics || {}),
          },
        }));
      }

      if (sysSettings?.sms_interval_minutes) {
        setSmsIntervalMinutes(sysSettings.sms_interval_minutes);
      }

      if (dbContacts && dbContacts.length > 0) {
        setSmsContacts(dbContacts.map((contact) => ({ id: contact.id, phoneNumber: contact.phone_number })));
        setFarmerProfile((prev) => ({
          ...prev,
          emergencyContacts: dbContacts.map((contact) => contact.phone_number),
          phone: dbContacts[0].phone_number,
          fallbackPhone: dbContacts[1]?.phone_number || dbContacts[0].phone_number,
        }));
      }
    } catch (err) {
      console.warn('Error syncing Supabase data in AppContext:', err);
    }
  };

  // Weather fetch
  const refreshWeather = useCallback(async (loc?: FarmLocation) => {
    const target = loc ?? farmLocationRef.current;
    setIsWeatherLoading(true);
    try {
      const data = await fetchWeather(target.latitude, target.longitude);
      if (data) setWeatherData(data);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  const setFarmLocation = useCallback((loc: FarmLocation) => {
    farmLocationRef.current = loc;
    setFarmLocationState(loc);
    void refreshWeather(loc);
  }, [refreshWeather]);

  // Detect real GPS location of the phone
  const detectDeviceLocation = useCallback((): Promise<FarmLocation | null> => {
    if (gpsRequestRef.current) return gpsRequestRef.current;

    const previousLocation = lastGpsLocationRef.current;
    if (previousLocation && Date.now() - previousLocation.detectedAt < GPS_REUSE_WINDOW_MS) {
      return Promise.resolve(previousLocation.location);
    }

    const request = (async (): Promise<FarmLocation | null> => {
      try {
        setIsLocatingGps(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Location permission not granted by user');
          return null;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const lat = Number(loc.coords.latitude.toFixed(4));
        const lon = Number(loc.coords.longitude.toFixed(4));

        let label = `GPS: ${lat}, ${lon}`;
        try {
          const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          if (geocode && geocode.length > 0) {
            const item = geocode[0];
            const city = item.city || item.subregion || item.district || item.name || 'Aking Sakahan';
            const region = item.region || item.country || '';
            label = region ? `${city}, ${region}` : city;
          }
        } catch (geoErr) {
          console.warn('Reverse geocode error:', geoErr);
        }

        const detectedLocation: FarmLocation = {
          latitude: lat,
          longitude: lon,
          label,
          isGpsDetected: true,
        };

        farmLocationRef.current = detectedLocation;
        lastGpsLocationRef.current = { location: detectedLocation, detectedAt: Date.now() };
        setFarmLocationState(detectedLocation);
        await refreshWeather(detectedLocation);
        return detectedLocation;
      } catch (err) {
        console.warn('Failed to detect device location:', err);
        return null;
      } finally {
        setIsLocatingGps(false);
      }
    })();

    gpsRequestRef.current = request;
    void request.finally(() => {
      if (gpsRequestRef.current === request) gpsRequestRef.current = null;
    });
    return request;
  }, [refreshWeather]);

  // Initial fetch and 5s polling timer
  useEffect(() => {
    loadSupabaseData();
    const interval = setInterval(() => {
      loadSupabaseData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void fetchCalendarEventsFromSupabase().then((events) => {
      if (events) setCalendarEvents(events);
    });
  }, []);

  // Request GPS once on startup, then refresh weather every 30 minutes.
  useEffect(() => {
    if (!hasRequestedInitialLocationRef.current) {
      hasRequestedInitialLocationRef.current = true;
      void detectDeviceLocation().then((detected) => {
        if (!detected) void refreshWeather();
      });
    }
    const weatherInterval = setInterval(() => refreshWeather(), 30 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, [detectDeviceLocation, refreshWeather]);

  const refreshSensors = async () => {
    setIsRefreshing(true);
    await loadSupabaseData();
    setIsRefreshing(false);
  };

  const toggleIrrigation = (overrideStatus?: 'ACTIVE' | 'IDLE') => {
    setSensorData((prev) => {
      const nextStatus = overrideStatus || (prev.irrigationStatus === 'ACTIVE' ? 'IDLE' : 'ACTIVE');
      const targetMode = nextStatus === 'ACTIVE' ? 'ON' : 'OFF';
      updateSystemSettingsInSupabase(targetMode);
      return {
        ...prev,
        irrigationStatus: nextStatus,
        irrigationMode: targetMode,
        lastUpdated: 'Updated via TALA (Supabase Sync)',
      };
    });
  };

  const setIrrigationMode = (mode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF') => {
    setSensorData((prev) => ({
      ...prev,
      irrigationMode: mode,
    }));
    updateSystemSettingsInSupabase(mode);
  };

  const toggleHydroPump = () => {
    setSensorData((prev) => ({
      ...prev,
      hydroponics: {
        ...prev.hydroponics,
        pumpStatus: prev.hydroponics.pumpStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING',
      },
    }));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const executeAlertAction = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, actionDone: true, description: `${a.description} (Isinagawa na)` } : a))
    );
    // If it's a water action, trigger irrigation
    const target = alerts.find((a) => a.id === id);
    if (target?.category === 'soil' || target?.category === 'water') {
      toggleIrrigation('ACTIVE');
    }
  };

  const addScanResult = (diseaseKey: keyof typeof MOCK_CROP_DISEASES, customImageUri?: string) => {
    const template = MOCK_CROP_DISEASES[diseaseKey] || MOCK_CROP_DISEASES.healthy_leaf;
    const newScan: CropScanResult = {
      id: `scan-${Date.now()}`,
      dateScanned: 'Just now',
      ...template,
      imageUri: customImageUri || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    };
    setScans((prev) => [newScan, ...prev]);
    return newScan;
  };

  const addScanResultFromAI = (aiResult: Omit<CropScanResult, 'id' | 'dateScanned'>, imageUri?: string) => {
    const newScan: CropScanResult = {
      id: `scan-${Date.now()}`,
      dateScanned: 'Just now',
      ...aiResult,
      imageUri: imageUri || undefined,
    };
    setScans((prev) => [newScan, ...prev]);
    return newScan;
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const likeArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, likes: art.likes + 1 } : art))
    );
  };

  const publishKnowledgeArticle = (article: Omit<KnowledgeArticle, 'id' | 'likes' | 'readTime'>) => {
    setArticles((prev) => [{
      ...article,
      id: `post-${Date.now()}`,
      likes: 0,
      readTime: `${Math.max(1, Math.ceil(article.content.split(/\s+/).length / 180))} min read`,
    }, ...prev]);
  };

  const removeKnowledgeArticle = (id: string) => {
    if (!id.startsWith('post-')) return;
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const savedEvent = await createCalendarEventInSupabase(event);
    if (!savedEvent) return;
    setCalendarEvents((prev) => [...prev, savedEvent]);
  };

  const toggleCalendarEventCompleted = async (id: string) => {
    const event = calendarEvents.find((item) => item.id === id);
    if (!event) return;

    const completed = !event.completed;
    setCalendarEvents((prev) => prev.map((item) => (item.id === id ? { ...item, completed } : item)));
    const savedEvent = await updateCalendarEventCompletionInSupabase(id, completed);
    if (!savedEvent) {
      setCalendarEvents((prev) => prev.map((item) => (item.id === id ? { ...item, completed: event.completed } : item)));
      return;
    }
    setCalendarEvents((prev) => prev.map((item) => (item.id === id ? savedEvent : item)));
  };

  const saveSmsInterval = async (minutes: number) => {
    const validMinutes = Math.round(minutes);
    if (validMinutes < 5 || validMinutes > 1440) return false;
    const saved = await updateSystemSettingsInSupabase(sensorData.irrigationMode, validMinutes);
    if (saved) setSmsIntervalMinutes(validMinutes);
    return saved;
  };

  const addSmsContact = async (phoneNumber: string) => {
    const normalizedPhone = phoneNumber.trim();
    if (!/^\+?[0-9\s-]{7,20}$/.test(normalizedPhone)) return false;
    const contact = await addContactToSupabase(normalizedPhone);
    if (!contact) return false;
    setSmsContacts((prev) => [...prev, { id: contact.id, phoneNumber: contact.phone_number }]);
    setFarmerProfile((prev) => ({ ...prev, emergencyContacts: [...prev.emergencyContacts, contact.phone_number] }));
    return true;
  };

  const removeSmsContact = async (id: number) => {
    const contact = smsContacts.find((item) => item.id === id);
    if (!contact) return false;
    const deleted = await deleteContactFromSupabase(id);
    if (!deleted) return false;
    setSmsContacts((prev) => prev.filter((item) => item.id !== id));
    setFarmerProfile((prev) => ({ ...prev, emergencyContacts: prev.emergencyContacts.filter((phone) => phone !== contact.phoneNumber) }));
    return true;
  };

  const addFarmerNote = (text: string) => {
    const newNote = {
      id: `fn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: farmerProfile.name,
      text,
    };
    setFarmerNotes((prev) => [newNote, ...prev]);
  };

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Try Gemini API first
    const history = chatMessages.map((m) => ({ sender: m.sender, text: m.text }));
    const geminiReply = await askGeminiAssistant(text, history, sensorData);

    if (geminiReply) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: geminiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return geminiReply;
    }

    // Offline fallback using mock responses
    await new Promise((resolve) => setTimeout(resolve, 500));
    let reply = MOCK_AI_RESPONSES.general;
    const lower = text.toLowerCase();
    if (lower.includes('lupa') || lower.includes('moisture') || lower.includes('tubig') || lower.includes('water')) {
      reply = MOCK_AI_RESPONSES.water;
    } else if (lower.includes('peste') || lower.includes('brown spot') || lower.includes('blast') || lower.includes('sakit')) {
      reply = MOCK_AI_RESPONSES.pest;
    } else if (lower.includes('kakawate') || lower.includes('pataba') || lower.includes('fertilizer') || lower.includes('compost')) {
      reply = MOCK_AI_RESPONSES.fertilizer;
    } else if (lower.includes('hydroponic') || lower.includes('ph') || lower.includes('pump')) {
      reply = MOCK_AI_RESPONSES.hydroponics;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, botMsg]);
    return reply;
  };

  const unreadAlertsCount = alerts.filter((a) => !a.actionDone).length;

  return (
    <AppContext.Provider
      value={{
        sensorData,
        toggleIrrigation,
        setIrrigationMode,
        toggleHydroPump,
        refreshSensors,
        isRefreshing,
        isSupabaseConnected,
        alerts,
        dismissAlert,
        executeAlertAction,
        unreadAlertsCount,
        scans,
        addScanResult,
        addScanResultFromAI,
        articles,
        bookmarkedArticleIds,
        toggleBookmark,
        likeArticle,
        publishKnowledgeArticle,
        removeKnowledgeArticle,
        calendarEvents,
        addCalendarEvent,
        toggleCalendarEventCompleted,
        smsContacts,
        smsIntervalMinutes,
        saveSmsInterval,
        addSmsContact,
        removeSmsContact,
        growthRecords,
        farmerNotes,
        addFarmerNote,
        chatMessages,
        sendMessage,
        farmerProfile,
        smsFallbackActive,
        setSmsFallbackActive,
        weatherData,
        isWeatherLoading,
        farmLocation,
        setFarmLocation,
        detectDeviceLocation,
        isLocatingGps,
        refreshWeather,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
