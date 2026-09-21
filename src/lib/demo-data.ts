export interface Farm {
  id: string;
  name: string;
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  areaAcres: number;
  soilType: string;
  irrigationType: string;
  waterSource: string;
  currentCrop: string;
  cropVariety: string;
  sowingDate: string;
  cropStage: string;
  healthScore: number;
  riskScore: number;
  boundary: Array<{ lat: number; lng: number }>;
}

export interface FarmAction {
  id: string;
  title: string;
  category: 'irrigation' | 'disease' | 'weather' | 'market' | 'nutrient' | 'harvest';
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  timeframe: string;
  completed: boolean;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainChance: number;
  rainfallMm: number;
  humidity: number;
  windSpeedKm: number;
  advisory: string;
}

export interface MandiPrice {
  id: string;
  mandiName: string;
  distanceKm: number;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  transportCostPerQtl: number;
  netEstimatedReturnPerQtl: number;
  trend: 'up' | 'down' | 'stable';
  updatedAt: string;
}

export interface GovtScheme {
  id: string;
  title: string;
  level: 'Central' | 'State';
  state?: string;
  category: 'Direct Benefit' | 'Irrigation' | 'Credit' | 'Insurance' | 'Solar' | 'Seeds' | 'Organic';
  benefits: string;
  subsidyPercentage?: number;
  maxAmount?: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationUrl: string;
  status: 'Eligible' | 'Applied' | 'Potential Match';
  matchReason: string;
  lastVerified: string;
}

export interface DiseaseRecord {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  causes: string[];
  immediateActions: string[];
  preventiveActions: string[];
  expertEscalationNeeded: boolean;
  sampleImageUrl: string;
}

export interface SoilReport {
  id: string;
  farmId: string;
  testDate: string;
  labName: string;
  nitrogenKgHa: number;
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  phosphorusKgHa: number;
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  potassiumKgHa: number;
  potassiumStatus: 'Low' | 'Medium' | 'High';
  ph: number;
  phStatus: 'Acidic' | 'Optimal' | 'Alkaline';
  organicCarbonPercent: number;
  electricalConductivity: number;
  soilHealthIndex: number;
  recommendations: string[];
}

export const DEMO_FARMER = {
  id: "farmer_001",
  name: "Ramesh Gowda",
  phone: "+91 98450 12345",
  email: "ramesh.gowda@krishimitra.demo",
  preferredLanguage: "en" as const,
  role: "farmer" as const,
  village: "Narasapura",
  taluk: "Kolar",
  district: "Kolar",
  state: "Karnataka",
  pincode: "563133",
  avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
  memberSince: "May 2023",
  totalLandAcres: 4.0,
  verifiedKYC: true,
  badges: [
    { title: "Water Conservation Pioneer", icon: "💧", description: "Saved 120,000L water via Drip Management" },
    { title: "Soil Health Champion", icon: "🌱", description: "Maintained optimal NPK balance for 2 seasons" },
    { title: "Early Pest Detector", icon: "🛡️", description: "Reported and contained leaf curl early" },
  ]
};

export const DEMO_FARMS: Farm[] = [
  {
    id: "farm_001",
    name: "Sri Lakshmi Farm - Plot 1",
    farmerId: "farmer_001",
    farmerName: "Ramesh Gowda",
    village: "Narasapura",
    district: "Kolar",
    state: "Karnataka",
    pincode: "563133",
    latitude: 13.1367,
    longitude: 78.1348,
    areaAcres: 2.5,
    soilType: "Red Sandy Loam",
    irrigationType: "Drip Irrigation",
    waterSource: "Borewell (350 ft)",
    currentCrop: "Tomato",
    cropVariety: "Arka Rakshak (F1 Hybrid)",
    sowingDate: "2026-08-08",
    cropStage: "Flowering & Early Fruit Set (Day 33)",
    healthScore: 88,
    riskScore: 28,
    boundary: [
      { lat: 13.1365, lng: 78.1340 },
      { lat: 13.1375, lng: 78.1342 },
      { lat: 13.1378, lng: 78.1358 },
      { lat: 13.1363, lng: 78.1356 },
    ],
  },
  {
    id: "farm_002",
    name: "Cauvery Greens - Plot 2",
    farmerId: "farmer_001",
    farmerName: "Ramesh Gowda",
    village: "Narasapura",
    district: "Kolar",
    state: "Karnataka",
    pincode: "563133",
    latitude: 13.1390,
    longitude: 78.1370,
    areaAcres: 1.5,
    soilType: "Clay Loam",
    irrigationType: "Micro-Sprinkler",
    waterSource: "Farm Pond + Canal",
    currentCrop: "Groundnut",
    cropVariety: "TMV 2",
    sowingDate: "2026-08-25",
    cropStage: "Vegetative / Pegging (Day 16)",
    healthScore: 92,
    riskScore: 22,
    boundary: [
      { lat: 13.1388, lng: 78.1365 },
      { lat: 13.1398, lng: 78.1368 },
      { lat: 13.1395, lng: 78.1378 },
      { lat: 13.1385, lng: 78.1375 },
    ],
  },
];

export const DEMO_ACTIONS: FarmAction[] = [
  {
    id: "act_1",
    title: "Skip Afternoon Irrigation Cycle",
    category: "irrigation",
    priority: "high",
    action: "Do not operate drip line valves between 1:00 PM and 6:00 PM today.",
    reason: "18.5 mm rainfall forecasted around 4:30 PM with 84% probability. Skipping saves 4,200L water and prevents root saturation.",
    timeframe: "Before 1:00 PM",
    completed: false,
  },
  {
    id: "act_2",
    title: "Scout North-East Zone B for Early Blight",
    category: "disease",
    priority: "high",
    action: "Inspect lower foliage on rows 12 to 24 in Zone B for concentric ring brown lesions.",
    reason: "Relative humidity exceeded 88% for 6 continuous hours overnight, creating prime fungal germination conditions.",
    timeframe: "Morning (7:00 AM - 10:00 AM)",
    completed: false,
  },
  {
    id: "act_3",
    title: "Postpone Foliar Micronutrient Spray",
    category: "weather",
    priority: "medium",
    action: "Reschedule planned Zinc-Boron spray to Thursday morning.",
    reason: "Wind gusts predicted up to 24 km/h will cause 40%+ droplet drift and rainfall will wash off unabsorbed nutrients.",
    timeframe: "Today",
    completed: true,
  },
  {
    id: "act_4",
    title: "Monitor Kolar vs Yeshwantpur Mandi Spread",
    category: "market",
    priority: "medium",
    action: "Prepare crates for Friday harvest if Bengaluru Yeshwantpur price stays ₹280/qtl above Kolar.",
    reason: "Even after factoring ₹85/qtl transport and ₹25 loading, net profit is ₹170/qtl higher at Bengaluru.",
    timeframe: "Evening (6:00 PM)",
    completed: false,
  },
  {
    id: "act_5",
    title: "Check Drip Filter Backwash Pressure",
    category: "nutrient",
    priority: "low",
    action: "Backwash screen and disc filters before Thursday fertigation.",
    reason: "Borewell sand ingress index is moderate after heavy pumping cycle last week.",
    timeframe: "Anytime today",
    completed: false,
  },
];

export const DEMO_WEATHER_DAYS: WeatherDay[] = [
  {
    date: "2026-09-10",
    dayName: "Today",
    tempMax: 30,
    tempMin: 21,
    condition: "Scattered Thundershowers",
    icon: "CloudRain",
    rainChance: 85,
    rainfallMm: 18.5,
    humidity: 78,
    windSpeedKm: 22,
    advisory: "Heavy rain in afternoon. Avoid spraying and chemical fertilizers.",
  },
  {
    date: "2026-09-11",
    dayName: "Tomorrow",
    tempMax: 29,
    tempMin: 20,
    condition: "Partly Cloudy with Light Drizzle",
    icon: "CloudDrizzle",
    rainChance: 45,
    rainfallMm: 4.2,
    humidity: 72,
    windSpeedKm: 14,
    advisory: "Good conditions for physical weeding and staking.",
  },
  {
    date: "2026-09-12",
    dayName: "Saturday",
    tempMax: 31,
    tempMin: 20,
    condition: "Clear & Sunny",
    icon: "Sun",
    rainChance: 10,
    rainfallMm: 0,
    humidity: 58,
    windSpeedKm: 11,
    advisory: "Ideal window for scheduled fertigation and crop health inspection.",
  },
  {
    date: "2026-09-13",
    dayName: "Sunday",
    tempMax: 32,
    tempMin: 22,
    condition: "Sunny & Warm",
    icon: "Sun",
    rainChance: 15,
    rainfallMm: 0,
    humidity: 54,
    windSpeedKm: 10,
    advisory: "Resume normal 45-minute morning drip cycle.",
  },
  {
    date: "2026-09-14",
    dayName: "Monday",
    tempMax: 30,
    tempMin: 21,
    condition: "Passing Clouds",
    icon: "CloudSun",
    rainChance: 25,
    rainfallMm: 1.5,
    humidity: 62,
    windSpeedKm: 16,
    advisory: "Optimal day for market harvesting.",
  },
];

export const DEMO_MANDI_PRICES: MandiPrice[] = [
  {
    id: "mandi_01",
    mandiName: "Kolar APMC Yard",
    distanceKm: 14,
    commodity: "Tomato (Hybrid)",
    variety: "Arka Rakshak / 1057",
    minPrice: 2200,
    maxPrice: 2600,
    modalPrice: 2450,
    transportCostPerQtl: 40,
    netEstimatedReturnPerQtl: 2410,
    trend: "up",
    updatedAt: "Today 08:30 AM",
  },
  {
    id: "mandi_02",
    mandiName: "Bengaluru Yeshwantpur APMC",
    distanceKm: 68,
    commodity: "Tomato (Hybrid)",
    variety: "Arka Rakshak / 1057",
    minPrice: 2500,
    maxPrice: 2950,
    modalPrice: 2780,
    transportCostPerQtl: 130,
    netEstimatedReturnPerQtl: 2650,
    trend: "up",
    updatedAt: "Today 07:45 AM",
  },
  {
    id: "mandi_03",
    mandiName: "Chintamani APMC",
    distanceKm: 38,
    commodity: "Tomato (Hybrid)",
    variety: "Arka Rakshak / 1057",
    minPrice: 2100,
    maxPrice: 2450,
    modalPrice: 2320,
    transportCostPerQtl: 75,
    netEstimatedReturnPerQtl: 2245,
    trend: "stable",
    updatedAt: "Today 09:10 AM",
  },
  {
    id: "mandi_04",
    mandiName: "Hosakote APMC",
    distanceKm: 42,
    commodity: "Tomato (Hybrid)",
    variety: "Arka Rakshak / 1057",
    minPrice: 2300,
    maxPrice: 2700,
    modalPrice: 2550,
    transportCostPerQtl: 85,
    netEstimatedReturnPerQtl: 2465,
    trend: "down",
    updatedAt: "Today 08:00 AM",
  },
];

export const DEMO_SCHEMES: GovtScheme[] = [
  {
    id: "sch_01",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    level: "Central",
    category: "Direct Benefit",
    benefits: "₹6,000 per year in three equal installments of ₹2,000 directly transferred to farmer bank account.",
    maxAmount: "₹6,000 / year",
    eligibility: [
      "Small and marginal landholding farmer family",
      "Land ownership records verified with state land revenue",
      "Aadhaar-linked bank account",
    ],
    documentsRequired: ["Aadhaar Card", "Land Record (Pahani / RTC)", "Bank Passbook"],
    applicationUrl: "https://pmkisan.gov.in",
    status: "Eligible",
    matchReason: "Your farm size (4.0 acres) and land records in Karnataka match 100% of the small farmer criteria.",
    lastVerified: "2026-08-15",
  },
  {
    id: "sch_02",
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
    level: "Central",
    category: "Irrigation",
    benefits: "Up to 55% subsidy for small/marginal farmers and 45% for other farmers for micro-irrigation systems (Drip & Sprinkler).",
    subsidyPercentage: 55,
    maxAmount: "₹45,000 / acre",
    eligibility: [
      "Farmers having assured source of irrigation water",
      "Land ownership or minimum 7-year lease documents",
      "Not availed micro-irrigation subsidy in same survey number in last 7 years",
    ],
    documentsRequired: ["RTC / Land record", "Water source proof (Borewell/Well)", "Aadhaar Card", "Soil & Water test report"],
    applicationUrl: "https://pmksy.gov.in",
    status: "Eligible",
    matchReason: "Plot 2 (Cauvery Greens) is currently on micro-sprinkler and qualifies for 55% drip expansion grant.",
    lastVerified: "2026-08-20",
  },
  {
    id: "sch_03",
    title: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    level: "Central",
    category: "Insurance",
    benefits: "Comprehensive crop insurance from pre-sowing to post-harvest against non-preventable natural risks at nominal premium (1.5% - 2%).",
    subsidyPercentage: 90,
    maxAmount: "Coverage up to ₹65,000 / acre",
    eligibility: [
      "All farmers growing notified crops in notified areas",
      "Loanee and non-loanee farmers",
    ],
    documentsRequired: ["Sowing Certificate", "Land Record RTC", "Bank Account Details", "Aadhaar Card"],
    applicationUrl: "https://pmfby.gov.in",
    status: "Potential Match",
    matchReason: "Kolar district Tomato and Groundnut are notified crops for current Kharif/Rabi cycle. Application cut-off is Sep 30.",
    lastVerified: "2026-09-01",
  },
  {
    id: "sch_04",
    title: "PM-KUSUM (Component B - Standalone Solar Agriculture Pumps)",
    level: "Central",
    category: "Solar",
    benefits: "60% subsidy (30% Central + 30% State) for replacement of diesel pump or installation of standalone solar pump up to 7.5 HP.",
    subsidyPercentage: 60,
    maxAmount: "Up to ₹1,80,000",
    eligibility: [
      "Individual farmers, water user associations",
      "No existing grid electricity pump connection in the applied plot",
    ],
    documentsRequired: ["RTC", "Borewell feasibility certificate", "Aadhaar", "Bank passbook"],
    applicationUrl: "https://pmkusum.mnre.gov.in",
    status: "Eligible",
    matchReason: "Plot 2 operates without dedicated grid line and is 100% eligible for 5 HP Solar Pump subsidy.",
    lastVerified: "2026-07-28",
  },
];

export const DEMO_SOIL_REPORT: SoilReport = {
  id: "soil_001",
  farmId: "farm_001",
  testDate: "2026-07-15",
  labName: "Kolar District Soil Testing Laboratory (ICAR-KVK)",
  nitrogenKgHa: 195,
  nitrogenStatus: "Low",
  phosphorusKgHa: 42,
  phosphorusStatus: "Medium",
  potassiumKgHa: 285,
  potassiumStatus: "High",
  ph: 6.8,
  phStatus: "Optimal",
  organicCarbonPercent: 0.58,
  electricalConductivity: 0.42,
  soilHealthIndex: 78,
  recommendations: [
    "Apply 25 kg/acre Urea or Vermicompost (2 tons) to correct low Nitrogen availability during vegetative stage.",
    "Phosphorus level is balanced; maintain with single super phosphate (SSP) at flowering stage.",
    "Potassium is abundant (285 kg/ha); reduce Muriate of Potash (MOP) dosage by 30% to save ₹850/acre.",
    "Soil pH is 6.8 (near neutral), which is optimal for Solanaceous tomato nutrient absorption.",
  ],
};

export const DEMO_DISEASE_RECORDS: DiseaseRecord[] = [
  {
    id: "dis_01",
    cropName: "Tomato",
    diseaseName: "Early Blight (Alternaria solani)",
    scientificName: "Alternaria solani",
    confidence: 93.4,
    severity: "Moderate",
    symptoms: [
      "Dark brown to black spots with concentric rings ('target board' pattern) on older leaves.",
      "Yellow halo surrounding the circular necrotic spots.",
      "Premature leaf drop starting from lower canopy.",
    ],
    causes: [
      "High relative humidity (>80%) combined with warm temperatures (24°C - 29°C).",
      "Prolonged leaf wetness from rain or overhead irrigation.",
      "Fungal spores overwintering in previous solanaceous crop debris.",
    ],
    immediateActions: [
      "Prune and safely burn infected bottom leaves to prevent vertical spore splash.",
      "Spray Mancozeb 75% WP @ 2.5 g/L water or Chlorothalonil @ 2 g/L during dry morning hours.",
      "Switch exclusively to root drip irrigation to keep upper canopy dry.",
    ],
    preventiveActions: [
      "Practice minimum 2-year crop rotation with non-solanaceous crops (e.g. Maize, Legumes).",
      "Maintain 60cm row spacing for optimum canopy aeration.",
      "Apply Trichoderma viride enriched farmyard manure during land preparation.",
    ],
    expertEscalationNeeded: false,
    sampleImageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "dis_02",
    cropName: "Tomato",
    diseaseName: "Tomato Leaf Curl Virus (ToLCV)",
    scientificName: "Begomovirus (transmitted by Bemisia tabaci)",
    confidence: 91.0,
    severity: "Severe",
    symptoms: [
      "Upward and inward curling of leaf margins with puckering.",
      "Severe stunting of bushy plants and flower drop.",
      "Interveinal chlorosis and reduced fruit size.",
    ],
    causes: [
      "Vector transmission by Whiteflies (Bemisia tabaci).",
      "Hot and dry weather followed by intermittent showers accelerating whitefly breeding.",
    ],
    immediateActions: [
      "Install yellow sticky traps (15 traps/acre) at canopy height to monitor and trap whitefly adults.",
      "Spray Neem oil (10,000 ppm) @ 2 ml/L or Acetamiprid 20% SP @ 0.3 g/L.",
      "Rogue out severely stunted viral plants immediately to prevent field-wide vector spread.",
    ],
    preventiveActions: [
      "Use resistant hybrid varieties such as Arka Rakshak or US-440.",
      "Erect 40-mesh nylon insect-proof border netting around the plot boundary.",
    ],
    expertEscalationNeeded: true,
    sampleImageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80",
  },
];

export const DEMO_COMMUNITY_POSTS = [
  {
    id: "post_01",
    authorName: "Suresh Patil",
    village: "Chikkaballapur",
    crop: "Tomato",
    timeAgo: "2 hours ago",
    title: "Whitefly population control using neem oil + yellow sticky traps",
    content: "Last season I had 30% loss due to leaf curl. This season installed 20 yellow sticky traps per acre right from day 10 and sprayed neem oil every 10 days. Whitefly count is down 80%! Sharing photos.",
    upvotes: 42,
    repliesCount: 8,
    aiSuggestion: "Verified good agronomic practice: Yellow sticky traps effectively disrupt Bemisia tabaci vector colonization before ToLCV transmission.",
    tags: ["IPM", "Whitefly", "Organic"],
  },
  {
    id: "post_02",
    authorName: "Manjunath K.",
    village: "Malur",
    crop: "Groundnut",
    timeAgo: "1 day ago",
    title: "Best gypsum application stage for pegging in TMV 2 variety?",
    content: "My groundnut crop is at day 35 (early peg formation). Should I apply gypsum now or wait for pod filling? Soil test showed calcium is moderate.",
    upvotes: 29,
    repliesCount: 5,
    aiSuggestion: "Apply 200 kg/acre Gypsum at 40-45 days after sowing (flowering to pegging). Calcium is critical for pod filling and preventing 'pops' (empty shells).",
    tags: ["Fertilizer", "Gypsum", "Groundnut"],
  },
];

export const DEMO_MACHINERY = [
  {
    id: "mach_01",
    name: "John Deere 5050D (50 HP Tractor + Rotavator)",
    category: "Tractor & Tillage",
    ownerName: "Kolar Agri Services FPO",
    distanceKm: 6.5,
    rentalRatePerHour: 850,
    availability: "Available from Tomorrow",
    phone: "+91 94480 88210",
    rating: 4.8,
    imageUrl: "/images/tractor_rental.jpg",
  },
  {
    id: "mach_02",
    name: "Hexacopter Agri Spraying Drone (16L Tank)",
    category: "Drone Spraying",
    ownerName: "KrishiFly Drone Hub",
    distanceKm: 12.0,
    rentalRatePerHour: 450, // per acre rate
    rateUnit: "per acre",
    availability: "Available Today",
    phone: "+91 98860 11920",
    rating: 4.9,
    imageUrl: "/images/drone_spraying.jpg",
  },
  {
    id: "mach_03",
    name: "Paddy & Grain Combine Harvester",
    category: "Harvester",
    ownerName: "Sri Rama Farm Tools",
    distanceKm: 18.5,
    rentalRatePerHour: 2200,
    availability: "Book 3 days ahead",
    phone: "+91 94490 33400",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
  },
];

export const DEMO_FINANCE_SUMMARY = {
  totalExpenses: 44700,
  totalRevenue: 138500,
  netProfit: 93800,
  costPerAcre: 17880,
  revenuePerAcre: 55400,
  profitPerAcre: 37520,
  expenseBreakdown: [
    { category: "Seeds & Nursery", amount: 6500, percentage: 14.5 },
    { category: "Fertilizers & Nutrients", amount: 11200, percentage: 25.0 },
    { category: "Crop Protection (IPM)", amount: 5800, percentage: 13.0 },
    { category: "Hired Labour & Weeding", amount: 14000, percentage: 31.3 },
    { category: "Machinery & Fuel", amount: 4800, percentage: 10.7 },
    { category: "Irrigation & Electricity", amount: 2400, percentage: 5.5 },
  ],
};
