/**
 * KRISHIMITRA AI — FARMER MARKETPLACE, INPUTS & ORDERING SERVICE
 * Authentic Agricultural Inputs, FPO Providers, Machinery & Safe Request Workflows
 */

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 
    | "Seeds" 
    | "Fertilizers" 
    | "Organic Inputs" 
    | "Farm Equipment" 
    | "Machinery" 
    | "Irrigation" 
    | "Crop Protection" 
    | "Storage & Post-Harvest" 
    | "Transport & Logistics"
    | "Local Agricultural Services";
  providerName: string;
  providerType: "FPO" | "Government RSK" | "Licensed Retailer" | "Agri Startup";
  location: string;
  district: string;
  state: string;
  price: number;
  unit: string;
  availability: "In Stock" | "Available Today" | "Pre-Order (2 Days)";
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  contactPhone: string;
  address: string;
  workingHours: string;
  verificationStatus: "VERIFIED" | "PENDING";
  verifiedLicenseNo: string;
  offerDiscountPercent?: number;
  offerPrice?: number;
  offerExpiry?: string; // YYYY-MM-DD
  offerTerms?: string[];
  description: string;
  specifications: string[];
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface FarmerOrder {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  deliveryAddress: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    unit: string;
    providerName: string;
  }[];
  totalAmount: number;
  creditsEarned: number;
  paymentMethod: "Pay on Delivery / Collection" | "Pay at FPO Counter" | "Direct Merchant UPI";
  status: "PLACED" | "CONFIRMED" | "PROCESSING" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
  orderDate: string;
  estimatedDelivery: string;
  notes?: string;
  cancellationReason?: string;
}

export const VERIFIED_MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "mp_01",
    name: "ICAR-IIHR Arka Rakshak F1 Hybrid Tomato Seeds (50g)",
    category: "Seeds",
    providerName: "Kolar Taluk Horticulture Farmers FPO",
    providerType: "FPO",
    location: "Kolar Town Yard",
    district: "Kolar",
    state: "Karnataka",
    price: 680,
    unit: "per 50g tin (approx 15,000 seeds)",
    availability: "In Stock",
    rating: 4.9,
    reviewsCount: 128,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 94480 88210",
    address: "Shop No. 12, APMC Complex, Kolar - 563101",
    workingHours: "08:00 AM - 06:30 PM (Mon - Sat)",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "KA-KLR-SEED-2024-9182",
    offerDiscountPercent: 12,
    offerPrice: 598,
    offerExpiry: "2026-10-31",
    offerTerms: [
      "Certified germination rate > 92%.",
      "Triple disease tolerance: ToLCV, Early Blight, and Bacterial Wilt.",
    ],
    description: "High-yielding F1 hybrid tomato bred by ICAR-IIHR Hessaraghatta. Yield potential 75-80 tons/ha with firm square-round fruits ideal for long distance transit.",
    specifications: [
      "Duration: 140 - 150 Days",
      "Fruit Weight: 90 - 100g",
      "Brix: 5.2%",
      "Disease Tolerance: ToLCV, Early Blight, Bacterial Wilt",
    ],
  },
  {
    id: "mp_02",
    name: "IFFCO Nano Urea Plus Liquid (500 ml Bottle)",
    category: "Fertilizers",
    providerName: "IFFCO Farmer Seva Kendra (Kolar Circle)",
    providerType: "Licensed Retailer",
    location: "Narasapura Industrial Hub",
    district: "Kolar",
    state: "Karnataka",
    price: 225,
    unit: "per 500ml bottle (Replaces 1 bag of 45kg Urea)",
    availability: "In Stock",
    rating: 4.8,
    reviewsCount: 210,
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80",
    contactPhone: "1800-103-1967",
    address: "Raitha Seva Kendra, Narasapura Main Road, Kolar - 563133",
    workingHours: "09:00 AM - 05:30 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "IFFCO-COOP-KA-0442",
    offerDiscountPercent: 10,
    offerPrice: 202,
    offerExpiry: "2026-11-15",
    offerTerms: [
      "Government subsidized agricultural biotechnology formulation.",
      "Mix 2-4 ml per liter water for foliar application during active tillering/branching.",
    ],
    description: "Nanotechnology-based nitrogen fertilizer providing targeted nutrient delivery directly to plant stomata with >80% absorption efficiency and zero groundwater leaching.",
    specifications: [
      "Nitrogen Content: 16% Total N w/v",
      "Shelf Life: 2 Years",
      "Target Crops: Cereals, Vegetables, Pulses",
    ],
  },
  {
    id: "mp_03",
    name: "Trichoderma Viride Bio-Fungicide (1 kg Pack)",
    category: "Organic Inputs",
    providerName: "ICAR-KVK Bio-Control Production Unit",
    providerType: "Government RSK",
    location: "Tamaka Agricultural Campus",
    district: "Kolar",
    state: "Karnataka",
    price: 180,
    unit: "per 1 kg pack (2 x 10^8 CFU/g)",
    availability: "In Stock",
    rating: 4.95,
    reviewsCount: 94,
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 81522 43110",
    address: "ICAR-KVK Campus, Tamaka, Kolar - 563103",
    workingHours: "10:00 AM - 05:00 PM (Govt Working Days)",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "ICAR-KVK-KLR-BIO-007",
    offerDiscountPercent: 15,
    offerPrice: 153,
    offerExpiry: "2026-10-15",
    offerTerms: [
      "Mix with 50 kg well-decomposed FYM/vermicompost per acre.",
      "Effective control against damping off, root rot, and collar rot.",
    ],
    description: "Antagonistic beneficial fungus for seed treatment, soil application, and nursery bed enrichment. Prevents Pythium, Fusarium, and Rhizoctonia soil pathogens naturally.",
    specifications: [
      "Spore Count: 2 x 10^8 CFU/g min",
      "Carrier: Talc powder formulation",
      "Organic Certification: NPOP / PGS-India Approved",
    ],
  },
  {
    id: "mp_04",
    name: "Garuda Agri-Pro Drone Foliar Spraying Service (1 Acre)",
    category: "Machinery",
    providerName: "KrishiFly DGCA Drone Pilot Hub",
    providerType: "Agri Startup",
    location: "Vokkaleri Pilot Station",
    district: "Kolar",
    state: "Karnataka",
    price: 450,
    unit: "per acre (Pilot + 16L Drone Included)",
    availability: "Available Today",
    rating: 4.92,
    reviewsCount: 86,
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 98860 11920",
    address: "Vokkaleri Cross, Malur Road, Kolar - 563130",
    workingHours: "06:00 AM - 06:00 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "DGCA-RPA-PILOT-2025-412",
    offerDiscountPercent: 20,
    offerPrice: 360,
    offerExpiry: "2026-10-20",
    offerTerms: [
      "Includes certified pilot and 16L hexacopter spraying drone.",
      "Farmer provides bio-fungicide or soluble fertilizer.",
    ],
    description: "High-precision automated centrifugal drone foliar spraying in 8-10 minutes per acre with uniform micro-droplet canopy penetration and 90% water savings.",
    specifications: [
      "Payload Tank: 16 Liters",
      "Spray Width: 4.5 - 6.0 meters",
      "Nozzle Type: Micronized Centrifugal Atomizers",
      "Pilot: DGCA Certified Remote Pilot License Holder",
    ],
  },
  {
    id: "mp_05",
    name: "Jain 16mm Drip Irrigation Inline Lateral Pipe (400m Roll)",
    category: "Irrigation",
    providerName: "Narasapura Irrigation & Solar Centre",
    providerType: "Licensed Retailer",
    location: "Narasapura",
    district: "Kolar",
    state: "Karnataka",
    price: 3450,
    unit: "per 400 meter coil (40cm emitter spacing, 2 LPH)",
    availability: "In Stock",
    rating: 4.75,
    reviewsCount: 64,
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 99002 44100",
    address: "NH-75 Service Road, Narasapura - 563133",
    workingHours: "08:30 AM - 07:00 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "BIS-CM/L-3891048",
    description: "Virgin polymer UV-stabilized heavy-duty inline drip tube with turbulent flow clog-resistant labyrinth drippers. BIS Class-2 standard certified.",
    specifications: [
      "Outer Diameter: 16 mm",
      "Wall Thickness: 0.9 mm (Class 2)",
      "Emitter Spacing: 40 cm",
      "Discharge Rate: 2.0 Liters per Hour",
    ],
  },
  {
    id: "mp_06",
    name: "Yellow Sticky Insect Traps & Pheromone Lure Combo (Pack of 20)",
    category: "Crop Protection",
    providerName: "Kolar IPM Bio Solutions",
    providerType: "Licensed Retailer",
    location: "Kolar APMC Road",
    district: "Kolar",
    state: "Karnataka",
    price: 320,
    unit: "per pack (15 Yellow Sheets + 5 Helilure Traps)",
    availability: "In Stock",
    rating: 4.88,
    reviewsCount: 112,
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 94481 22340",
    address: "Opp. APMC Main Gate, Kolar - 563101",
    workingHours: "09:00 AM - 06:00 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "KA-IPM-RETAIL-0812",
    offerDiscountPercent: 15,
    offerPrice: 272,
    offerExpiry: "2026-10-31",
    offerTerms: [
      "Non-toxic entomological glue stays sticky for 45 days even in rain.",
      "Attracts Whiteflies, Aphids, Thrips, and Fruit Borers.",
    ],
    description: "Eco-friendly non-chemical pest monitoring and mass trapping kit. Essential for preventing Tomato Leaf Curl Virus vector transmission.",
    specifications: [
      "Sheet Size: 15cm x 20cm double-sided",
      "Glue: Non-drying high-tack polybutene",
      "Lures: Helilure pheromone septa (Helicoverpa armigera)",
    ],
  },
  {
    id: "mp_07",
    name: "Tata Ace 1.2-Ton Dedicated APMC Transit Booking",
    category: "Transport & Logistics",
    providerName: "Narasapura Agro Logistics Co-op",
    providerType: "FPO",
    location: "Narasapura Transit Hub",
    district: "Kolar",
    state: "Karnataka",
    price: 1450,
    unit: "per trip (Farm to Bengaluru Yeshwantpur APMC)",
    availability: "Available Today",
    rating: 4.9,
    reviewsCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 98452 33901",
    address: "Toll Gate Cross, Narasapura - 563133",
    workingHours: "24/7 Agro Freight Dispatch",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "KA-LOG-COOP-1109",
    description: "Assured direct farm gate pickup to APMC mandi auction platform with clean plastic tarpaulins, digital GPS tracking, and verified driver e-way compliance.",
    specifications: [
      "Payload Capacity: 1.2 Tons (50-60 Tomato Plastic Crates)",
      "Transit Route: Narasapura -> Hosakote -> Yeshwantpur APMC (68 km)",
      "Loading Assistance: 1 Helper Included",
    ],
  },
  {
    id: "mp_08",
    name: "Controlled Atmosphere (CA) Cold Storage Bay (1 MT / Month)",
    category: "Storage & Post-Harvest",
    providerName: "Narasapura Agro Cold Chain Facility",
    providerType: "Agri Startup",
    location: "Narasapura Industrial Zone",
    district: "Kolar",
    state: "Karnataka",
    price: 850,
    unit: "per metric ton per month (4°C - 8°C Humidity Controlled)",
    availability: "In Stock",
    rating: 4.85,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 81522 99011",
    address: "Plot 18, KIADB Agro Park, Narasapura - 563133",
    workingHours: "08:00 AM - 08:00 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "WDRA-COLD-2023-5510",
    description: "Moisture-controlled pre-cooling and storage chambers extending tomato and capsicum shelf life up to 21 days during market glut periods.",
    specifications: [
      "Temperature Range: 4°C to 12°C adjustable",
      "Relative Humidity: 85% - 95% automated control",
      "Compliance: WDRA Negotiable Warehouse Receipt eligible",
    ],
  },
  {
    id: "mp_09",
    name: "Aspee 16L 12V Battery Knapsack Sprayer with Dual Nozzles",
    category: "Farm Equipment",
    providerName: "Kolar Krishi Yanthra Kendra",
    providerType: "Licensed Retailer",
    location: "Kolar Market",
    district: "Kolar",
    state: "Karnataka",
    price: 2450,
    unit: "per complete unit (12V 12Ah Battery + Charger)",
    availability: "In Stock",
    rating: 4.82,
    reviewsCount: 78,
    imageUrl: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=500&auto=format&fit=crop&q=80",
    contactPhone: "+91 94482 10923",
    address: "Clock Tower Circle, Kolar - 563101",
    workingHours: "09:00 AM - 07:00 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "KA-EQP-DEALER-4401",
    description: "Rechargeable heavy-duty battery knapsack sprayer delivering 3.6 LPM continuous high-pressure spray for up to 6 hours on single charge.",
    specifications: [
      "Tank Capacity: 16 Liters",
      "Battery: 12V 12Ah Sealed Lead Acid",
      "Pressure: 0.2 - 0.45 Mpa (Auto-cut off)",
      "Warranty: 1 Year Manufacturer Warranty",
    ],
  },
  {
    id: "mp_10",
    name: "Comprehensive 12-Parameter Soil & Borewell Water Lab Test",
    category: "Local Agricultural Services",
    providerName: "ICAR-KVK Soil Health Diagnostic Mobile Lab",
    providerType: "Government RSK",
    location: "Tamaka Campus",
    district: "Kolar",
    state: "Karnataka",
    price: 350,
    unit: "per farm sample (Includes GPS tag + Digital Card)",
    availability: "Available Today",
    rating: 4.96,
    reviewsCount: 140,
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500&auto=format&fit=crop&q=80",
    contactPhone: "08152-243110",
    address: "ICAR-KVK Diagnostic Unit, Tamaka, Kolar - 563103",
    workingHours: "09:30 AM - 04:30 PM",
    verificationStatus: "VERIFIED",
    verifiedLicenseNo: "NABL-LAB-AGRI-2023-908",
    offerDiscountPercent: 100,
    offerPrice: 0,
    offerExpiry: "2026-12-31",
    offerTerms: [
      "100% Free under Government Soil Health Mission & KrishiMitra Credits Voucher.",
    ],
    description: "Complete testing of available Nitrogen, Phosphorus, Potassium, Micronutrients, pH, Electrical Conductivity, and Water Sodium Adsorption Ratio (SAR).",
    specifications: [
      "Turnaround: 48 Hours with SMS link",
      "Report Type: Computerized Soil Health Card with NPK dosage chart",
    ],
  },
];

export class MarketplaceService {
  private static STORAGE_KEY_ORDERS = "km_farmer_orders";

  public static getInitialOrders(): FarmerOrder[] {
    const defaultOrders: FarmerOrder[] = [
      {
        id: "KM-ORD-2026-8812",
        farmerId: "farmer_001",
        farmerName: "Ramesh Gowda",
        farmerPhone: "+91 98450 12345",
        deliveryAddress: "Sri Lakshmi Farm, Survey No. 42/1, Narasapura, Kolar",
        items: [
          {
            productId: "mp_01",
            productName: "ICAR-IIHR Arka Rakshak F1 Hybrid Tomato Seeds (50g)",
            quantity: 2,
            price: 598,
            unit: "per 50g tin",
            providerName: "Kolar Taluk Horticulture Farmers FPO",
          },
          {
            productId: "mp_03",
            productName: "Trichoderma Viride Bio-Fungicide (1 kg Pack)",
            quantity: 3,
            price: 153,
            unit: "per 1 kg pack",
            providerName: "ICAR-KVK Bio-Control Unit",
          },
        ],
        totalAmount: 1655,
        creditsEarned: 35,
        paymentMethod: "Pay on Delivery / Collection",
        status: "COMPLETED",
        orderDate: "2026-09-15 10:20 AM",
        estimatedDelivery: "2026-09-16 (Delivered)",
        notes: "Collected directly at Kolar FPO input counter.",
      },
    ];

    if (typeof window === "undefined") return defaultOrders;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : defaultOrders;
    } catch {
      return defaultOrders;
    }
  }

  public static saveOrders(orders: FarmerOrder[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {}
  }
}
