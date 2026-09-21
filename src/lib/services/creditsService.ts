/**
 * KRISHIMITRA AI — CREDITS, STREAKS & LOYALTY REWARDS SERVICE
 * Farmer Engagement, Anti-Fraud Validation & Non-Governmental Loyalty Economy
 */

export interface CreditTransaction {
  id: string;
  userId: string;
  type: "EARNED" | "SPENT" | "REVOKED";
  amount: number;
  balanceAfter: number;
  actionCode: string;
  reason: string;
  referenceId?: string;
  timestamp: string;
}

export interface FarmerStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayActions: string[];
  totalActivitiesLogged: number;
}

export interface RewardVoucher {
  id: string;
  title: string;
  category: "Bio-Inputs" | "Soil Testing" | "Seed Discount" | "Drone Pilot" | "Logistics Subsidy" | "Krishi Equipment";
  partnerName: string;
  description: string;
  creditCost: number;
  discountValue: string;
  validDays: number;
  stockRemaining: number;
  termsAndConditions: string[];
  couponCodePrefix: string;
  isDemoReward: boolean;
}

export interface ClaimedVoucher {
  claimId: string;
  voucherId: string;
  voucherTitle: string;
  partnerName: string;
  couponCode: string;
  discountValue: string;
  claimedAt: string;
  expiresAt: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
  qrCodeUrl?: string;
}

// Fixed legit earning rules
export const CREDIT_RULES = {
  PROFILE_COMPLETION: { code: "PROFILE_COMPLETION", credits: 50, label: "Farmer KYC & Aadhaar Seeding", maxPerDay: 1 },
  FARM_BOUNDARY_GIS: { code: "FARM_BOUNDARY_GIS", credits: 75, label: "Farm Plot GIS Geo-Fencing", maxPerDay: 1 },
  DISEASE_SCAN_DIAGNOSIS: { code: "DISEASE_SCAN_DIAGNOSIS", credits: 20, label: "Crop Disease AI Pathology Scan", maxPerDay: 3 },
  SOIL_REPORT_UPLOAD: { code: "SOIL_REPORT_UPLOAD", credits: 40, label: "Soil Health Card NPK Lab Verification", maxPerDay: 1 },
  MARKETPLACE_ORDER_COMPLETED: { code: "MARKETPLACE_ORDER_COMPLETED", credits: 35, label: "Verified Agricultural Input Procurement", maxPerDay: 5 },
  DAILY_ADVISORY_CHECKIN: { code: "DAILY_ADVISORY_CHECKIN", credits: 10, label: "Daily Weather & IPM Advisory Check-in", maxPerDay: 1 },
  MANDI_PRICE_REPORT: { code: "MANDI_PRICE_REPORT", credits: 15, label: "Community Mandi Ground Price Feedback", maxPerDay: 2 },
  STREAK_7_DAY_BONUS: { code: "STREAK_7_DAY_BONUS", credits: 100, label: "7-Day Consecutive Farmer Engagement Milestone", maxPerDay: 1 },
  STREAK_14_DAY_BONUS: { code: "STREAK_14_DAY_BONUS", credits: 250, label: "14-Day Consecutive Engagement Milestone", maxPerDay: 1 },
};

// Verified Catalog of Rewards
export const REWARDS_CATALOG: RewardVoucher[] = [
  {
    id: "rew_01",
    title: "₹200 IFFCO Bio-Fertilizer & Nano Urea Coupon",
    category: "Bio-Inputs",
    partnerName: "IFFCO Farmer Seva Kendra (Kolar)",
    description: "Instant ₹200 rebate on purchase of 2 bottles of IFFCO Nano Urea Plus or Liquid Bio-Fertilizers.",
    creditCost: 150,
    discountValue: "₹200 OFF",
    validDays: 30,
    stockRemaining: 48,
    termsAndConditions: [
      "Valid at any authorized IFFCO cooperative counter or KrishiMitra partner retail outlet.",
      "Minimum order value: ₹500.",
      "Non-transferable; valid for 1 registered farmer profile.",
    ],
    couponCodePrefix: "IFFCO-BIO",
    isDemoReward: false,
  },
  {
    id: "rew_02",
    title: "100% Free Soil Micronutrient Lab Analysis",
    category: "Soil Testing",
    partnerName: "ICAR-KVK Soil Health Diagnostic Lab",
    description: "Free comprehensive 12-parameter soil testing including organic carbon and electrical conductivity.",
    creditCost: 220,
    discountValue: "100% FREE (Worth ₹350)",
    validDays: 45,
    stockRemaining: 25,
    termsAndConditions: [
      "Bring 500g dry soil sample in clean bag with GPS coordinates.",
      "Turnaround time: 48 working hours with computerized card.",
    ],
    couponCodePrefix: "KVK-SOIL",
    isDemoReward: false,
  },
  {
    id: "rew_03",
    title: "10% Instant Rebate on Certified Hybrid Seeds",
    category: "Seed Discount",
    partnerName: "Kolar Horticulture FPO & NSC",
    description: "10% off on Arka Rakshak Tomato, TMV-2 Groundnut, or Certified Sweet Corn hybrid seed packets.",
    creditCost: 100,
    discountValue: "10% DISCOUNT",
    validDays: 20,
    stockRemaining: 65,
    termsAndConditions: [
      "Maximum discount capped at ₹450 per farmer.",
      "Applicable only on government/ICAR certified hybrid seed batches.",
    ],
    couponCodePrefix: "SEED-FPO",
    isDemoReward: false,
  },
  {
    id: "rew_04",
    title: "₹500 Drone Foliar Spraying Voucher",
    category: "Drone Pilot",
    partnerName: "KrishiFly DGCA Drone Hub",
    description: "₹500 flat discount for 1-acre ultra-fine micronized organic foliar nutrient spraying.",
    creditCost: 350,
    discountValue: "₹500 OFF",
    validDays: 60,
    stockRemaining: 18,
    termsAndConditions: [
      "Slot booking required 24 hours in advance.",
      "Valid for agricultural spray applications only (zero crop trampling guarantee).",
    ],
    couponCodePrefix: "DRONE-AGRI",
    isDemoReward: false,
  },
  {
    id: "rew_05",
    title: "₹300 APMC Transport & Crates Subsidy",
    category: "Logistics Subsidy",
    partnerName: "Narasapura Agro Transport Syndicate",
    description: "Direct transport freight reduction for sending produce to Bengaluru Yeshwantpur APMC yard.",
    creditCost: 200,
    discountValue: "₹300 FREIGHT OFF",
    validDays: 15,
    stockRemaining: 30,
    termsAndConditions: [
      "Applicable for minimum 15 quintal dispatch loads.",
      "Rebate credited against verified driver e-way bill.",
    ],
    couponCodePrefix: "TRANS-MANDI",
    isDemoReward: false,
  },
];

// In-Memory & LocalStorage Persisted State Helpers
export class CreditsService {
  private static STORAGE_KEY_BALANCE = "km_credits_balance";
  private static STORAGE_KEY_TXS = "km_credits_transactions";
  private static STORAGE_KEY_STREAK = "km_credits_streak";
  private static STORAGE_KEY_VOUCHERS = "km_credits_vouchers";

  public static getInitialBalance(): number {
    if (typeof window === "undefined") return 215;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_BALANCE);
      return saved ? parseInt(saved, 10) : 215;
    } catch {
      return 215;
    }
  }

  public static getInitialTransactions(): CreditTransaction[] {
    const defaultTxs: CreditTransaction[] = [
      {
        id: "tx_01",
        userId: "farmer_001",
        type: "EARNED",
        amount: 50,
        balanceAfter: 50,
        actionCode: "PROFILE_COMPLETION",
        reason: "Completed Farmer KYC Profile & Land Survey Details",
        timestamp: "2026-09-14 09:30 AM",
      },
      {
        id: "tx_02",
        userId: "farmer_001",
        type: "EARNED",
        amount: 75,
        balanceAfter: 125,
        actionCode: "FARM_BOUNDARY_GIS",
        reason: "Mapped 4.0 Acres Geo-Spatial Digital Twin Boundary",
        timestamp: "2026-09-15 11:15 AM",
      },
      {
        id: "tx_03",
        userId: "farmer_001",
        type: "EARNED",
        amount: 40,
        balanceAfter: 165,
        actionCode: "SOIL_REPORT_UPLOAD",
        reason: "Uploaded Verified Kolar KVK Soil Health Card",
        timestamp: "2026-09-17 02:45 PM",
      },
      {
        id: "tx_04",
        userId: "farmer_001",
        type: "EARNED",
        amount: 50,
        balanceAfter: 215,
        actionCode: "DISEASE_SCAN_DIAGNOSIS",
        reason: "Diagnosed Early Blight & implemented prophylactic treatment",
        timestamp: "2026-09-19 08:20 AM",
      },
    ];

    if (typeof window === "undefined") return defaultTxs;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_TXS);
      return saved ? JSON.parse(saved) : defaultTxs;
    } catch {
      return defaultTxs;
    }
  }

  public static getInitialStreak(): FarmerStreak {
    const todayStr = new Date().toISOString().split("T")[0];
    const defaultStreak: FarmerStreak = {
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: todayStr,
      todayActions: ["DAILY_ADVISORY_CHECKIN"],
      totalActivitiesLogged: 24,
    };

    if (typeof window === "undefined") return defaultStreak;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_STREAK);
      return saved ? JSON.parse(saved) : defaultStreak;
    } catch {
      return defaultStreak;
    }
  }

  public static getInitialClaimedVouchers(): ClaimedVoucher[] {
    const defaultVouchers: ClaimedVoucher[] = [
      {
        claimId: "clm_01",
        voucherId: "rew_01",
        voucherTitle: "₹200 IFFCO Bio-Fertilizer & Nano Urea Coupon",
        partnerName: "IFFCO Farmer Seva Kendra (Kolar)",
        couponCode: "IFFCO-BIO-7492-KA",
        discountValue: "₹200 OFF",
        claimedAt: "2026-09-16",
        expiresAt: "2026-10-16",
        status: "ACTIVE",
      },
    ];

    if (typeof window === "undefined") return defaultVouchers;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_VOUCHERS);
      return saved ? JSON.parse(saved) : defaultVouchers;
    } catch {
      return defaultVouchers;
    }
  }

  /**
   * Anti-fraud validation for earning credits
   */
  public static canEarnAction(
    actionCode: keyof typeof CREDIT_RULES,
    history: CreditTransaction[]
  ): { allowed: boolean; reason?: string } {
    const rule = CREDIT_RULES[actionCode];
    if (!rule) return { allowed: false, reason: "Invalid rule code." };

    const todayStr = new Date().toLocaleDateString();
    const todayActionCount = history.filter((t) => {
      const txDate = new Date(t.timestamp).toLocaleDateString();
      return txDate === todayStr && t.actionCode === rule.code;
    }).length;

    if (todayActionCount >= rule.maxPerDay) {
      return {
        allowed: false,
        reason: `Daily limit reached for ${rule.label} (Max ${rule.maxPerDay} per day to prevent spam).`,
      };
    }

    return { allowed: true };
  }
}
