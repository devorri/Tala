/**
 * TALA Weather Service
 * Uses Open-Meteo (https://open-meteo.com/) — free, no API key required.
 * Provides current conditions + 7-day daily + 12-hour hourly forecast.
 */

export interface HourlyForecast {
  time: string;
  temp: number;
  rainPct: number;
  weatherCode: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  rainPct: number;
  weatherCode: number;
  icon: string;
  conditionTagalog: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainPct: number;
  weatherCode: number;
  conditionTagalog: string;
  icon: string;
  isDay: boolean;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  fetchedAt: string;
}

// WMO Weather Interpretation Codes → Tagalog + SF Symbol
const WMO_MAP: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Malinaw na Langit',           icon: 'sun.max' },
  1:  { label: 'Bahagyang Maulap',             icon: 'sun.max' },
  2:  { label: 'Kalat-kalat na Ulap',          icon: 'cloud.sun' },
  3:  { label: 'Maulap',                       icon: 'cloud' },
  45: { label: 'Ulap na Ambon',                icon: 'cloud.fog' },
  48: { label: 'Hamog (Freezing Fog)',          icon: 'cloud.fog' },
  51: { label: 'Bahagyang Ambon',              icon: 'cloud.drizzle' },
  53: { label: 'Katamtamang Ambon',            icon: 'cloud.drizzle' },
  55: { label: 'Malakas na Ambon',             icon: 'cloud.drizzle' },
  61: { label: 'Bahagyang Ulan',               icon: 'cloud.rain' },
  63: { label: 'Katamtamang Ulan',             icon: 'cloud.rain' },
  65: { label: 'Malakas na Ulan',              icon: 'cloud.heavyrain' },
  71: { label: 'Bahagyang Niyebe',             icon: 'cloud.snow' },
  73: { label: 'Katamtamang Niyebe',           icon: 'cloud.snow' },
  75: { label: 'Malakas na Niyebe',            icon: 'cloud.snow' },
  77: { label: 'Ulan-Yelo',                    icon: 'cloud.snow' },
  80: { label: 'Biglaang Ulan',                icon: 'cloud.rain' },
  81: { label: 'Katamtamang Biglaang Ulan',    icon: 'cloud.rain' },
  82: { label: 'Malakas na Biglaang Ulan',     icon: 'cloud.heavyrain' },
  95: { label: 'Bagyo / Kulog at Kidlat',      icon: 'cloud.bolt.rain' },
  96: { label: 'Bagyo na may Yelo',            icon: 'cloud.bolt.rain' },
  99: { label: 'Malakas na Bagyo',             icon: 'cloud.bolt.rain' },
};

function wmoToTagalog(code: number): string {
  return WMO_MAP[code]?.label ?? 'Walang Datos';
}

function wmoToIcon(code: number): string {
  return WMO_MAP[code]?.icon ?? 'cloud';
}

/** Approximate Heat Index (Steadman) — temp °C + humidity % → feels-like °C */
function calcHeatIndex(tempC: number, rh: number): number {
  const T = tempC * 9 / 5 + 32;
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * rh -
    0.22475541 * T * rh -
    0.00683783 * T * T -
    0.05481717 * rh * rh +
    0.00122874 * T * T * rh +
    0.00085282 * T * rh * rh -
    0.00000199 * T * T * rh * rh;
  return Math.round((HI - 32) * 5 / 9);
}

function formatHour(isoStr: string): string {
  const d = new Date(isoStr);
  const h = d.getHours();
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

const DAY_NAMES = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];

function formatDay(isoDate: string, idx: number): string {
  if (idx === 0) return 'Ngayon';
  if (idx === 1) return 'Bukas';
  const d = new Date(isoDate);
  return DAY_NAMES[d.getDay()];
}

const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const WEATHER_RATE_LIMIT_BACKOFF_MS = 60 * 1000;

const weatherCache = new Map<string, { data: WeatherData; cachedAt: number }>();
const weatherRequests = new Map<string, Promise<WeatherData | null>>();
let weatherRetryAfter = 0;

function weatherCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

export function fetchWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  const key = weatherCacheKey(latitude, longitude);
  const cached = weatherCache.get(key);
  const now = Date.now();

  if (cached && now - cached.cachedAt < WEATHER_CACHE_TTL_MS) {
    return Promise.resolve(cached.data);
  }

  if (now < weatherRetryAfter) {
    return Promise.resolve(cached?.data ?? null);
  }

  const inFlightRequest = weatherRequests.get(key);
  if (inFlightRequest) return inFlightRequest;

  const request = fetchWeatherFromApi(latitude, longitude).then((data) => {
    if (data) weatherCache.set(key, { data, cachedAt: Date.now() });
    return data;
  }).finally(() => {
    weatherRequests.delete(key);
  });

  weatherRequests.set(key, request);
  return request;
}

async function fetchWeatherFromApi(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation_probability',
        'weather_code',
        'wind_speed_10m',
        'uv_index',
      ].join(','),
      hourly: ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),
      timezone: 'Asia/Manila',
      forecast_days: '7',
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!res.ok) {
      if (res.status === 429) weatherRetryAfter = Date.now() + WEATHER_RATE_LIMIT_BACKOFF_MS;
      console.warn('[Weather] Open-Meteo fetch failed:', res.status);
      return null;
    }

    const json = await res.json();
    const c = json.current;

    const temperature = Math.round(c.temperature_2m);
    const humidity = Math.round(c.relative_humidity_2m);
    const feelsLike = calcHeatIndex(temperature, humidity);
    const windSpeed = Math.round(c.wind_speed_10m);
    const uvIndex = Math.round(c.uv_index ?? 0);
    const rainPct = Math.round(c.precipitation_probability ?? 0);
    const weatherCode: number = c.weather_code;
    const isDay: boolean = c.is_day === 1;

    // Hourly: next 12 from current hour
    const hourlyTimes: string[] = json.hourly.time ?? [];
    const hourlyTemps: number[] = json.hourly.temperature_2m ?? [];
    const hourlyRain: number[] = json.hourly.precipitation_probability ?? [];
    const hourlyCodes: number[] = json.hourly.weather_code ?? [];

    const nowHour = new Date().getHours();
    const startIdx = hourlyTimes.findIndex((t: string) => new Date(t).getHours() === nowHour);
    const safeStart = startIdx === -1 ? 0 : startIdx;

    const hourly: HourlyForecast[] = [];
    for (let i = safeStart; i < Math.min(safeStart + 12, hourlyTimes.length); i++) {
      hourly.push({
        time: formatHour(hourlyTimes[i]),
        temp: Math.round(hourlyTemps[i]),
        rainPct: Math.round(hourlyRain[i] ?? 0),
        weatherCode: hourlyCodes[i],
        icon: wmoToIcon(hourlyCodes[i]),
      });
    }

    // Daily: 7 days
    const dailyDates: string[] = json.daily.time ?? [];
    const dailyCodes: number[] = json.daily.weather_code ?? [];
    const dailyMax: number[] = json.daily.temperature_2m_max ?? [];
    const dailyMin: number[] = json.daily.temperature_2m_min ?? [];
    const dailyRain: number[] = json.daily.precipitation_probability_max ?? [];

    const daily: DailyForecast[] = dailyDates.map((date: string, idx: number) => ({
      day: formatDay(date, idx),
      high: Math.round(dailyMax[idx]),
      low: Math.round(dailyMin[idx]),
      rainPct: Math.round(dailyRain[idx] ?? 0),
      weatherCode: dailyCodes[idx],
      icon: wmoToIcon(dailyCodes[idx]),
      conditionTagalog: wmoToTagalog(dailyCodes[idx]),
    }));

    const fetchedAt = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

    return {
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      uvIndex,
      rainPct,
      weatherCode,
      conditionTagalog: wmoToTagalog(weatherCode),
      icon: wmoToIcon(weatherCode),
      isDay,
      hourly,
      daily,
      fetchedAt,
    };
  } catch (err) {
    console.warn('[Weather] fetchWeather error:', err);
    return null;
  }
}
