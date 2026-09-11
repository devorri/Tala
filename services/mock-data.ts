/**
 * TALA & Project SEMINA Mock Data Service
 * Provides rich, realistic data for smart sensors, traditional knowledge, alerts, and calendar
 */

export interface SensorData {
  waterLevel: number; // percentage 0-100 (Far-End Water Target Sensor)
  waterLevelStatus: 'normal' | 'low' | 'critical';
  soilMoisture: number; // percentage 0-100 (Sector B Soil Moisture Sensor)
  soilMoistureStatus: 'optimal' | 'dry' | 'oversaturated';
  temperature: number; // °C (DHT11)
  humidity: number; // % (DHT11)
  solarBattery: number; // %
  irrigationStatus: 'ACTIVE' | 'IDLE' | 'SCHEDULED' | 'PULSING';
  irrigationMode: 'AUTO' | 'MANUAL' | 'ON' | 'OFF';
  lastUpdated: string;
  pulseIrrigation: {
    runTimeSec: number; // 5s
    pauseTimeSec: number; // 10s
    isPulseOn: boolean;
  };
  farEndReached: boolean; // Water reach sensor (Pin 32 >= 20%)
  localPoolingDetected: boolean; // Soil pooling protection (Pin 35 >= 85%)
  hydroponics: {
    pH: number;
    pHStatus: 'optimal' | 'acidic' | 'alkaline';
    ecNutrients: number; // ppm
    waterTemp: number; // °C
    pumpStatus: 'RUNNING' | 'PAUSED';
    waterLevel: number; // %
  };
}

export interface AlertItemData {
  id: string;
  title: string;
  tagalogTitle?: string;
  description: string;
  category: 'water' | 'soil' | 'ph' | 'weather' | 'system';
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  smsFallbackTriggered: boolean;
  smsRecipient?: string;
  actionRequired?: string;
  actionDone?: boolean;
}

export interface CropScanResult {
  id: string;
  cropName: string;
  diseaseName: string;
  tagalogName: string;
  confidence: number;
  dateScanned: string;
  severity: 'low' | 'moderate' | 'high';
  symptoms: string[];
  traditionalRemedy: string;
  scientificSolution: string;
  imageUri?: string;
}

/** Visual soil assessment only; it is not a laboratory soil test. */
export interface SoilScanResult {
  soilAppearance: string;
  confidence: number;
  moistureAssessment: string;
  observations: string[];
  recommendation: string;
  disclaimer: string;
  imageUri?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  tagalogTitle: string;
  author: string;
  role: string;
  location: string;
  category: 'audio_elder' | 'traditional_practice' | 'biodiversity' | 'soil_care';
  summary: string;
  content: string;
  audioDuration?: string;
  audioUrl?: string;
  readTime: string;
  likes: number;
  iconName: string;
  tags: string[];
  mediaUrl?: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'planting' | 'irrigation' | 'fertilizer' | 'harvest' | 'traditional_lunar';
  description: string;
  time?: string;
  syncedWithGoogle: boolean;
  stage?: string;
  completed?: boolean;
}

export interface GrowthRecord {
  id: string;
  cropType: string;
  plotName: string;
  plantingDate: string;
  currentDay: number;
  targetHarvestDays: number;
  heightCm: number;
  healthScore: number; // 0-100
  notes: string;
  logs: { date: string; height: number; notes: string }[];
}

export const INITIAL_SENSOR_DATA: SensorData = {
  waterLevel: 78,
  waterLevelStatus: 'normal',
  soilMoisture: 64,
  soilMoistureStatus: 'optimal',
  temperature: 31.4,
  humidity: 76,
  solarBattery: 92,
  irrigationStatus: 'IDLE',
  irrigationMode: 'AUTO',
  lastUpdated: 'Just now (SEMINA ESP32 Gateway - Muñoz, NE)',
  pulseIrrigation: {
    runTimeSec: 5,
    pauseTimeSec: 10,
    isPulseOn: false,
  },
  farEndReached: true,
  localPoolingDetected: false,
  hydroponics: {
    pH: 6.3,
    pHStatus: 'optimal',
    ecNutrients: 980,
    waterTemp: 24.8,
    pumpStatus: 'RUNNING',
    waterLevel: 85,
  },
};

export const MOCK_ALERTS: AlertItemData[] = [
  {
    id: 'alt-01',
    title: 'Low Soil Moisture in Sector B (Paddy 2)',
    tagalogTitle: 'Mababang Kahalumigmigan sa Lupa - Sektor B',
    description: 'Moisture dropped below 35% threshold. SEMINA Smart Irrigation suggests a 15-minute drip cycle.',
    category: 'soil',
    severity: 'warning',
    timestamp: '10 mins ago',
    smsFallbackTriggered: true,
    smsRecipient: '+63 917 842 1993 (Offline SMS Gateway)',
    actionRequired: 'Start 15m Drip Irrigation',
    actionDone: false,
  },
  {
    id: 'alt-02',
    title: 'Hydroponics Nutrient pH Drift (6.9 pH)',
    tagalogTitle: 'Pagtaas ng pH sa Hydroponics',
    description: 'Nutrient reservoir pH is leaning slightly alkaline for Rice Seedling tray.',
    category: 'ph',
    severity: 'info',
    timestamp: '1 hour ago',
    smsFallbackTriggered: false,
    actionRequired: 'Add 20ml pH Down Solution',
    actionDone: true,
  },
  {
    id: 'alt-03',
    title: 'Heavy Rain Forecast in 4 Hours',
    tagalogTitle: 'Banta ng Malakas na Ulan mamayang Hapon',
    description: 'Regional Doppler radar indicates 80% chance of sudden precipitation. Automated canal gates prepared.',
    category: 'weather',
    severity: 'warning',
    timestamp: '2 hours ago',
    smsFallbackTriggered: true,
    smsRecipient: '+63 917 842 1993 (Smart SMS Alert)',
  },
  {
    id: 'alt-04',
    title: 'Solar Panel Efficiency Check',
    tagalogTitle: 'Maayos ang Pagkarga ng Solar',
    description: 'Battery reached 92% full charge with 12.8V. Standalone SEMINA telemetry stable.',
    category: 'system',
    severity: 'info',
    timestamp: 'Today, 8:30 AM',
    smsFallbackTriggered: false,
  },
];

export const MOCK_CROP_DISEASES: Record<string, Omit<CropScanResult, 'id' | 'dateScanned'>> = {
  rice_blast: {
    cropName: 'Palay (Oryza sativa)',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    tagalogName: 'Tukod-Langit / Blast sa Palay',
    confidence: 94.2,
    severity: 'high',
    symptoms: [
      'Spindle-shaped lesions with gray-white centers and dark brown margins on leaves',
      'Lesions enlarge and coalesce, causing leaf desiccation',
      'Rotten neck or blackened panicle node in later stages',
    ],
    traditionalRemedy:
      'Traditional Kakawate (Gliricidia sepium) & Wild Garlic fermented foliar spray; apply wood ash (abo ng kahoy) along paddies to boost silica and reduce fungal spore germination.',
    scientificSolution:
      'Ensure balanced nitrogen application (avoid excessive Urea); treat with Isoprothiolane or Tricyclazole fungicide during early vegetative tillering if severe.',
  },
  bacterial_blight: {
    cropName: 'Palay (Oryza sativa)',
    diseaseName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    tagalogName: 'Pangungulubot ng Dahon / Blight',
    confidence: 88.7,
    severity: 'moderate',
    symptoms: [
      'Water-soaked stripes along leaf margins turning yellow to white',
      'Bacterial ooze droplets visible on young lesions during moist mornings',
      'Wilting (Kresek phase) in early transplanting',
    ],
    traditionalRemedy:
      'Draining the paddy water for 2-3 days (patuyuan ang sakahan) to starve bacterial propagation, followed by Neem-leaf and crushed ginger tea spray.',
    scientificSolution:
      'Maintain field sanitation, spray Copper oxychloride or validamycin as recommended by DA PhilRice standards.',
  },
  brown_spot: {
    cropName: 'Palay (Oryza sativa)',
    diseaseName: 'Brown Spot Disease (Bipolaris oryzae)',
    tagalogName: 'Kayumangging Batik sa Palay',
    confidence: 91.5,
    severity: 'low',
    symptoms: [
      'Small, round to oval brown spots uniformly scattered across leaf blade',
      'Yellow halos surrounding older brown spots',
      'Common in nutrient-deficient and water-stressed soils',
    ],
    traditionalRemedy:
      'Top-dress with decomposed carabao manure tea and rice hull biochar (ipil-ipil or uling ng ipa) to restore potassium and micro-nutrients naturally.',
    scientificSolution:
      'Apply balanced NPK fertilizer with micronutrient zinc supplement; treat seeds with fungicide prior to germination.',
  },
  healthy_leaf: {
    cropName: 'Palay (Oryza sativa)',
    diseaseName: 'Healthy Rice Foliage (Walang Sakit)',
    tagalogName: 'Malusog at Masiglang Palay',
    confidence: 98.4,
    severity: 'low',
    symptoms: [
      'Vibrant deep green blade coloration',
      'Uniform leaf venation without lesions or curling',
      'Strong tillering and vigorous root anchorage',
    ],
    traditionalRemedy:
      'Continue observing morning moisture cycles and practicing companion border planting with Marigold and Lemongrass for natural pest deterrence.',
    scientificSolution:
      'Maintain optimal SEMINA soil moisture threshold between 60% and 75% for current vegetative growth stage.',
  },
};

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'know-01',
    title: 'Apo Ramon: Pagbasa sa Buwan at Simoy ng Hangin',
    tagalogTitle: 'Folk Weather Signs & Lunar Planting Cycle',
    author: 'Apo Ramon Delos Santos',
    role: 'Traditional Rice Elder (74 yrs farming)',
    location: 'San Jose City, Nueva Ecija',
    category: 'audio_elder',
    summary:
      'Listen to Apo Ramon explain how the full moon ("Bulang Husto") and early morning cloud patterns guide planting schedules before modern radar.',
    content:
      'Ayon sa mga ninuno, ang pagtatanim ng palay sa panahon ng paakyat na buwan (Waxing Moon) ay nagdudulot ng mas matabang uhay dahil sa likas na paghila ng tubig sa lupa. Kasabay nito, ang pagsusuri sa amoy ng hangin bago magbukang-liwayway ay nagbababala kung may darating na habagat o amihan.\n\n"Huwag kalimutang pakinggan ang lupa," paalala ni Apo Ramon. "Kapag ang kuliglig ay tumigil sa paghuni sa dapithapon, asahan mo ang biglaang pag-ulan."',
    audioDuration: '3:45 min',
    audioUrl: 'https://archive.org/download/philippine_folk_farming_snippet/audio_elder_sample.mp3',
    readTime: '4 min read',
    likes: 142,
    iconName: 'volume',
    tags: ['Lunar Cycle', 'Elder Wisdom', 'Weather Lore', 'Audio'],
  },
  {
    id: 'know-02',
    title: 'Natural Pest Repellents with Kakawate & Chili',
    tagalogTitle: 'Likas na Pamatay-Peste Gamit ang Kakawate at Siling Labuyo',
    author: 'Nanay Elena Bautista',
    role: 'Organic Agri-Advocate',
    location: 'Victoria, Tarlac',
    category: 'traditional_practice',
    summary:
      'How to make an effective organic insect-deterrent brew against stem borers and armyworms without harming beneficial pollinators.',
    content:
      'Sangkap:\n1. 1 kilo dahon ng Kakawate (dikdikin)\n2. 20 pirasong siling labuyo (durugin)\n3. 5 litrong tubig-ulan o tubig sa poso\n4. 2 kutsarang molasses o asukal na pula\n\nParaan ng Paggawa:\nIhalo ang lahat ng sangkap sa isang timba. Takpan ng malinis na tela at ibabad ng 3 hanggang 5 araw sa malilim na lugar. Salain at ihalo ang 1 baso ng likido sa bawat 16 litrong knapsack sprayer. I-spray sa dapithapon kapag lumalabas ang mga gamu-gamo.',
    readTime: '3 min read',
    likes: 218,
    iconName: 'leaf',
    tags: ['Organic Spray', 'Kakawate', 'Pest Control', 'Zero Cost'],
  },
  {
    id: 'know-03',
    title: 'Water Management: Alternating Wetting & Drying (AWD)',
    tagalogTitle: 'Tipid-Tubig sa Palayan: Patubig at Patuyong Pamamaraan',
    author: 'Engr. Mateo Cruz & Tatay Mario',
    role: 'PhilRice & SEMINA Field Partner',
    location: 'Muñoz, Nueva Ecija',
    category: 'soil_care',
    summary:
      'Combining traditional observation of mud cracks with SEMINA automated soil moisture probes saves 30% water without reducing yield.',
    content:
      'Sa pamamaraang AWD, hindi kailangang laging nakalubog sa 5cm na tubig ang palayan. Kapag ang moisture sensor ng SEMINA ay nagbasa ng 40% o kapag ang tubig sa field water tube (pani-kasan) ay bumaba ng 15cm sa ilalim ng lupa, doon lamang bubuksan ang gate ng irigasyon.\n\nNagpapalakas ito ng ugat ng palay upang hindi madaling matumba sa hangin at nababawasan ang greenhouse gas (methane) mula sa nabubulok na putik.',
    readTime: '5 min read',
    likes: 185,
    iconName: 'water.drop',
    tags: ['AWD', 'Water Saving', 'Root Strength', 'SEMINA Sensor'],
  },
  {
    id: 'know-04',
    title: 'Pollinator Sanctuaries in Paddy Ridges',
    tagalogTitle: 'Mga Kaibigang Bubuyog at Paruparo sa Pilapil',
    author: 'Dr. Clara Santos',
    role: 'Agro-ecologist',
    location: 'Los Baños, Laguna',
    category: 'biodiversity',
    summary:
      'Planting Cosmoss, Marigold, and Zinnia along rice dikes increases natural parasitoid wasps that eat brown planthoppers by 60%.',
    content:
      'Ang mga bulaklak sa gilid ng sakahan ay nagsisilbing tahanan at pagkain ng mga kaibigang insekto (predators and parasitoids). Sa halip na mag-spray ng mamahaling pestisidyo na pumapatay sa lahat, ang mga putakti (wasps) at gagamba ang mismong aatake sa mga uod ng stem borer.',
    readTime: '4 min read',
    likes: 97,
    iconName: 'bee',
    tags: ['Pollinators', 'Biodiversity', 'Natural Predators'],
  },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-01',
    date: '2026-08-27',
    title: 'SEMINA AWD Water Inspection',
    type: 'irrigation',
    description: 'Check automated valve Sector B; evaluate soil moisture reading after yesterday sunshine.',
    time: '06:30 AM',
    syncedWithGoogle: true,
    stage: 'Vegetative Tillering (Day 28)',
  },
  {
    id: 'cal-02',
    date: '2026-08-28',
    title: 'Organic Kakawate Foliar Spraying',
    type: 'fertilizer',
    description: 'Apply prepared organic tea during twilight (5:30 PM) for stem borer prevention.',
    time: '05:30 PM',
    syncedWithGoogle: true,
  },
  {
    id: 'cal-03',
    date: '2026-08-30',
    title: 'First Quarter Moon: Root Feeding Cycle',
    type: 'traditional_lunar',
    description: 'Traditional lunar window for applying compost tea to bolster stem circumference.',
    time: 'All Day',
    syncedWithGoogle: false,
  },
  {
    id: 'cal-04',
    date: '2026-09-04',
    title: 'Hydroponics Nutrient Refresh & EC Calibration',
    type: 'planting',
    description: 'Drain reservoir, refill with rain capture water, calibrate pH target 6.2 - 6.5.',
    time: '08:00 AM',
    syncedWithGoogle: true,
  },
  {
    id: 'cal-05',
    date: '2026-09-15',
    title: 'Panicle Initiation Phase Check',
    type: 'harvest',
    description: 'Inspect micro-panicle formation inside leaf sheaths; maintain 3cm standing water.',
    time: '07:00 AM',
    syncedWithGoogle: true,
    stage: 'Reproductive Phase (Day 45)',
  },
];

export const MOCK_GROWTH_RECORDS: GrowthRecord[] = [
  {
    id: 'grow-01',
    cropType: 'RC-222 (Tubigan 21 Palay)',
    plotName: 'Paddy Field North (Plot A)',
    plantingDate: '2026-07-30',
    currentDay: 28,
    targetHarvestDays: 110,
    heightCm: 48,
    healthScore: 94,
    notes: 'Vigorous tillering observed; 18-22 tillers per hill. Zero pest outbreaks detected.',
    logs: [
      { date: 'Day 7', height: 14, notes: 'Transplant recovery complete' },
      { date: 'Day 14', height: 24, notes: 'Early tillering stage, roots deep' },
      { date: 'Day 21', height: 36, notes: 'AWD irrigation cycle 1 completed' },
      { date: 'Day 28', height: 48, notes: 'Thick emerald stems, 94% health' },
    ],
  },
  {
    id: 'grow-02',
    cropType: 'Hydroponic Leafy Mustard & Kangkong',
    plotName: 'SEMINA Solar Hydro Tray 1',
    plantingDate: '2026-08-10',
    currentDay: 17,
    targetHarvestDays: 35,
    heightCm: 22,
    healthScore: 98,
    notes: 'Hydroponic root system pristine white. pH maintained between 6.2 and 6.4.',
    logs: [
      { date: 'Day 5', height: 5, notes: 'Seedlings transferred from sponge' },
      { date: 'Day 10', height: 12, notes: 'True leaves expanding rapidly' },
      { date: 'Day 17', height: 22, notes: 'Lush foliage, ready for partial picking in 7 days' },
    ],
  },
];

export const MOCK_DIGITAL_RECORDS = {
  waterUsageThisWeek: [
    { day: 'Mon', liters: 420, savedLiters: 160 },
    { day: 'Tue', liters: 380, savedLiters: 190 },
    { day: 'Wed', liters: 450, savedLiters: 140 },
    { day: 'Thu', liters: 290, savedLiters: 260 },
    { day: 'Fri', liters: 310, savedLiters: 230 },
    { day: 'Sat', liters: 390, savedLiters: 170 },
    { day: 'Sun', liters: 260, savedLiters: 300 },
  ],
  totalWaterSavedLiters: 1450,
  irrigationEventsCount: 14,
  solarGeneratedKwh: 38.6,
  automatedActionsCount: 42,
  farmerNotes: [
    {
      id: 'fn-1',
      date: '2026-08-25',
      author: 'Farmer Juan',
      text: 'Applied wood ash along boundary canal after light drizzle. Observed high dragonfly activity.',
    },
    {
      id: 'fn-2',
      date: '2026-08-22',
      author: 'Farmer Juan',
      text: 'SEMINA sensor triggered early shutoff during storm, preventing fertilizer runoff.',
    },
  ],
  surveyQuiz: {
    question: 'Ano ang pinakamagandang gawin kapag ang soil moisture ay 65% at may darating na ulan?',
    options: [
      'Magpatubig agad ng sagana',
      'I-pause ang irigasyon at hayaang ulan ang magdilig (SEMINA Smart Mode)',
      'Magbuhos ng maraming kemikal na pataba',
      'Patuyuin nang husto ang kanal',
    ],
    correctIndex: 1,
    explanation:
      'Kapag sapat ang moisture at may paparating na ulan, ang pag-pause sa automated pump ay nagtitipid ng tubig at kuryente habang naiiwasan ang pagka-anod ng nutrients.',
  },
};

export const MOCK_AI_RESPONSES: Record<string, string> = {
  pest: 'Para sa peste tulad ng rice stem borer o leaf folder, inirerekomenda ng TALA ang kombinasyon ng modernong pagmamanman at tradisyonal na pamamaraan: mag-spray ng fermented Kakawate at siling labuyo sa dapithapon. Iwasang mag-spray sa tanghali upang maprotektahan ang mga kaibigang bubuyog at putakti sa pilapil.',
  water: 'Ayon sa SEMINA Sensor Node 01, ang kasalukuyang kahalumigmigan ng lupa ay 64% (Optimal). Hindi mo kailangang magbukas ng irigasyon ngayon. Ayon din sa pamamaraang AWD (Alternate Wetting & Drying), makatutulong na hayaang lumalim ang mga ugat ng palay.',
  fertilizer: 'Para sa kasalukuyang Vegetative Tillering stage (Day 28), maganda ang paggamit ng biochar kasama ang katas ng binurong dumi ng kalabaw o compost tea. Magbibigay ito ng mabilisang Nitrogen nang hindi pinapataas ang acidity ng lupa.',
  hydroponics: 'Ang iyong Hydroponic reservoir ay nasa pH 6.3 at 980 ppm EC. Ito ay nasa ideal range para sa rice seedling tray at madahong gulay. Panatilihing tumatakbo ang solar pump tuwing may sikat ng araw.',
  general: 'Kumusta! Ako si TALA, ang iyong katulong sa Project SEMINA. Maaari mo akong tanungin tungkol sa datos ng sensor, peste sa palay, patubig, o tradisyonal na kaalaman sa pagtatanim. Paano kita matutulungan ngayon, kasamang magsasaka?',
};
