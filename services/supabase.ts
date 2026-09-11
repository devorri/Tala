import { createClient } from '@supabase/supabase-js';
import { File } from 'expo-file-system';
import { CalendarEvent, SensorData } from './mock-data';

export const SUPABASE_URL = 'https://cbemiapawndbrqcniwid.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZW1pYXBhd25kYnJxY25pd2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTkxNjMsImV4cCI6MjEwNDQ3NTE2M30.TW4bLXaojKZSavj_s4AGsF9JO-Cj3pmxCyDCI30txPY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Upload a feed image to the existing Supabase Storage bucket named `Files`. */
export async function uploadKnowledgeMediaToSupabase(uri: string): Promise<string | null> {
  try {
    const extension = uri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    const contentType = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
    const objectPath = `knowledge/${Date.now()}.${extension}`;
    const file = new File(uri);
    const bytes = await file.arrayBuffer();
    const { error } = await supabase.storage.from('Files').upload(objectPath, bytes, { contentType, upsert: false });
    if (error) {
      console.warn('Supabase Storage upload error (Files):', error.message);
      return null;
    }
    const { data } = supabase.storage.from('Files').getPublicUrl(objectPath);
    return data.publicUrl;
  } catch (error) {
    console.warn('Knowledge media upload failed:', error);
    return null;
  }
}

export interface DbSensorLog {
  id: number;
  created_at: string;
  ph_value: number | null;
  soil_moisture: number | null;
  water_level: number | null;
  pump_status: boolean | null;
  humidity: number | null;
  temperature: number | null;
}

export interface DbSystemSettings {
  id: number;
  mode: string;
  updated_at: string;
  sms_interval_minutes: number;
}

export interface DbContact {
  id: number;
  phone_number: string;
  created_at: string;
}

interface DbCalendarEvent {
  id: number;
  event_date: string;
  title: string;
  event_type: CalendarEvent['type'];
  description: string;
  event_time: string | null;
  stage: string | null;
  synced_with_google: boolean;
  completed: boolean;
}

function mapDbCalendarEvent(event: DbCalendarEvent): CalendarEvent {
  return {
    id: String(event.id),
    date: event.event_date,
    title: event.title,
    type: event.event_type,
    description: event.description,
    time: event.event_time ?? undefined,
    stage: event.stage ?? undefined,
    syncedWithGoogle: event.synced_with_google,
    completed: event.completed ?? false,
  };
}

export async function fetchCalendarEventsFromSupabase(): Promise<CalendarEvent[] | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error (calendar_events):', error.message);
      return null;
    }

    return (data as DbCalendarEvent[]).map(mapDbCalendarEvent);
  } catch (err) {
    console.warn('Network error fetching Supabase calendar events:', err);
    return null;
  }
}

export async function createCalendarEventInSupabase(
  event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        event_date: event.date,
        title: event.title,
        event_type: event.type,
        description: event.description,
        event_time: event.time ?? null,
        stage: event.stage ?? null,
        synced_with_google: event.syncedWithGoogle,
        completed: event.completed ?? false,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert error (calendar_events):', error.message);
      return null;
    }

    return mapDbCalendarEvent(data as DbCalendarEvent);
  } catch (err) {
    console.warn('Network error creating Supabase calendar event:', err);
    return null;
  }
}

export async function updateCalendarEventCompletionInSupabase(
  id: string,
  completed: boolean
): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('Supabase update error (calendar_events):', error.message);
      return null;
    }

    return mapDbCalendarEvent(data as DbCalendarEvent);
  } catch (err) {
    console.warn('Network error updating calendar event:', err);
    return null;
  }
}

/**
 * Fetch the latest live sensor reading from Supabase `sensor_logs`
 */
export async function fetchLatestSensorLogFromSupabase(): Promise<DbSensorLog | null> {
  try {
    const { data, error } = await supabase
      .from('sensor_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.warn('Supabase fetch error (sensor_logs):', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Network error fetching Supabase sensor logs:', err);
    return null;
  }
}

/**
 * Fetch system settings from Supabase `system_settings` (id = 1)
 */
export async function fetchSystemSettingsFromSupabase(): Promise<DbSystemSettings | null> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error (system_settings):', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Network error fetching Supabase system settings:', err);
    return null;
  }
}

/**
 * Update pump mode / settings in Supabase `system_settings` (id = 1)
 */
export async function updateSystemSettingsInSupabase(
  mode: 'AUTO' | 'ON' | 'OFF' | 'MANUAL',
  smsIntervalMinutes?: number
): Promise<boolean> {
  try {
    const payload: { mode: string; updated_at: string; sms_interval_minutes?: number } = {
      mode: mode.toUpperCase(),
      updated_at: new Date().toISOString(),
    };
    if (smsIntervalMinutes !== undefined) {
      payload.sms_interval_minutes = smsIntervalMinutes;
    }

    const { error } = await supabase.from('system_settings').update(payload).eq('id', 1);

    if (error) {
      console.error('Failed to update system_settings on Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error updating system settings:', err);
    return false;
  }
}

/**
 * Fetch all registered contact phone numbers from Supabase `contacts`
 */
export async function fetchContactsFromSupabase(): Promise<DbContact[]> {
  try {
    const { data, error } = await supabase.from('contacts').select('id, phone_number, created_at').order('id');
    if (error || !data) {
      return [];
    }
    return data as DbContact[];
  } catch {
    return [];
  }
}

/**
 * Add a contact phone number to Supabase `contacts`
 */
export async function addContactToSupabase(phoneNumber: string): Promise<DbContact | null> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ phone_number: phoneNumber }])
      .select('id, phone_number, created_at')
      .single();
    if (error) {
      console.error('Failed to add contact to Supabase:', error.message);
      return null;
    }
    return data as DbContact;
  } catch (err) {
    console.error('Network error adding contact:', err);
    return null;
  }
}

export async function deleteContactFromSupabase(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete contact from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error deleting contact:', err);
    return false;
  }
}

/**
 * Convert a DbSensorLog record into application SensorData structure
 */
export function mapDbLogToSensorData(
  dbLog: DbSensorLog,
  currentMode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF' = 'AUTO'
): Partial<SensorData> {
  const phVal = dbLog.ph_value ?? 7.0;
  const soilMoisture = dbLog.soil_moisture ?? 50;
  const waterLevel = dbLog.water_level ?? 50;
  const temp = dbLog.temperature ?? 30.0;
  const hum = dbLog.humidity ?? 70;
  const isPumpOn = !!dbLog.pump_status;

  const dateStr = dbLog.created_at
    ? new Date(dbLog.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return {
    temperature: temp,
    humidity: hum,
    soilMoisture: soilMoisture,
    soilMoistureStatus: soilMoisture < 30 ? 'dry' : soilMoisture > 85 ? 'oversaturated' : 'optimal',
    waterLevel: waterLevel,
    waterLevelStatus: waterLevel < 20 ? 'low' : 'normal',
    irrigationStatus: isPumpOn ? 'ACTIVE' : 'IDLE',
    irrigationMode: currentMode,
    lastUpdated: `Live Telemetry • ${dateStr}`,
    farEndReached: waterLevel >= 20,
    localPoolingDetected: soilMoisture >= 85,
    hydroponics: {
      pH: +phVal.toFixed(2),
      pHStatus: phVal < 5.8 ? 'acidic' : phVal > 7.8 ? 'alkaline' : 'optimal',
      ecNutrients: 980,
      waterTemp: +(temp - 6).toFixed(1),
      pumpStatus: isPumpOn ? 'RUNNING' : 'PAUSED',
      waterLevel: waterLevel,
    },
  };
}
