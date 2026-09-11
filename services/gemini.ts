import { SensorData, CropScanResult, SoilScanResult } from './mock-data';
import { File, Paths } from 'expo-file-system';

export async function askGeminiAssistant(
  prompt: string,
  chatHistory: { sender: 'user' | 'assistant'; text: string }[],
  sensorData?: SensorData,
  customApiKey?: string
): Promise<string | null> {
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    return null; // Fallback to offline mock responses if API key is not present
  }

  try {
    const systemInstruction = `Ikaw si TALA AI, ang matalinong tagapayo sa bukid at kaagapay ng Project SEMINA (Smart Agriculture System para sa mga magsasakang Pilipino).
Sumagot sa maayos, magalang, at praktikal na Tagalog o Taglish.
Magbigay ng direktang payo sa patubig (Alternate Wetting and Drying / AWD), pataba, peste (rice blast, brown spot), at kalusugan ng pananim.

Kasalukuyang Telemetrya mula sa SEMINA IoT Sensors:
- Lupa (Soil Moisture): ${sensorData?.soilMoisture ?? 45}%
- Level ng Tubig (Water Level): ${sensorData?.waterLevel ?? 78}%
- Temperatura ng Paligid: ${sensorData?.temperature ?? 31.5}°C
- Kelemeto/Halumigmig (Humidity): ${sensorData?.humidity ?? 72}%
- Hydroponics pH: ${sensorData?.hydroponics?.pH ?? 6.2}
- Status ng Patubig: ${sensorData?.irrigationStatus ?? 'IDLE'}`;

    const contents = chatHistory.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API request status:', response.status);
      return null;
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return replyText ? replyText.trim() : null;
  } catch (error) {
    console.warn('Gemini API fetch error:', error);
    return null;
  }
}

/** Convert a short voice question to text before it is sent to the farm assistant. */
export async function transcribeVoiceWithGemini(
  audioUri: string,
  customApiKey?: string
): Promise<string | null> {
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) return null;

  try {
    const file = new File(audioUri);
    const extension = audioUri.split('?')[0].split('.').pop()?.toLowerCase() || 'm4a';
    const mimeTypes: Record<string, string> = {
      m4a: 'audio/mp4', mp4: 'audio/mp4', aac: 'audio/aac',
      wav: 'audio/wav', webm: 'audio/webm', '3gp': 'audio/3gpp', ogg: 'audio/ogg',
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: 'Transcribe this farmer\'s spoken question exactly. It may be in Tagalog, English, or Taglish. Return only the transcription—no answer, labels, quotation marks, or extra commentary.' }] },
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType: mimeTypes[extension] || 'audio/mp4', data: await file.base64() } }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 300 },
      }),
    });
    if (!response.ok) {
      console.warn('Gemini voice transcription status:', response.status);
      return null;
    }
    const transcript = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return transcript || null;
  } catch (error) {
    console.warn('Gemini voice transcription error:', error);
    return null;
  }
}

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes: number[] = [];
  for (let index = 0; index < clean.length; index += 4) {
    const chunk = (BASE64_ALPHABET.indexOf(clean[index]) << 18)
      | (BASE64_ALPHABET.indexOf(clean[index + 1]) << 12)
      | ((BASE64_ALPHABET.indexOf(clean[index + 2]) || 0) << 6)
      | (BASE64_ALPHABET.indexOf(clean[index + 3]) || 0);
    bytes.push((chunk >> 16) & 255);
    if (clean[index + 2]) bytes.push((chunk >> 8) & 255);
    if (clean[index + 3]) bytes.push(chunk & 255);
  }
  return new Uint8Array(bytes);
}

function bytesToBase64(bytes: Uint8Array): string {
  let output = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const value = (bytes[index] << 16) | ((bytes[index + 1] || 0) << 8) | (bytes[index + 2] || 0);
    output += BASE64_ALPHABET[(value >> 18) & 63];
    output += BASE64_ALPHABET[(value >> 12) & 63];
    output += index + 1 < bytes.length ? BASE64_ALPHABET[(value >> 6) & 63] : '=';
    output += index + 2 < bytes.length ? BASE64_ALPHABET[value & 63] : '=';
  }
  return output;
}

function pcmToWavBase64(pcmBase64: string, sampleRate = 24000): string {
  const pcm = base64ToBytes(pcmBase64);
  const wav = new Uint8Array(44 + pcm.length);
  const view = new DataView(wav.buffer);
  const writeText = (offset: number, text: string) => Array.from(text).forEach((char, index) => { wav[offset + index] = char.charCodeAt(0); });
  writeText(0, 'RIFF'); view.setUint32(4, 36 + pcm.length, true); writeText(8, 'WAVE'); writeText(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  writeText(36, 'data'); view.setUint32(40, pcm.length, true); wav.set(pcm, 44);
  return bytesToBase64(wav);
}

/** Generates a natural Filipino/Taglish audio response with Gemini TTS and stores it in the app cache. */
export async function generateGeminiSpeechFile(text: string, customApiKey?: string): Promise<string | null> {
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey || !text.trim()) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Read this exactly as a warm, calm, helpful Filipino farming adviser. Use a natural conversational Tagalog/Taglish cadence, clear words, and gentle pauses. Do not rush, sing, rap, add, or remove any words.\n\n${text}` }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Sulafat' } } },
        },
      }),
    });
    if (!response.ok) {
      console.warn('Gemini TTS status:', response.status);
      return null;
    }
    const pcmBase64 = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!pcmBase64) return null;
    const audioFile = new File(Paths.cache, `tala-gemini-${Date.now()}.wav`);
    audioFile.create({ overwrite: true, intermediates: true });
    audioFile.write(pcmToWavBase64(pcmBase64), { encoding: 'base64' });
    return audioFile.uri;
  } catch (error) {
    console.warn('Gemini TTS error:', error);
    return null;
  }
}

/**
 * Scan a crop image using Gemini's vision capabilities.
 * Sends the image as base64 inline data and asks Gemini to diagnose
 * rice crop diseases, returning a structured CropScanResult.
 * Returns null on failure so the caller can fall back to mock data.
 */
export async function scanCropWithGemini(
  imageUri: string,
  customApiKey?: string
): Promise<Omit<CropScanResult, 'id' | 'dateScanned'> | null> {
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    return null;
  }

  try {
    // Read the image file and convert to base64
    const file = new File(imageUri);
    const base64Image = await file.base64();

    // Determine MIME type from the URI
    const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
    };
    const mimeType = mimeMap[extension] || 'image/jpeg';

    const systemInstruction = `You are TALA AI Crop Scanner, an expert rice crop disease diagnostic system for Filipino farmers (Project SEMINA).
Analyze the provided image of a rice plant leaf or paddy and diagnose any visible disease or confirm healthy status.

You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) using this exact structure:
{
  "cropName": "Palay (Oryza sativa)",
  "diseaseName": "English disease name with scientific name in parentheses, or 'Healthy Rice Foliage (Walang Sakit)' if healthy",
  "tagalogName": "Tagalog name of the disease",
  "confidence": <number 0-100, your confidence percentage>,
  "severity": "<'low' | 'moderate' | 'high'>",
  "symptoms": ["symptom 1 observed in the image", "symptom 2", "symptom 3"],
  "traditionalRemedy": "A traditional Filipino farming remedy using local knowledge and natural ingredients",
  "scientificSolution": "Modern scientific/agronomic treatment recommendation"
}

Common rice diseases to check for: Rice Blast (Magnaporthe oryzae), Bacterial Leaf Blight (Xanthomonas oryzae), Brown Spot (Bipolaris oryzae), Sheath Blight (Rhizoctonia solani), Tungro, False Smut, and Leaf Scald.
If the image is not a rice plant or crop, still try your best to identify any plant disease, or indicate it's not a recognizable crop.
If the plant looks healthy, return the healthy diagnosis with high confidence.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
              {
                text: 'Suriin ang larawang ito ng pananim. Ano ang diagnosis? Respond with JSON only.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini Vision API status:', response.status);
      return null;
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      console.warn('Gemini Vision: empty replyText. Full response:', JSON.stringify(data));
      return null;
    }

    // Parse the JSON response — strip any accidental markdown fences
    const cleaned = replyText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('Gemini Vision JSON parse failed. Raw text:', replyText);
      return null;
    }

    // Validate the required fields exist
    if (!parsed.diseaseName || !parsed.symptoms) {
      console.warn('Gemini scan response missing required fields');
      return null;
    }

    return {
      cropName: (parsed.cropName as string) || 'Palay (Oryza sativa)',
      diseaseName: parsed.diseaseName as string,
      tagalogName: (parsed.tagalogName as string) || (parsed.diseaseName as string),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 85,
      severity: (['low', 'moderate', 'high'].includes(parsed.severity as string)
        ? parsed.severity
        : 'moderate') as 'low' | 'moderate' | 'high',
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms as string[] : [parsed.symptoms as string],
      traditionalRemedy: (parsed.traditionalRemedy as string) || 'Walang rekomendasyon mula sa AI.',
      scientificSolution: (parsed.scientificSolution as string) || 'Walang rekomendasyon mula sa AI.',
    };
  } catch (error) {
    console.warn('Gemini Vision scan error:', error);
    return null;
  }
}

/** Analyze visible soil conditions from a photo. This intentionally avoids laboratory claims. */
export async function scanSoilWithGemini(imageUri: string, customApiKey?: string): Promise<Omit<SoilScanResult, 'imageUri'> | null> {
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) return null;
  try {
    const file = new File(imageUri);
    const extension = imageUri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: `You are TALA's AI-assisted visual soil checker for Filipino farmers. Analyze only what is visibly apparent in a photo: texture, surface moisture, compaction, organic matter clues, cracks, pooling, and residue. Never claim pH, nutrients, contaminants, or fertility values from an image. Respond with JSON only: {"soilAppearance":"short label","confidence":0-100,"moistureAssessment":"dry|moderate|wet","observations":["..."],"recommendation":"practical next step","disclaimer":"AI-assisted visual assessment only, not a laboratory soil test."}` }] },
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: await file.base64() } }, { text: 'Assess this soil photo visually.' }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 700 },
      }),
    });
    if (!response.ok) return null;
    const raw = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;
    const parsed = JSON.parse(raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()) as Partial<SoilScanResult>;
    if (!parsed.soilAppearance || !Array.isArray(parsed.observations) || !parsed.recommendation) return null;
    return { soilAppearance: parsed.soilAppearance, confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 70, moistureAssessment: parsed.moistureAssessment || 'Hindi tiyak', observations: parsed.observations as string[], recommendation: parsed.recommendation, disclaimer: parsed.disclaimer || 'AI-assisted visual assessment lamang ito, hindi laboratory soil test.' };
  } catch (error) { console.warn('Gemini soil scan error:', error); return null; }
}
