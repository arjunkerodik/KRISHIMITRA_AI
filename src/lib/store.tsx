"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations } from "./i18n";
import {
  DEMO_FARMER,
  DEMO_FARMS,
  DEMO_ACTIONS,
  DEMO_SOIL_REPORT,
  Farm,
  FarmAction,
  SoilReport,
} from "./demo-data";
import {
  CreditTransaction,
  FarmerStreak,
  RewardVoucher,
  ClaimedVoucher,
  CREDIT_RULES,
  REWARDS_CATALOG,
  CreditsService,
} from "./services/creditsService";
import {
  MarketplaceProduct,
  CartItem,
  FarmerOrder,
  VERIFIED_MARKETPLACE_PRODUCTS,
  MarketplaceService,
} from "./services/marketplaceService";
import {
  VerifiedGovtScheme,
  VERIFIED_GOVERNMENT_SCHEMES,
} from "./services/governmentSchemesData";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export type UserRole = "farmer" | "expert" | "admin" | "super_admin";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: "success" | "warning" | "alert" | "info";
  duration?: number;
}

export interface FarmerReport {
  id: string;
  userId: string;
  type: "PRICE_DISCREPANCY" | "EXPIRED_OFFER" | "SCHEME_ISSUE" | "PROVIDER_ISSUE" | "GENERAL";
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  submittedAt: string;
  status: "PENDING_REVIEW" | "VERIFIED_RESOLVED" | "REJECTED";
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: typeof DEMO_FARMER;
  updateUserProfile: (updates: Partial<typeof DEMO_FARMER>) => void;
  farms: Farm[];
  activeFarm: Farm;
  setActiveFarmId: (farmId: string) => void;
  addFarm: (farm: Omit<Farm, "id">) => void;
  actions: FarmAction[];
  toggleActionCompleted: (actionId: string) => void;
  addAction: (action: Omit<FarmAction, "id">) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["en"];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  isIconFirstMode: boolean;
  toggleIconFirstMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  soilReport: SoilReport;
  updateSoilReport: (report: Partial<SoilReport>) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  offlineStatus: { isOffline: boolean; lastSynced: string };
  triggerSync: () => void;
  showToast: (title: string, message?: string, type?: ToastMessage["type"]) => void;

  // --- KRISHIMITRA CREDITS & STREAK ---
  creditsBalance: number;
  creditTransactions: CreditTransaction[];
  farmerStreak: FarmerStreak;
  awardCredits: (actionCode: keyof typeof CREDIT_RULES, customReason?: string, refId?: string) => boolean;
  recordDailyActivity: (actionCode: string) => void;

  // --- REWARDS & VOUCHERS ---
  rewardsCatalog: RewardVoucher[];
  claimedVouchers: ClaimedVoucher[];
  claimRewardVoucher: (voucherId: string) => { success: boolean; voucher?: ClaimedVoucher; message: string };

  // --- MARKETPLACE & ORDERS ---
  marketplaceProducts: MarketplaceProduct[];
  cart: CartItem[];
  addToCart: (product: MarketplaceProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: FarmerOrder[];
  placeOrder: (paymentMethod: FarmerOrder["paymentMethod"], address: string, notes?: string) => FarmerOrder | null;
  cancelOrder: (orderId: string, reason: string) => boolean;
  updateOrderStatusByAdmin: (orderId: string, status: FarmerOrder["status"]) => void;

  // --- GOVERNMENT SCHEMES ---
  governmentSchemes: VerifiedGovtScheme[];

  // --- REPORTS & AUDIT ---
  farmerReports: FarmerReport[];
  submitFarmerReport: (report: Omit<FarmerReport, "id" | "userId" | "submittedAt" | "status">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Weather Alert: Rain Window Detected",
    message: "Thunderstorms expected today at 4:30 PM (18.5mm). Drip irrigation hold advisory applied.",
    type: "warning",
    timestamp: "10 mins ago",
    read: false,
    actionUrl: "/weather",
  },
  {
    id: "notif_2",
    title: "Mandi Price Feed: Tomato at Bengaluru",
    message: "Official e-NAM feed: Bengaluru Yeshwantpur APMC is paying ₹2,780/qtl (+₹280 spread vs Kolar).",
    type: "success",
    timestamp: "1 hour ago",
    read: false,
    actionUrl: "/market",
  },
  {
    id: "notif_3",
    title: "PM-KISAN 18th Installment Verified",
    message: "Direct Benefit Transfer of ₹2,000 processed to your linked account.",
    type: "info",
    timestamp: "Yesterday",
    read: true,
    actionUrl: "/schemes",
  },
  {
    id: "notif_4",
    title: "Leaf Blight Risk Alert in Kolar Cluster",
    message: "High humidity reported in Narasapura circle. Scout your lower tomato foliage.",
    type: "alert",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/disease",
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("farmer");
  const [user, setUser] = useState(DEMO_FARMER);
  const [farms, setFarms] = useState<Farm[]>(DEMO_FARMS);
  const [activeFarmId, setActiveFarmId] = useState<string>("farm_001");
  const [actions, setActions] = useState<FarmAction[]>(DEMO_ACTIONS);
  const [language, setLanguageState] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isIconFirstMode, setIsIconFirstMode] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [soilReport, setSoilReport] = useState<SoilReport>(DEMO_SOIL_REPORT);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [offlineStatus, setOfflineStatus] = useState({
    isOffline: false,
    lastSynced: "Just now",
  });

  // Credits & Streak
  const [creditsBalance, setCreditsBalance] = useState<number>(215);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [farmerStreak, setFarmerStreak] = useState<FarmerStreak>(CreditsService.getInitialStreak());

  // Rewards
  const [rewardsCatalog] = useState<RewardVoucher[]>(REWARDS_CATALOG);
  const [claimedVouchers, setClaimedVouchers] = useState<ClaimedVoucher[]>([]);

  // Marketplace & Orders
  const [marketplaceProducts] = useState<MarketplaceProduct[]>(VERIFIED_MARKETPLACE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<FarmerOrder[]>([]);

  // Government Schemes
  const [governmentSchemes] = useState<VerifiedGovtScheme[]>(VERIFIED_GOVERNMENT_SCHEMES);

  // Farmer Reports
  const [farmerReports, setFarmerReports] = useState<FarmerReport[]>([]);

  // Load persisted preferences & services state
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("km_lang") as Language;
      if (savedLang && ["en", "hi", "kn", "te", "ta", "mr"].includes(savedLang)) {
        setLanguageState(savedLang);
      }
      const savedDark = localStorage.getItem("km_dark");
      if (savedDark === "true") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
      const savedIconFirst = localStorage.getItem("km_icon_first");
      if (savedIconFirst === "true") {
        setIsIconFirstMode(true);
      }

      // Credits & Vouchers
      setCreditsBalance(CreditsService.getInitialBalance());
      setCreditTransactions(CreditsService.getInitialTransactions());
      setFarmerStreak(CreditsService.getInitialStreak());
      setClaimedVouchers(CreditsService.getInitialClaimedVouchers());

      // Orders
      setOrders(MarketplaceService.getInitialOrders());
    } catch {}
  }, []);

  const showToast = (title: string, message?: string, type: ToastMessage["type"] = "success") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("km_lang", lang);
    } catch {}
    const langNames: Record<Language, string> = {
      en: "English",
      hi: "हिन्दी (Hindi)",
      kn: "ಕನ್ನಡ (Kannada)",
      te: "తెలుగు (Telugu)",
      ta: "தமிழ் (Tamil)",
      mr: "मराठी (Marathi)",
    };
    showToast(`Language switched to ${langNames[lang] || lang}`, undefined, "info");
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      try {
        localStorage.setItem("km_dark", String(next));
      } catch {}
      showToast(next ? "Dark mode activated" : "Light mode activated", undefined, "info");
      return next;
    });
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      showToast(next ? "SIH Demo Mode enabled (Verified Datasets)" : "Live API mode enabled", undefined, "info");
      return next;
    });
  };

  const toggleIconFirstMode = () => {
    setIsIconFirstMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("km_icon_first", String(next));
      } catch {}
      showToast(next ? "Icon-First Accessible Mode enabled" : "Standard text mode enabled", undefined, "info");
      return next;
    });
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      showToast(next ? "High contrast mode enabled" : "Standard contrast enabled", undefined, "info");
      return next;
    });
  };

  const updateUserProfile = (updates: Partial<typeof DEMO_FARMER>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    awardCredits("PROFILE_COMPLETION", "Profile information updated with verified KYC details.");
    showToast("Farmer Profile Updated", undefined, "success");
  };

  const addFarm = (newFarmData: Omit<Farm, "id">) => {
    const newId = `farm_${Date.now()}`;
    const newFarm: Farm = { ...newFarmData, id: newId };
    setFarms((prev) => [...prev, newFarm]);
    setActiveFarmId(newId);
    awardCredits("FARM_BOUNDARY_GIS", `Registered new farm plot ${newFarm.name} (${newFarm.areaAcres} Acres).`);
    showToast(`Plot Added: ${newFarm.name}`, `${newFarm.areaAcres} Acres registered`, "success");
  };

  const toggleActionCompleted = (actionId: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          const nextState = !act.completed;
          if (nextState) {
            recordDailyActivity("FARM_TASK_COMPLETED");
          }
          showToast(
            nextState ? "Task Completed!" : "Task marked as Pending",
            act.title,
            nextState ? "success" : "info"
          );
          return { ...act, completed: nextState };
        }
        return act;
      })
    );
  };

  const addAction = (newAct: Omit<FarmAction, "id">) => {
    const id = `act_${Date.now()}`;
    setActions((prev) => [{ ...newAct, id }, ...prev]);
    showToast("New Farm Task Scheduled", newAct.title, "success");
  };

  const updateSoilReport = (updates: Partial<SoilReport>) => {
    setSoilReport((prev) => ({ ...prev, ...updates }));
    awardCredits("SOIL_REPORT_UPLOAD", "Uploaded lab-verified NPK soil parameters.");
    showToast("Soil Health Card Updated", "New stoichiometric NPK balance calculated", "success");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read", undefined, "info");
  };

  const triggerSync = () => {
    setOfflineStatus({
      isOffline: false,
      lastSynced: "Just now",
    });
    showToast("Offline Data Synchronized", "All farm records synced to verified ledger", "success");
  };

  // --- KRISHIMITRA CREDITS & STREAK IMPLEMENTATION ---
  const awardCredits = (
    actionCode: keyof typeof CREDIT_RULES,
    customReason?: string,
    refId?: string
  ): boolean => {
    const validation = CreditsService.canEarnAction(actionCode, creditTransactions);
    if (!validation.allowed) {
      return false;
    }

    const rule = CREDIT_RULES[actionCode];
    const amount = rule.credits;
    const newBalance = creditsBalance + amount;

    const newTx: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      type: "EARNED",
      amount,
      balanceAfter: newBalance,
      actionCode: rule.code,
      reason: customReason || rule.label,
      referenceId: refId,
      timestamp: new Date().toLocaleString(),
    };

    const updatedTxs = [newTx, ...creditTransactions];
    setCreditsBalance(newBalance);
    setCreditTransactions(updatedTxs);

    try {
      localStorage.setItem("km_credits_balance", String(newBalance));
      localStorage.setItem("km_credits_transactions", JSON.stringify(updatedTxs));
    } catch {}

    showToast(
      `+${amount} KrishiMitra Credits Earned! 🪙`,
      `${rule.label}. Total Balance: ${newBalance} Credits`,
      "success"
    );

    return true;
  };

  const recordDailyActivity = (activityCode: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    setFarmerStreak((prev) => {
      if (prev.todayActions.includes(activityCode)) {
        return prev;
      }

      const isConsecutive = prev.lastActiveDate !== todayStr;
      const nextStreak = isConsecutive ? prev.currentStreak + 1 : prev.currentStreak;
      const nextLongest = Math.max(prev.longestStreak, nextStreak);
      const updatedActions = [...prev.todayActions, activityCode];

      const updatedStreak: FarmerStreak = {
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastActiveDate: todayStr,
        todayActions: updatedActions,
        totalActivitiesLogged: prev.totalActivitiesLogged + 1,
      };

      try {
        localStorage.setItem("km_credits_streak", JSON.stringify(updatedStreak));
      } catch {}

      // Award daily engagement credit
      awardCredits("DAILY_ADVISORY_CHECKIN", `Daily engagement verified: ${activityCode}`);

      // Check milestones
      if (nextStreak === 7 && !prev.todayActions.includes("MILESTONE_7")) {
        awardCredits("STREAK_7_DAY_BONUS", "Reached 7-Day Smart Farming Engagement Streak!");
      } else if (nextStreak === 14 && !prev.todayActions.includes("MILESTONE_14")) {
        awardCredits("STREAK_14_DAY_BONUS", "Reached 14-Day Smart Farming Engagement Streak!");
      }

      return updatedStreak;
    });
  };

  // --- REWARDS CLAIMING ---
  const claimRewardVoucher = (voucherId: string) => {
    const voucher = rewardsCatalog.find((r) => r.id === voucherId);
    if (!voucher) {
      return { success: false, message: "Reward not found." };
    }

    if (creditsBalance < voucher.creditCost) {
      showToast(
        "Insufficient Credits",
        `You need ${voucher.creditCost} credits to redeem this coupon. Current balance: ${creditsBalance}.`,
        "warning"
      );
      return { success: false, message: "Insufficient credits." };
    }

    // Check anti-fraud duplicate claims in last 7 days
    const alreadyClaimed = claimedVouchers.find(
      (c) => c.voucherId === voucherId && c.status === "ACTIVE"
    );
    if (alreadyClaimed) {
      showToast("Voucher Already Active", `You already have an active coupon: ${alreadyClaimed.couponCode}`, "info");
      return { success: false, message: "You already have an active voucher for this offer." };
    }

    const newBalance = creditsBalance - voucher.creditCost;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + voucher.validDays);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCoupon: ClaimedVoucher = {
      claimId: `clm_${Date.now()}`,
      voucherId: voucher.id,
      voucherTitle: voucher.title,
      partnerName: voucher.partnerName,
      couponCode: `${voucher.couponCodePrefix}-${randomSuffix}-KA`,
      discountValue: voucher.discountValue,
      claimedAt: new Date().toLocaleDateString(),
      expiresAt: expiryDate.toLocaleDateString(),
      status: "ACTIVE",
    };

    const newTx: CreditTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: "SPENT",
      amount: voucher.creditCost,
      balanceAfter: newBalance,
      actionCode: "REWARD_REDEEMED",
      reason: `Redeemed ${voucher.title}`,
      referenceId: newCoupon.claimId,
      timestamp: new Date().toLocaleString(),
    };

    const updatedVouchers = [newCoupon, ...claimedVouchers];
    const updatedTxs = [newTx, ...creditTransactions];

    setCreditsBalance(newBalance);
    setClaimedVouchers(updatedVouchers);
    setCreditTransactions(updatedTxs);

    try {
      localStorage.setItem("km_credits_balance", String(newBalance));
      localStorage.setItem("km_credits_transactions", JSON.stringify(updatedTxs));
      localStorage.setItem("km_credits_vouchers", JSON.stringify(updatedVouchers));
    } catch {}

    showToast(
      "Coupon Unlocked! 🎉",
      `Coupon Code: ${newCoupon.couponCode} redeemed for ${voucher.partnerName}`,
      "success"
    );

    return { success: true, voucher: newCoupon, message: "Voucher claimed successfully." };
  };

  // --- MARKETPLACE & CART ---
  const addToCart = (product: MarketplaceProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [...prev, { product, quantity }];
      }
      showToast("Added to Cart 🛒", `${product.name} (${quantity} unit)`, "success");
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart", undefined, "info");
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    paymentMethod: FarmerOrder["paymentMethod"],
    deliveryAddress: string,
    notes?: string
  ): FarmerOrder | null => {
    if (cart.length === 0) {
      showToast("Cart is empty", "Please add items before placing order", "warning");
      return null;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KM-ORD-2026-${orderNum}`;
    const totalAmount = cart.reduce(
      (sum, item) => sum + (item.product.offerPrice || item.product.price) * item.quantity,
      0
    );

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 1);

    const newOrder: FarmerOrder = {
      id: orderId,
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      deliveryAddress: deliveryAddress || `${activeFarm.name}, ${activeFarm.village}, ${activeFarm.district}`,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        price: c.product.offerPrice || c.product.price,
        unit: c.product.unit,
        providerName: c.product.providerName,
      })),
      totalAmount,
      creditsEarned: 35,
      paymentMethod,
      status: "PLACED",
      orderDate: new Date().toLocaleString(),
      estimatedDelivery: `${estDate.toLocaleDateString()} (Within 24 Hours)`,
      notes,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    MarketplaceService.saveOrders(updatedOrders);
    clearCart();

    // Award KrishiMitra Credits for placing genuine order
    awardCredits("MARKETPLACE_ORDER_COMPLETED", `Order Placed #${orderId}`, orderId);

    showToast(
      "Order Placed Successfully! 📦",
      `Order ID: ${orderId} • Dispatch confirmation sent to ${newOrder.farmerPhone}`,
      "success"
    );

    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? ({ ...o, status: "CANCELLED" as const, cancellationReason: reason })
        : o
    );

    setOrders(updatedOrders);
    MarketplaceService.saveOrders(updatedOrders);

    // Anti-fraud credit rollback
    if (order.creditsEarned > 0) {
      const newBal = Math.max(0, creditsBalance - order.creditsEarned);
      const rollbackTx: CreditTransaction = {
        id: `tx_${Date.now()}`,
        userId: user.id,
        type: "REVOKED",
        amount: order.creditsEarned,
        balanceAfter: newBal,
        actionCode: "ORDER_CANCELLED_ROLLBACK",
        reason: `Reconciled credits for cancelled order #${orderId}`,
        referenceId: orderId,
        timestamp: new Date().toLocaleString(),
      };
      const updatedTxs = [rollbackTx, ...creditTransactions];
      setCreditsBalance(newBal);
      setCreditTransactions(updatedTxs);
      try {
        localStorage.setItem("km_credits_balance", String(newBal));
        localStorage.setItem("km_credits_transactions", JSON.stringify(updatedTxs));
      } catch {}
    }

    showToast("Order Cancelled", `Order #${orderId} cancelled. Reason: ${reason}`, "info");
    return true;
  };

  const updateOrderStatusByAdmin = (orderId: string, status: FarmerOrder["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    MarketplaceService.saveOrders(updated);
    showToast("Order Status Updated (Admin)", `Order #${orderId} moved to ${status}`, "info");
  };

  const submitFarmerReport = (reportData: Omit<FarmerReport, "id" | "userId" | "submittedAt" | "status">) => {
    const newReport: FarmerReport = {
      id: `rep_${Date.now()}`,
      userId: user.id,
      ...reportData,
      submittedAt: new Date().toLocaleString(),
      status: "PENDING_REVIEW",
    };

    setFarmerReports((prev) => [newReport, ...prev]);
    awardCredits("MANDI_PRICE_REPORT", `Submitted verified community audit report for ${reportData.targetName}`);
    showToast("Feedback Submitted to Quality Desk", "Thank you for keeping KrishiMitra accurate & reliable.", "success");
  };

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0] || DEMO_FARMS[0];
  const t = translations[language] || translations.en;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        updateUserProfile,
        farms,
        activeFarm,
        setActiveFarmId,
        addFarm,
        actions,
        toggleActionCompleted,
        addAction,
        language,
        setLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        isDemoMode,
        toggleDemoMode,
        isIconFirstMode,
        toggleIconFirstMode,
        isHighContrast,
        toggleHighContrast,
        soilReport,
        updateSoilReport,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        offlineStatus,
        triggerSync,
        showToast,

        // Credits & Streaks
        creditsBalance,
        creditTransactions,
        farmerStreak,
        awardCredits,
        recordDailyActivity,

        // Rewards
        rewardsCatalog,
        claimedVouchers,
        claimRewardVoucher,

        // Marketplace
        marketplaceProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        cancelOrder,
        updateOrderStatusByAdmin,

        // Schemes
        governmentSchemes,

        // Reports
        farmerReports,
        submitFarmerReport,
      }}
    >
      {children}

      {/* Global Interactive Toast Notification Overlay */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-xl border text-xs animate-in slide-in-from-bottom-5 fade-in duration-200 ${
              toast.type === "success"
                ? "bg-black/90 border-emerald-500/50 text-emerald-100"
                : toast.type === "warning"
                ? "bg-black/90 border-amber-500/50 text-amber-100"
                : toast.type === "alert"
                ? "bg-black/90 border-rose-500/50 text-rose-100"
                : "bg-black/90 border-sky-500/50 text-sky-100"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {toast.type === "alert" && <XCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold">{toast.title}</p>
              {toast.message && <p className="opacity-80 mt-0.5 text-[11px] leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 p-0.5 -mr-1 text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
