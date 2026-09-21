export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr';

export interface Translations {
  appName: string;
  appTagline: string;
  telemetry: {
    satelliteStatus: string;
    locationText: string;
    mandiSync: string;
    credits: string;
    live: string;
    commandCenter: string;
  };
  nav: {
    overview: string;
    dashboard: string;
    digitalTwin: string;
    schemes: string;
    market: string;
    marketplace: string;
    credits: string;
    transparency: string;
    admin: string;
    farmtalk: string;
    diseaseScanner: string;
    soilHealth: string;
    weather: string;
    cropAdvisor: string;
    cropCalendar: string;
    machinery: string;
    labour: string;
    finance: string;
    insurance: string;
    irrigation: string;
    pests: string;
    satellite: string;
    farmMap: string;
    community: string;
    resources: string;
    support: string;
    alerts: string;
    voiceAssistant: string;
    settings: string;
    logout: string;
    login: string;
  };
  sectors: {
    fieldTelemetry: string;
    mandisEconomics: string;
    loyaltyRewards: string;
    governanceAi: string;
    utilityHub: string;
  };
  dashboard: {
    welcome: string;
    farmHealthScore: string;
    todaysPlan: string;
    todaysPlanSub: string;
    whyThisAction: string;
    weatherToday: string;
    cropStage: string;
    waterStatus: string;
    marketPrice: string;
    diseaseRisk: string;
    pestRisk: string;
    farmRiskScore: string;
    activeSchemes: string;
    quickDiseaseScan: string;
    askCopilot: string;
    viewAllActions: string;
    fieldNotes: string;
    offlineNotice: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    centralGovt: string;
    stateGovt: string;
    directTransfer: string;
    subsidy: string;
    eligibilityCheck: string;
    applyOfficial: string;
    documentsRequired: string;
    disclaimer: string;
  };
  market: {
    title: string;
    subtitle: string;
    todayModal: string;
    priceSpread: string;
    transportCost: string;
    netRealization: string;
    bestMandi: string;
    compareMandis: string;
    distance: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    verifiedFpo: string;
    addToCart: string;
    buyNow: string;
    delivery: string;
    inStock: string;
    orderNow: string;
  };
  credits: {
    title: string;
    balance: string;
    streakDays: string;
    earnRules: string;
    redeemVoucher: string;
    claimCoupon: string;
  };
  farmtalk: {
    title: string;
    subtitle: string;
    askPlaceholder: string;
    send: string;
    suggestedQueries: string;
    citationSource: string;
    instantIntelligence: string;
  };
  actions: {
    save: string;
    cancel: string;
    submit: string;
    analyze: string;
    upload: string;
    viewDetails: string;
    apply: string;
    calculate: string;
    filter: string;
    search: string;
    refresh: string;
    speak: string;
    exportData: string;
    completed: string;
    pending: string;
  };
  common: {
    acres: string;
    quintal: string;
    rupees: string;
    confidence: string;
    severity: string;
    high: string;
    medium: string;
    low: string;
    safe: string;
    danger: string;
    warning: string;
    recommended: string;
    verified: string;
    official: string;
  };
}

export const translations: Record<Language, Translations> = {
  // ==========================================
  // 1. ENGLISH (EN)
  // ==========================================
  en: {
    appName: "KrishiMitra AI",
    appTagline: "Sovereign AI Smart Agriculture & Digital Twin Command Center",
    telemetry: {
      satelliteStatus: "SATELLITE TELEMETRY: ACTIVE",
      locationText: "LOC: 15.4292° N, 75.6318° E (GADAG, KA)",
      mandiSync: "AGMARKNET / e-NAM: LIVE SYNC",
      credits: "CREDITS",
      live: "LIVE",
      commandCenter: "Operations Command",
    },
    nav: {
      overview: "Overview",
      dashboard: "Digital Twin",
      digitalTwin: "Digital Twin",
      schemes: "Govt Schemes",
      market: "Mandi Rates",
      marketplace: "Marketplace",
      credits: "Credits & Rewards",
      transparency: "Provenance",
      admin: "Governance",
      farmtalk: "FarmTalk AI Copilot",
      diseaseScanner: "Disease Scanner",
      soilHealth: "Soil Health",
      weather: "Weather Intelligence",
      cropAdvisor: "Crop Advisor",
      cropCalendar: "Crop Calendar",
      machinery: "Machinery Rental",
      labour: "Labour & Wages",
      finance: "Farm Finance",
      insurance: "Crop Insurance",
      irrigation: "Smart Irrigation",
      pests: "Pest Defense",
      satellite: "Satellite & Drone",
      farmMap: "GIS Farm Map",
      community: "Farmer Forum",
      resources: "Resource Hub",
      support: "Support Hub",
      alerts: "Weather Alerts",
      voiceAssistant: "Voice Assistant",
      settings: "Settings",
      logout: "Sign Out",
      login: "Sign In",
    },
    sectors: {
      fieldTelemetry: "FIELD TELEMETRY & PLOTS",
      mandisEconomics: "MANDIS & ECONOMICS",
      loyaltyRewards: "LOYALTY & REWARDS",
      governanceAi: "GOVERNANCE & AI",
      utilityHub: "UTILITIES & COMMUNITY",
    },
    dashboard: {
      welcome: "Welcome back, {name}",
      farmHealthScore: "Farm Health Score",
      todaysPlan: "Today's Farm Action Plan",
      todaysPlanSub: "Deterministic AI guidance calculated from soil, weather, stage & market",
      whyThisAction: "Agronomic Justification:",
      weatherToday: "Weather & Forecast",
      cropStage: "Crop Phenology Stage",
      waterStatus: "Soil Moisture & Water Status",
      marketPrice: "Best Mandi Modal Price",
      diseaseRisk: "Disease Risk Level",
      pestRisk: "Pest Pressure Index",
      farmRiskScore: "Farm Risk Index",
      activeSchemes: "Matched Govt Benefits",
      quickDiseaseScan: "Scan Crop Foliage",
      askCopilot: "Consult FarmTalk AI",
      viewAllActions: "View Full Advisory",
      fieldNotes: "Log Daily Activity",
      offlineNotice: "Showing verified cached data. Last synced {time} ago.",
    },
    schemes: {
      title: "Government Schemes Hub",
      subtitle: "100% Verified Sovereign Schemes directly from myScheme.gov.in & Agriculture Ministry",
      centralGovt: "Central Sector",
      stateGovt: "State Scheme",
      directTransfer: "Direct Benefit Transfer (DBT)",
      subsidy: "Subsidy Scheme",
      eligibilityCheck: "Instant Eligibility Check",
      applyOfficial: "Apply on Official Govt Portal",
      documentsRequired: "Required Documents Checklist",
      disclaimer: "Official Redirection Notice: You are navigating to an official .gov.in sovereign portal.",
    },
    market: {
      title: "Real-Time Mandi Price Intelligence",
      subtitle: "Official daily arrivals and modal prices sourced from AGMARKNET and e-NAM",
      todayModal: "Today's Modal Price",
      priceSpread: "Price Spread",
      transportCost: "Transport Cost (₹/qtl)",
      netRealization: "Net Farmer Realization",
      bestMandi: "Recommended APMC Market",
      compareMandis: "Compare APMC Mandis",
      distance: "Distance",
    },
    marketplace: {
      title: "Verified Agricultural Marketplace",
      subtitle: "Certified seeds, organic inputs & fertilizers from licensed FPOs and KVKs",
      verifiedFpo: "Govt-Licensed FPO",
      addToCart: "Add to Cart",
      buyNow: "Direct Order",
      delivery: "Express Delivery (24-48 Hrs)",
      inStock: "In Stock",
      orderNow: "Place Order",
    },
    credits: {
      title: "KrishiMitra Loyalty Credits & Streaks",
      balance: "Available Balance",
      streakDays: "Daily Farming Streak",
      earnRules: "Credit Earning Ledger",
      redeemVoucher: "Redeem Discount Coupons",
      claimCoupon: "Claim Voucher",
    },
    farmtalk: {
      title: "FarmTalk Sovereign AI Copilot",
      subtitle: "Instant Agronomic Decision Engine backed by ICAR, KAU & TNAU Knowledge Base",
      askPlaceholder: "Ask in English, Hindi, Kannada, Telugu, Tamil or Marathi...",
      send: "Ask Copilot",
      suggestedQueries: "Suggested Queries",
      citationSource: "Official Scientific Citation",
      instantIntelligence: "100% Instant Deterministic Response",
    },
    actions: {
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      analyze: "Analyze Now",
      upload: "Upload Photo / File",
      viewDetails: "View Details",
      apply: "Apply for Scheme",
      calculate: "Calculate Profit",
      filter: "Filter",
      search: "Search...",
      refresh: "Refresh Data",
      speak: "Speak",
      exportData: "Export Report (PDF)",
      completed: "Completed",
      pending: "Pending",
    },
    common: {
      acres: "Acres",
      quintal: "Quintal",
      rupees: "₹",
      confidence: "Confidence",
      severity: "Severity",
      high: "High",
      medium: "Medium",
      low: "Low",
      safe: "Optimal",
      danger: "Critical",
      warning: "Attention Needed",
      recommended: "Recommended",
      verified: "Govt Verified",
      official: "Official Source",
    },
  },

  // ==========================================
  // 2. HINDI (HI) - हिन्दी
  // ==========================================
  hi: {
    appName: "कृषिमित्र AI",
    appTagline: "स्मार्ट कृषि एवं डिजिटल ट्विन ऑपरेशंस कमांड सेंटर",
    telemetry: {
      satelliteStatus: "उपग्रह टेलीमेट्री: सक्रिय",
      locationText: "स्थान: 15.4292° N, 75.6318° E (गदग, कर्नाटक)",
      mandiSync: "एगमार्कनेट / ई-नाम: लाइव सिंक",
      credits: "क्रेडिट",
      live: "लाइव",
      commandCenter: "ऑपरेशंस कमांड",
    },
    nav: {
      overview: "सिंहावलोकन",
      dashboard: "डिजिटल खेत",
      digitalTwin: "डिजिटल खेत",
      schemes: "सरकारी योजनाएं",
      market: "मंडी भाव व बिक्री",
      marketplace: "कृषि बाजार",
      credits: "क्रेडिट व पुरस्कार",
      transparency: "डेटा प्रमाणिकता",
      admin: "प्रशासन व नीति",
      farmtalk: "फार्मटॉक एआई सहायक",
      diseaseScanner: "रोग स्कैनर",
      soilHealth: "मृदा स्वास्थ्य",
      weather: "मौसम पूर्वानुमान",
      cropAdvisor: "फसल सलाहकार",
      cropCalendar: "फसल चक्र",
      machinery: "कृषि यंत्र किराया",
      labour: "मजदूरी प्रबंधन",
      finance: "कृषि वित्त",
      insurance: "फसल बीमा",
      irrigation: "स्मार्ट सिंचाई",
      pests: "कीट नियंत्रण",
      satellite: "उपग्रह व ड्रोन",
      farmMap: "खेत का नक्शा (GIS)",
      community: "किसान मंच",
      resources: "कृषि संसाधन केंद्र",
      support: "किसान सहायता केंद्र",
      alerts: "मौसम अलर्ट",
      voiceAssistant: "आवाज सहायक",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      login: "लॉग इन",
    },
    sectors: {
      fieldTelemetry: "खेत टेलीमेट्री व भूखंड",
      mandisEconomics: "मंडी भाव व अर्थशास्त्र",
      loyaltyRewards: "क्रेडिट व पुरस्कार",
      governanceAi: "प्रशासन व एआई इंजन",
      utilityHub: "सुविधाएं व समुदाय",
    },
    dashboard: {
      welcome: "नमस्ते, {name}",
      farmHealthScore: "खेत स्वास्थ्य स्कोर",
      todaysPlan: "आज का कृषि कार्य (Farm Plan)",
      todaysPlanSub: "मौसम, मिट्टी, फसल चरण और मंडी पर आधारित सटीक वैज्ञानिक कार्य",
      whyThisAction: "वैज्ञानिक कारण:",
      weatherToday: "आज का मौसम व पूर्वानुमान",
      cropStage: "फसल का वर्तमान चरण",
      waterStatus: "मिट्टी में नमी व जल स्थिति",
      marketPrice: "सर्वश्रेष्ठ मंडी भाव",
      diseaseRisk: "रोग का जोखिम",
      pestRisk: "कीट का खतरा",
      farmRiskScore: "समग्र जोखिम सूचकांक",
      activeSchemes: "उपलब्ध सरकारी लाभ",
      quickDiseaseScan: "पत्ते का रोग जांचें",
      askCopilot: "फार्मटॉक एआई से पूछें",
      viewAllActions: "पूरी सलाह देखें",
      fieldNotes: "दैनिक कार्य दर्ज करें",
      offlineNotice: "ऑफ़लाइन मोड: अंतिम अपडेट {time} पहले।",
    },
    schemes: {
      title: "सरकारी योजना हब",
      subtitle: "myScheme.gov.in एवं कृषि मंत्रालय द्वारा 100% सत्यापित योजनाएं",
      centralGovt: "केंद्रीय योजना",
      stateGovt: "राज्य योजना",
      directTransfer: "प्रत्यक्ष लाभ हस्तांतरण (DBT)",
      subsidy: "सब्सिडी योजना",
      eligibilityCheck: "पात्रता जांचें",
      applyOfficial: "आधिकारिक पोर्टल पर आवेदन करें",
      documentsRequired: "आवश्यक दस्तावेजों की सूची",
      disclaimer: "आधिकारिक सूचना: आप आधिकारिक .gov.in पोर्टल पर जा रहे हैं।",
    },
    market: {
      title: "वास्तविक समय मंडी भाव व लाभ विश्लेषण",
      subtitle: "AGMARKNET एवं e-NAM से सीधे प्राप्त दैनिक आवक व भाव",
      todayModal: "आज का मॉडल भाव",
      priceSpread: "भाव का अंतर",
      transportCost: "परिवहन खर्च (₹/क्विंटल)",
      netRealization: "किसान का शुद्ध मुनाफा",
      bestMandi: "सुझाई गई एपीएमसी मंडी",
      compareMandis: "मंडियों की तुलना करें",
      distance: "दूरी",
    },
    marketplace: {
      title: "सत्यापित कृषि बाजार",
      subtitle: "लाइसेंस प्राप्त एफपीओ एवं केवीके द्वारा प्रमाणित बीज व खाद",
      verifiedFpo: "सरकारी लाइसेंस प्राप्त एफपीओ",
      addToCart: "कार्ट में जोड़ें",
      buyNow: "सीधा ऑर्डर",
      delivery: "एक्सप्रेस डिलीवरी (24-48 घंटे)",
      inStock: "उपलब्ध",
      orderNow: "ऑर्डर करें",
    },
    credits: {
      title: "कृषिमित्र लॉयल्टी क्रेडिट व स्ट्रीक",
      balance: "उपलब्ध क्रेडिट बैलेंस",
      streakDays: "दैनिक सक्रियता स्ट्रीक",
      earnRules: "क्रेडिट खाता व नियम",
      redeemVoucher: "डिस्काउंट कूपन भुनाएं",
      claimCoupon: "कूपन प्राप्त करें",
    },
    farmtalk: {
      title: "फार्मटॉक सॉवरेन एआई सलाहकार",
      subtitle: "ICAR, KAU व TNAU ज्ञानकोश पर आधारित त्वरित वैज्ञानिक निर्णय इंजन",
      askPlaceholder: "हिंदी, अंग्रेजी, कन्नड़, तेलुगु, तमिल या मराठी में पूछें...",
      send: "सलाह लें",
      suggestedQueries: "सुझाए गए प्रश्न",
      citationSource: "आधिकारिक वैज्ञानिक संदर्भ",
      instantIntelligence: "100% सटीक त्वरित उत्तर",
    },
    actions: {
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      analyze: "विश्लेषण करें",
      upload: "फोटो / फाइल अपलोड करें",
      viewDetails: "विवरण देखें",
      apply: "आवेदन करें",
      calculate: "मुनाफा निकालें",
      filter: "फ़िल्टर",
      search: "खोजें...",
      refresh: "ताज़ा करें",
      speak: "बोलें",
      exportData: "रिपोर्ट डाउनलोड करें (PDF)",
      completed: "पूर्ण हुआ",
      pending: "बाकी है",
    },
    common: {
      acres: "एकड़",
      quintal: "क्विंटल",
      rupees: "₹",
      confidence: "सटीकता",
      severity: "तीव्रता",
      high: "अधिक",
      medium: "मध्यम",
      low: "कम",
      safe: "उत्तम",
      danger: "गंभीर",
      warning: "सावधानी जरूरी",
      recommended: "सुझाया गया",
      verified: "सत्यापित",
      official: "आधिकारिक स्रोत",
    },
  },

  // ==========================================
  // 3. KANNADA (KN) - ಕನ್ನಡ
  // ==========================================
  kn: {
    appName: "ಕೃಷಿಮಿತ್ರ AI",
    appTagline: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಆಪರೇಷನ್ಸ್ ಕಮಾಂಡ್ ಸೆಂಟರ್",
    telemetry: {
      satelliteStatus: "ಉಪಗ್ರಹ ಟೆಲಿಮೆಟ್ರಿ: ಸಕ್ರಿಯ",
      locationText: "ಸ್ಥಳ: 15.4292° N, 75.6318° E (ಗದಗ, ಕರ್ನಾಟಕ)",
      mandiSync: "ಅಗ್ಮಾರ್ಕ್ನೆಟ್ / ಇ-ನಾಮ್: ಲೈವ್ ಸಿಂಕ್",
      credits: "ಕ್ರೆಡಿಟ್ಸ್",
      live: "ಲೈವ್",
      commandCenter: "ಆಪರೇಷನ್ಸ್ ಕಮಾಂಡ್",
    },
    nav: {
      overview: "ಅವಲೋಕನ",
      dashboard: "ಡಿಜಿಟಲ್ ಫಾರ್ಮ್",
      digitalTwin: "ಡಿಜಿಟಲ್ ಫಾರ್ಮ್",
      schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      market: "ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ",
      marketplace: "ಕೃಷಿ ಮಾರುಕಟ್ಟೆ",
      credits: "ಕ್ರೆಡಿಟ್ಸ್ & ಬಹುಮಾನ",
      transparency: "ಡೇಟಾ ಸತ್ಯಾಸತ್ಯತೆ",
      admin: "ಆಡಳಿತ & ನೀತಿ",
      farmtalk: "ಫಾರ್ಮ್‌ಟಾಕ್ ಎಐ ಸಹಾಯಕ",
      diseaseScanner: "ರೋಗ ಪತ್ತೆ ಸ್ಕ್ಯಾನರ್",
      soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      weather: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
      cropAdvisor: "ಬೆಳೆ ಸಲಹೆಗಾರ",
      cropCalendar: "ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್",
      machinery: "ಯಂತ್ರೋಪಕರಣ ಬಾಡಿಗೆ",
      labour: "ಕೃಷಿ ಕಾರ್ಮಿಕರು",
      finance: "ಕೃಷಿ ಆರ್ಥಿಕತೆ",
      insurance: "ಬೆಳೆ ವಿಮೆ",
      irrigation: "ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ",
      pests: "ಕೀಟ ನಿರ್ವಹಣೆ",
      satellite: "ಉಪಗ್ರಹ & ಡ್ರೋನ್",
      farmMap: "ಜಮೀನಿನ ನಕ್ಷೆ",
      community: "ರೈತ ಸಮುದಾಯ",
      resources: "ಕೃಷಿ ಸಂಪನ್ಮೂಲ ಕೇಂದ್ರ",
      support: "ರೈತ ಸಹಾಯ ಕೇಂದ್ರ",
      alerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
      voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",
      login: "ಲಾಗ್ ಇನ್",
    },
    sectors: {
      fieldTelemetry: "ಜಮೀನಿನ ಟೆಲಿಮೆಟ್ರಿ & ಪ್ಲಾಟ್‌ಗಳು",
      mandisEconomics: "ಮಾರುಕಟ್ಟೆ & ಆರ್ಥಿಕತೆ",
      loyaltyRewards: "ಕ್ರೆಡಿಟ್ಸ್ & ಬಹುಮಾನಗಳು",
      governanceAi: "ಆಡಳಿತ & ಎಐ ಎಂಜಿನ್",
      utilityHub: "ಸೌಲಭ್ಯಗಳು & ಸಮುದಾಯ",
    },
    dashboard: {
      welcome: "ಸ್ವಾಗತ, {name}",
      farmHealthScore: "ಜಮೀನಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್",
      todaysPlan: "ಇಂದಿನ ಕೃಷಿ ಯೋಜನೆ",
      todaysPlanSub: "ಮಣ್ಣು, ಹವಾಮಾನ, ಬೆಳೆ ಹಂತ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಆಧಾರಿತ ನಿಖರ ವೈಜ್ಞಾನಿಕ ಕ್ರಮಗಳು",
      whyThisAction: "ವೈಜ್ಞಾನಿಕ ಕಾರಣ:",
      weatherToday: "ಇಂದಿನ ಹವಾಮಾನ & ಮುನ್ಸೂಚನೆ",
      cropStage: "ಪ್ರಸ್ತುತ ಬೆಳೆ ಹಂತ",
      waterStatus: "ಮಣ್ಣಿನ ತೇವಾಂಶ & ನೀರಿನ ಸ್ಥಿತಿ",
      marketPrice: "ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ ದರ",
      diseaseRisk: "ರೋಗದ ಅಪಾಯ",
      pestRisk: "ಕೀಟದ ಅಪಾಯ",
      farmRiskScore: "ಒಟ್ಟಾರೆ ಅಪಾಯ ಸೂಚ್ಯಂಕ",
      activeSchemes: "ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು",
      quickDiseaseScan: "ಎಲೆಯ ರೋಗ ತಪಾಸಣೆ",
      askCopilot: "ಫಾರ್ಮ್‌ಟಾಕ್ ಎಐ ಕೇಳಿ",
      viewAllActions: "ಸಂಪೂರ್ಣ ಸಲಹೆ ವೀಕ್ಷಿಸಿ",
      fieldNotes: "ದೈನಂದಿನ ಕೆಲಸ ದಾಖಲಿಸಿ",
      offlineNotice: "ಆಫ್‌ಲೈನ್ ಡೇಟಾ. ಕೊನೆಯ ಅಪ್‌ಡೇಟ್ {time} ಹಿಂದೆ.",
    },
    schemes: {
      title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಕೇಂದ್ರ",
      subtitle: "myScheme.gov.in ಮತ್ತು ಕೃಷಿ ಸಚಿವಾಲಯದಿಂದ 100% ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಯೋಜನೆಗಳು",
      centralGovt: "ಕೇಂದ್ರ ಸರ್ಕಾರಿ ಯೋಜನೆ",
      stateGovt: "ರಾಜ್ಯ ಸರ್ಕಾರಿ ಯೋಜನೆ",
      directTransfer: "ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT)",
      subsidy: "ಸಬ್ಸಿಡಿ ಯೋಜನೆ",
      eligibilityCheck: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
      applyOfficial: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      documentsRequired: "ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
      disclaimer: "ಅಧಿಕೃತ ಸೂಚನೆ: ನೀವು ಅಧಿಕೃತ .gov.in ವೆಬ್‌ಸೈಟ್‌ಗೆ ತೆರಳುತ್ತಿದ್ದೀರಿ.",
    },
    market: {
      title: "ನೈಜ ಸಮಯದ ಮಾರುಕಟ್ಟೆ ದರ ವಿಶ್ಲೇಷಣೆ",
      subtitle: "AGMARKNET ಮತ್ತು e-NAM ದೈನಂದಿನ ದರ ಮಾಹಿತಿ",
      todayModal: "ಇಂದಿನ ಸರಾಸರಿ ದರ",
      priceSpread: "ದರ ವ್ಯತ್ಯಾಸ",
      transportCost: "ಸಾರಿಗೆ ವೆಚ್ಚ (₹/ಕ್ವಿಂಟಾಲ್)",
      netRealization: "ರೈತನ ನಿವ್ವಳ ಲಾಭ",
      bestMandi: "ಶಿಫಾರಸು ಮಾಡಿದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ",
      compareMandis: "ಮಾರುಕಟ್ಟೆಗಳ ಹೋಲಿಕೆ",
      distance: "ದೂರ",
    },
    marketplace: {
      title: "ಪರಿಶೀಲಿಸಿದ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ",
      subtitle: "ಪರವಾನಗಿ ಪಡೆದ ಎಫ್‌ಪಿಒ ಮತ್ತು ಕೆವಿಕೆಗಳಿಂದ ಪ್ರಮಾಣೀಕೃತ ಬೀಜ ಮತ್ತು ರಸಗೊಬ್ಬರ",
      verifiedFpo: "ಸರ್ಕಾರಿ ಮಾನ್ಯತೆ ಪಡೆದ ಎಫ್‌ಪಿಒ",
      addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
      buyNow: "ನೇರ ಖರೀದಿ",
      delivery: "ತ್ವರಿತ ವಿತರಣೆ (24-48 ಗಂಟೆ)",
      inStock: "ಲಭ್ಯವಿದೆ",
      orderNow: "ಆರ್ಡರ್ ಮಾಡಿ",
    },
    credits: {
      title: "ಕೃಷಿಮಿತ್ರ ಲಾಯಲ್ಟಿ ಕ್ರೆಡಿಟ್ಸ್ & ಸ್ಟ್ರೀಕ್",
      balance: "ಲಭ್ಯವಿರುವ ಕ್ರೆಡಿಟ್ ಬ್ಯಾಲೆನ್ಸ್",
      streakDays: "ದೈನಂದಿನ ಸಕ್ರಿಯತೆ ಸ್ಟ್ರೀಕ್",
      earnRules: "ಕ್ರೆಡಿಟ್ ನಿಯಮಗಳು",
      redeemVoucher: "ರಿಯಾಯಿತಿ ಕೂಪನ್ ಪಡೆಯಿರಿ",
      claimCoupon: "ಕೂಪನ್ ಕ್ಲೈಮ್ ಮಾಡಿ",
    },
    farmtalk: {
      title: "ಫಾರ್ಮ್‌ಟಾಕ್ ಕೃಷಿ ಎಐ ಸಹಾಯಕ",
      subtitle: "ICAR & ಕೃಷಿ ವಿವಿ ಜ್ಞಾನಕೋಶ ಆಧಾರಿತ ತ್ವರಿತ ವೈಜ್ಞಾನಿಕ ನಿರ್ಧಾರ ಎಂಜಿನ್",
      askPlaceholder: "ಕನ್ನಡ, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ತೆಲುಗಿನಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
      send: "ಸಲಹೆ ಕೇಳಿ",
      suggestedQueries: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",
      citationSource: "ಅಧಿಕೃತ ವೈಜ್ಞಾನಿಕ ಉಲ್ಲೇಖ",
      instantIntelligence: "100% ತಕ್ಷಣದ ನಿಖರ ಉತ್ತರ",
    },
    actions: {
      save: "ಉಳಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      submit: "ಸಲ್ಲಿಸಿ",
      analyze: "ವಿಶ್ಲೇಷಿಸಿ",
      upload: "ಫೋಟೋ / ಫೈಲ್ ಅಪ್‌ಲೋಡ್",
      viewDetails: "ವಿವರ ನೋಡಿ",
      apply: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      calculate: "ಲಾಭ ಲೆಕ್ಕಹಾಕಿ",
      filter: "ಫಿಲ್ಟರ್",
      search: "ಹುಡುಕಿ...",
      refresh: "ತಾಜಾಗೊಳಿಸಿ",
      speak: "ಮಾತನಾಡಿ",
      exportData: "ವರದಿ ಡೌನ್‌ಲೋಡ್ (PDF)",
      completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      pending: "ಬಾಕಿ ಇದೆ",
    },
    common: {
      acres: "ಎಕರೆ",
      quintal: "ಕ್ವಿಂಟಾಲ್",
      rupees: "₹",
      confidence: "ನಿಖರತೆ",
      severity: "ತೀವ್ರತೆ",
      high: "ಹೆಚ್ಚು",
      medium: "ಮಧ್ಯಮ",
      low: "ಕಡಿಮೆ",
      safe: "ಉತ್ತಮ",
      danger: "ಗಂಭೀರ",
      warning: "ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ",
      recommended: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
      verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      official: "ಅಧಿಕೃತ ಮೂಲ",
    },
  },

  // ==========================================
  // 4. TELUGU (TE) - తెలుగు
  // ==========================================
  te: {
    appName: "కృషిమిత్ర AI",
    appTagline: "స్మార్ట్ వ్యవసాయం మరియు డిజిటల్ ట్విన్ కమాండ్ సెంటర్",
    telemetry: {
      satelliteStatus: "ఉపగ్రహ టెలిమెట్రీ: యాక్టివ్",
      locationText: "ప్రాంతం: 15.4292° N, 75.6318° E (గదగ్, కర్ణాటక)",
      mandiSync: "అగ్మార్క్‌నెట్ / ఈ-నామ్: లైవ్ సింక్",
      credits: "క్రెడిట్స్",
      live: "లైవ్",
      commandCenter: "ఆపరేషన్స్ కమాండ్",
    },
    nav: {
      overview: "అవలోకనం",
      dashboard: "డిజిటల్ పొలం",
      digitalTwin: "డిజిటల్ పొలం",
      schemes: "ప్రభుత్వ పథకాలు",
      market: "మార్కెట్ ధరలు",
      marketplace: "రైతు బజార్",
      credits: "క్రెడిట్స్ & రివార్డ్స్",
      transparency: "డేటా ప్రామాణికత",
      admin: "పాలన & పాలసీ",
      farmtalk: "ఫామ్‌టాక్ AI సహాయకుడు",
      diseaseScanner: "తెగుళ్ల స్కానర్",
      soilHealth: "నేల ఆరోగ్యం",
      weather: "వాతావరణం",
      cropAdvisor: "పంట సలహాదారు",
      cropCalendar: "పంట క్యాలెండర్",
      machinery: "యంత్రాల అద్దె",
      labour: "వ్యవసాయ కూలీలు",
      finance: "ఆర్థిక నిర్వహణ",
      insurance: "పంట బీమా",
      irrigation: "స్మార్ట్ నీటిపారుదల",
      pests: "చీడపీడల రక్షణ",
      satellite: "శాటిలైట్ & డ్రోన్",
      farmMap: "పొలం మ్యాప్",
      community: "రైతు వేదిక",
      resources: "వనరుల కేంద్రం",
      support: "సహాయ కేంద్రం",
      alerts: "వాతావరణ హెచ్చరికలు",
      voiceAssistant: "వాయిస్ అసిస్టెంట్",
      settings: "సెట్టింగులు",
      logout: "లాగ్ అవుట్",
      login: "లాగిన్",
    },
    sectors: {
      fieldTelemetry: "పొలం టెలిమెట్రీ & ప్లాట్లు",
      mandisEconomics: "మార్కెట్ ధరలు & లాభాలు",
      loyaltyRewards: "క్రెడిట్స్ & రివార్డులు",
      governanceAi: "పాలన & AI ఇంజిన్",
      utilityHub: "సేవలు & సంఘం",
    },
    dashboard: {
      welcome: "స్వాగతం, {name}",
      farmHealthScore: "పొలం ఆరోగ్య స్కోరు",
      todaysPlan: "నేటి వ్యవసాయ ప్రణాళిక",
      todaysPlanSub: "నేల, వాతావరణం మరియు మార్కెట్ ఆధారిత ఖచ్చితమైన వ్యవసాయ పనులు",
      whyThisAction: "శాస్త్రీయ కారణం:",
      weatherToday: "నేటి వాతావరణ సమాచారం",
      cropStage: "పంట ప్రస్తుత దశ",
      waterStatus: "నేలలో తేమ శాతం",
      marketPrice: "ఉత్తమ మార్కెట్ ధర",
      diseaseRisk: "తెగుళ్ల ప్రమాదం",
      pestRisk: "పురుగుల బెడద",
      farmRiskScore: "మొత్తం రిస్క్ ఇండెక్స్",
      activeSchemes: "లభించే ప్రభుత్వ పథకాలు",
      quickDiseaseScan: "ఆకు రోగ నిర్ధారణ",
      askCopilot: "ఫామ్‌టాక్ AI ని అడగండి",
      viewAllActions: "పూర్తి సలహాలు చూడండి",
      fieldNotes: "రోజువారీ పనిని నమోదు చేయండి",
      offlineNotice: "ఆఫ్‌లైన్ డేటా. చివరి అప్‌డేట్ {time} క్రితం.",
    },
    schemes: {
      title: "ప్రభుత్వ పథకాల కేంద్రం",
      subtitle: "myScheme.gov.in మరియు వ్యవసాయ మంత్రిత్వ శాఖ నుండి అధికారిక పథకాలు",
      centralGovt: "కేంద్ర ప్రభుత్వ పథకం",
      stateGovt: "రాష్ట్ర ప్రభుత్వ పథకం",
      directTransfer: "ప్రత్యక్ష నగదు బదిలీ (DBT)",
      subsidy: "సబ్సిడీ పథకం",
      eligibilityCheck: "అర్హతను తనిఖీ చేయండి",
      applyOfficial: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోండి",
      documentsRequired: "అవసరమైన పత్రాల జాబితా",
      disclaimer: "అధికారిక నోటీసు: మీరు అధికారిక .gov.in పోర్టల్‌కు వెళ్తున్నారు.",
    },
    market: {
      title: "లైవ్ మార్కెట్ ధరలు & లాభాల విశ్లేషణ",
      subtitle: "AGMARKNET మరియు e-NAM నుండి రోజువారీ మార్కెట్ ధరలు",
      todayModal: "నేటి మోడల్ ధర",
      priceSpread: "ధర వ్యత్యాసం",
      transportCost: "రవాణా ఖర్చు (₹/క్వింటాల్)",
      netRealization: "రైతుకు నికర లాభం",
      bestMandi: "సిఫార్సు చేయబడిన APMC మార్కెట్",
      compareMandis: "మార్కెట్లను సరిపోల్చండి",
      distance: "దూరం",
    },
    marketplace: {
      title: "ధృవీకరించబడిన రైతు మార్కెట్",
      subtitle: "లైసెన్స్ పొందిన FPO లు మరియు KVK ల నుండి నాణ్యమైన విత్తనాలు మరియు ఎరువులు",
      verifiedFpo: "ప్రభుత్వ గుర్తింపు పొందిన FPO",
      addToCart: "కార్ట్‌కు జోడించండి",
      buyNow: "నేరుగా ఆర్డర్ చేయండి",
      delivery: "వేగవంతమైన డెలివరీ (24-48 గంటలు)",
      inStock: "అందుబాటులో ఉంది",
      orderNow: "ఆర్డర్ చేయండి",
    },
    credits: {
      title: "కృషిమిత్ర లాయల్టీ క్రెడిట్స్ & స్ట్రీక్",
      balance: "అందుబాటులో ఉన్న క్రెడిట్స్",
      streakDays: "రోజువారీ కార్యాచరణ స్ట్రీక్",
      earnRules: "క్రెడిట్ నిబంధనలు",
      redeemVoucher: "డిస్కౌంట్ కూపన్లు పొందండి",
      claimCoupon: "కూపన్ క్లెయిమ్ చేయండి",
    },
    farmtalk: {
      title: "ఫామ్‌టాక్ AI సలహాదారు",
      subtitle: "ICAR & విశ్వవిద్యాలయాల డేటాబేస్ ఆధారిత తక్షణ వ్యవసాయ నిర్ణయ ఇంజిన్",
      askPlaceholder: "తెలుగు, హిందీ, ఇంగ్లీష్ లేదా కన్నడలో ప్రశ్నలు అడగండి...",
      send: "సలహా అడగండి",
      suggestedQueries: "సిఫార్సు చేయబడిన ప్రశ్నలు",
      citationSource: "అధికారిక శాస్త్రీయ సూచన",
      instantIntelligence: "100% తక్షణ ఖచ్చితమైన సమాధానం",
    },
    actions: {
      save: "భద్రపరచండి",
      cancel: "రద్దు చేయండి",
      submit: "సమర్పించండి",
      analyze: "విశ్లేషించండి",
      upload: "ఫోటో / ఫైల్ అప్‌లోడ్",
      viewDetails: "వివరాలు చూడండి",
      apply: "దరఖాస్తు చేయండి",
      calculate: "లాభం లెక్కించండి",
      filter: "ఫిల్టర్",
      search: "వెతకండి...",
      refresh: "రిఫ్రెష్ చేయండి",
      speak: "మాట్లాడండి",
      exportData: "నివేదిక డౌన్‌లోడ్ (PDF)",
      completed: "పూర్తయింది",
      pending: "బాకీ ఉంది",
    },
    common: {
      acres: "ఎకరాలు",
      quintal: "క్వింటాల్",
      rupees: "₹",
      confidence: "ఖచ్చితత్వం",
      severity: "తీవ్రత",
      high: "అధికం",
      medium: "మధ్యస్థం",
      low: "తక్కువ",
      safe: "ఉత్తమం",
      danger: "ప్రమాదం",
      warning: "జాగ్రత్త అవసరం",
      recommended: "సిఫార్సు చేయబడింది",
      verified: "ధృవీకరించబడింది",
      official: "అధికారిక మూలం",
    },
  },

  // ==========================================
  // 5. TAMIL (TA) - தமிழ்
  // ==========================================
  ta: {
    appName: "கிஷிமித்ரா AI",
    appTagline: "ஸ்மார்ட் விவசாயம் மற்றும் டிஜிட்டல் இரட்டை கட்டளை மையம்",
    telemetry: {
      satelliteStatus: "செயற்கைக்கோள் டெலிமெட்ரி: இயங்குகிறது",
      locationText: "இடம்: 15.4292° N, 75.6318° E (கதக், கர்நாடகா)",
      mandiSync: "அக்மார்க்நெட் / இ-நாம்: நேரடி ஒத்திசைவு",
      credits: "கிரெடிட்ஸ்",
      live: "நேரலை",
      commandCenter: "செயல்பாட்டு கட்டளை மையம்",
    },
    nav: {
      overview: "கண்ணோட்டம்",
      dashboard: "டிஜிட்டல் பண்ணை",
      digitalTwin: "டிஜிட்டல் பண்ணை",
      schemes: "அரசு திட்டங்கள்",
      market: "சந்தை விலை நிலவரம்",
      marketplace: "விவசாய சந்தை",
      credits: "கிரெடிட்ஸ் & பரிசுகள்",
      transparency: "தரவு உண்மைத்தன்மை",
      admin: "நிர்வாகம் & கொள்கை",
      farmtalk: "ஃபார்ம்டாக் AI ஆலோசகர்",
      diseaseScanner: "நோய் கண்டறியும் ஸ்கேனர்",
      soilHealth: "மண் வளம்",
      weather: "வானிலை முன்னறிவிப்பு",
      cropAdvisor: "பயிர் ஆலோசகர்",
      cropCalendar: "பயிர் காலண்டர்",
      machinery: "இயந்திர வாடகை",
      labour: "விவசாய தொழிலாளர்கள்",
      finance: "பண்ணை நிதி",
      insurance: "பயிர் காப்பீடு",
      irrigation: "ஸ்மார்ட் நீர்ப்பாசனம்",
      pests: "பூச்சி மேலாண்மை",
      satellite: "செயற்கைக்கோள் & ட்ரோன்",
      farmMap: "பண்ணை வரைபடம்",
      community: "விவசாயிகள் மன்றம்",
      resources: "வள மையம்",
      support: "உதவி மையம்",
      alerts: "வானிலை எச்சரிக்கைகள்",
      voiceAssistant: "குரல் வழி உதவியாளர்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      login: "உள்நுழை",
    },
    sectors: {
      fieldTelemetry: "பண்ணை டெலிமெட்ரி & நிலங்கள்",
      mandisEconomics: "சந்தை & பொருளாதார லாபம்",
      loyaltyRewards: "கிரெடிட்ஸ் & நன்மைகள்",
      governanceAi: "நிர்வாகம் & AI இயந்திரம்",
      utilityHub: "சேவைகள் & சமூகம்",
    },
    dashboard: {
      welcome: "வணக்கம், {name}",
      farmHealthScore: "பண்ணை ஆரோக்கிய மதிப்பெண்",
      todaysPlan: "இன்றைய விவசாய திட்டம்",
      todaysPlanSub: "மண், வானிலை மற்றும் சந்தை அடிப்படையிலான துல்லியமான விவசாய நடவடிக்கைகள்",
      whyThisAction: "அறிவியல் காரணம்:",
      weatherToday: "இன்றைய வானிலை",
      cropStage: "பயிரின் தற்போதைய நிலை",
      waterStatus: "மண் ஈரப்பதம் & நீர் நிலை",
      marketPrice: "சிறந்த சந்தை விலை",
      diseaseRisk: "நோய் பாதிப்பு அபாயம்",
      pestRisk: "பூச்சி தாக்குதல் ஆபத்து",
      farmRiskScore: "ஒட்டுமொத்த இடர் குறியீடு",
      activeSchemes: "பொருத்தமான அரசு திட்டங்கள்",
      quickDiseaseScan: "இலை நோய் பரிசோதனை",
      askCopilot: "ஃபார்ம்டாக் AI இடம் கேளுங்கள்",
      viewAllActions: "முழு ஆலோசனையைக் காண்க",
      fieldNotes: "தினசரி வேலையை பதிவு செய்க",
      offlineNotice: "ஆஃப்லைன் தரவு. கடைசி புதுப்பிப்பு {time} முன்.",
    },
    schemes: {
      title: "அரசு திட்டங்கள் மையம்",
      subtitle: "myScheme.gov.in மற்றும் வேளாண் அமைச்சகத்தின் 100% சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ திட்டங்கள்",
      centralGovt: "மத்திய அரசு திட்டம்",
      stateGovt: "மாநில அரசு திட்டம்",
      directTransfer: "நேரடி பண பரிமாற்றம் (DBT)",
      subsidy: "மானிய திட்டம்",
      eligibilityCheck: "தகுதியை சரிபார்க்கவும்",
      applyOfficial: "அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்கவும்",
      documentsRequired: "தேவையான ஆவணங்கள்",
      disclaimer: "அதிகாரப்பூர்வ அறிவிப்பு: நீங்கள் அதிகாரப்பூர்வ .gov.in தளத்திற்கு செல்கிறீர்கள்.",
    },
    market: {
      title: "நேரடி சந்தை விலை & லாப பகுப்பாய்வு",
      subtitle: "AGMARKNET மற்றும் e-NAM இலிருந்து தினசரி சந்தை விலை விவரங்கள்",
      todayModal: "இன்றைய சராசரி விலை",
      priceSpread: "விலை வித்தியாசம்",
      transportCost: "போக்குவரத்து செலவு (₹/குவிண்டால்)",
      netRealization: "விவசாயியின் நிகர லாபம்",
      bestMandi: "பரிந்துரைக்கப்பட்ட APMC சந்தை",
      compareMandis: "சந்தைகளை ஒப்பிடுக",
      distance: "தூரம்",
    },
    marketplace: {
      title: "சரிபார்க்கப்பட்ட விவசாய சந்தை",
      subtitle: "அங்கீகரிக்கப்பட்ட FPO மற்றும் KVK களின் சான்றளிக்கப்பட்ட விதைகள் மற்றும் உரங்கள்",
      verifiedFpo: "அரசு அங்கீகாரம் பெற்ற FPO",
      addToCart: "கார்ட்டில் சேர்க்க",
      buyNow: "நேரடி ஆர்டர்",
      delivery: "விரைவு விநியோகம் (24-48 மணிநேரம்)",
      inStock: "இருப்பில் உள்ளது",
      orderNow: "ஆர்டர் செய்க",
    },
    credits: {
      title: "கிஷிமித்ரா விசுவாச கிரெடிட்ஸ் & ஸ்ட்ரீக்",
      balance: "இருப்பு கிரெடிட்ஸ்",
      streakDays: "தினசரி தொடர் நாட்கள்",
      earnRules: "கிரெடிட் விதிகளின் பட்டியல்",
      redeemVoucher: "தள்ளுபடி கூப்பன்களைப் பெறுங்கள்",
      claimCoupon: "கூப்பனைப் பெறுக",
    },
    farmtalk: {
      title: "ஃபார்ம்டாக் AI விவசாய ஆலோசகர்",
      subtitle: "ICAR & விவசாய பல்கலைக்கழகங்களின் தரவுத்தள அடிப்படையிலான துல்லிய முடிவு இயந்திரம்",
      askPlaceholder: "தமிழ், இந்தி, ஆங்கிலம் அல்லது கன்னடத்தில் கேள்விகளைக் கேளுங்கள்...",
      send: "ஆலோசனை பெறுக",
      suggestedQueries: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
      citationSource: "அதிகாரப்பூர்வ அறிவியல் மேற்கோள்",
      instantIntelligence: "100% உடனடி துல்லியமான பதில்",
    },
    actions: {
      save: "சேமி",
      cancel: "ரத்து செய்",
      submit: "சமர்ப்பி",
      analyze: "பகுப்பாய்வு செய்",
      upload: "புகைப்படம் / கோப்பு பதிவேற்றுக",
      viewDetails: "விவரங்களை காண்க",
      apply: "விண்ணப்பிக்கவும்",
      calculate: "லாபத்தை கணக்கிடு",
      filter: "வடிகட்டு",
      search: "தேடுக...",
      refresh: "புதுப்பி",
      speak: "பேசவும்",
      exportData: "அறிக்கையை பதிவிறக்குக (PDF)",
      completed: "முடிந்தது",
      pending: "நிலுவையில் உள்ளது",
    },
    common: {
      acres: "ஏக்கர்",
      quintal: "குவிண்டால்",
      rupees: "₹",
      confidence: "துல்லியம்",
      severity: "தீவிரம்",
      high: "அதிகம்",
      medium: "நடுத்தரம்",
      low: "குறைவு",
      safe: "சிறந்தது",
      danger: "ஆபத்தானது",
      warning: "எச்சரிக்கை தேவை",
      recommended: "பரிந்துரைக்கப்பட்டது",
      verified: "சரிபார்க்கப்பட்டது",
      official: "அதிகாரப்பூர்வ ஆதாரம்",
    },
  },

  // ==========================================
  // 6. MARATHI (MR) - मराठी
  // ==========================================
  mr: {
    appName: "कृषिमित्र AI",
    appTagline: "स्मार्ट शेती आणि डिजिटल ट्विन ऑपरेशन्स कमांड सेंटर",
    telemetry: {
      satelliteStatus: "उपग्रह टेलीमेट्री: सक्रिय",
      locationText: "स्थान: 15.4292° N, 75.6318° E (गदग, कर्नाटक)",
      mandiSync: "अॅगमार्कनेट / ई-नाम: थेट सिंक",
      credits: "क्रेडिट्स",
      live: "थेट",
      commandCenter: "ऑपरेशन्स कमांड",
    },
    nav: {
      overview: "आढावा",
      dashboard: "डिजिटल शेत",
      digitalTwin: "डिजिटल शेत",
      schemes: "सरकारी योजना",
      market: "बाजारभाव व विक्री",
      marketplace: "कृषी बाजार",
      credits: "क्रेडिट्स व बक्षिसे",
      transparency: "डेटा सत्यता",
      admin: "प्रशासन व धोरण",
      farmtalk: "फार्मटॉक एआय मार्गदर्शक",
      diseaseScanner: "रोग निदान स्कॅनर",
      soilHealth: "मातीचे आरोग्य",
      weather: "हवामान अंदाज",
      cropAdvisor: "पीक सल्लागार",
      cropCalendar: "पीक दिनदर्शिका",
      machinery: "यंत्रसामग्री भाड्याने",
      labour: "मजूर व्यवस्थापन",
      finance: "शेती वित्त",
      insurance: "पीक विमा",
      irrigation: "स्मार्ट सिंचन",
      pests: "कीड नियंत्रण",
      satellite: "उपग्रह व ड्रोन",
      farmMap: "शेताचा नकाशा",
      community: "शेतकरी मंच",
      resources: "संसाधन केंद्र",
      support: "मदत केंद्र",
      alerts: "हवामान इशारे",
      voiceAssistant: "व्हॉईस असिस्टंट",
      settings: "सेटिंग्ज",
      logout: "बाहेर पडा",
      login: "लॉग इन",
    },
    sectors: {
      fieldTelemetry: "शेत टेलीमेट्री व भूखंड",
      mandisEconomics: "बाजारभाव व अर्थकारण",
      loyaltyRewards: "क्रेडिट्स व बक्षिसे",
      governanceAi: "प्रशासन व एआय",
      utilityHub: "सुविधा व समुदाय",
    },
    dashboard: {
      welcome: "नमस्कार, {name}",
      farmHealthScore: "शेत आरोग्य स्कोअर",
      todaysPlan: "आजची शेती कृती योजना",
      todaysPlanSub: "माती, हवामान, पीक टप्पा आणि बाजारभाव यावर आधारित अचूक कृषी कृती",
      whyThisAction: "वैज्ञानिक कारण:",
      weatherToday: "आजचे हवामान व अंदाज",
      cropStage: "पिकाचा चालू टप्पा",
      waterStatus: "मातीतील ओलावा स्थिती",
      marketPrice: "उत्तम बाजारभाव",
      diseaseRisk: "रोग धोका पातळी",
      pestRisk: "कीड प्रादुर्भाव निर्देशांक",
      farmRiskScore: "एकूण धोका निर्देशांक",
      activeSchemes: "पात्र सरकारी योजना",
      quickDiseaseScan: "पानांवरील रोग तपासा",
      askCopilot: "फार्मटॉक एआय ला विचारा",
      viewAllActions: "पूर्ण सल्ला पहा",
      fieldNotes: "दैनंदिन नोंदी ठेवा",
      offlineNotice: "ऑफलाइन डेटा. शेवटचा अपडेट {time} पूर्वी.",
    },
    schemes: {
      title: "सरकारी योजना केंद्र",
      subtitle: "myScheme.gov.in आणि कृषी मंत्रालयाद्वारे १००% सत्यापित योजना",
      centralGovt: "केंद्रीय योजना",
      stateGovt: "राज्य योजना",
      directTransfer: "थेट लाभ हस्तांतरण (DBT)",
      subsidy: "अनुदान योजना",
      eligibilityCheck: "पात्रता तपासा",
      applyOfficial: "अधिकृत पोर्टलवर अर्ज करा",
      documentsRequired: "आवश्यक कागदपत्रांची यादी",
      disclaimer: "अधिकृत सूचना: आपण अधिकृत .gov.in पोर्टलवर जात आहात.",
    },
    market: {
      title: "थेट बाजारभाव व नफा विश्लेषण",
      subtitle: "AGMARKNET आणि e-NAM द्वारे थेट दररोजचे बाजारभाव",
      todayModal: "आजचा सरासरी भाव",
      priceSpread: "भावातील तफावत",
      transportCost: "वाहतूक खर्च (₹/क्विंटल)",
      netRealization: "शेतकऱ्याचा निव्वळ नफा",
      bestMandi: "शिफारस केलेली एपीएमसी बाजार समिती",
      compareMandis: "बाजार समित्यांची तुलना करा",
      distance: "अंतर",
    },
    marketplace: {
      title: "सत्यापित कृषी बाजारपेठ",
      subtitle: "परवानाधारक FPO आणि KVK कडून प्रमाणित बियाणे आणि खते",
      verifiedFpo: "शासकीय मान्यताप्राप्त FPO",
      addToCart: "कार्टमध्ये टाका",
      buyNow: "थेट खरेदी",
      delivery: "जलद वितरण (२४-४८ तास)",
      inStock: "उपलब्ध",
      orderNow: "ऑर्डर करा",
    },
    credits: {
      title: "कृषिमित्र लॉयल्टी क्रेडिट्स व स्ट्रीक",
      balance: "शिल्लक क्रेडिट्स",
      streakDays: "दैनंदिन सातत्य दिवस",
      earnRules: "क्रेडिट नियम सूची",
      redeemVoucher: "सवलत कूपन मिळवा",
      claimCoupon: "कूपन क्लेम करा",
    },
    farmtalk: {
      title: "फार्मटॉक एआय कृषी सल्लागार",
      subtitle: "ICAR आणि कृषी विद्यापीठांच्या डेटाबेसवर आधारित अचूक निर्णय प्रणाली",
      askPlaceholder: "मराठी, हिंदी, इंग्रजी किंवा कन्नडमध्ये प्रश्न विचारा...",
      send: "सल्ला विचारा",
      suggestedQueries: "सुचवलेले प्रश्न",
      citationSource: "अधिकृत वैज्ञानिक संदर्भ",
      instantIntelligence: "१००% त्वरित व अचूक उत्तर",
    },
    actions: {
      save: "जतन करा",
      cancel: "रद्द करा",
      submit: "सादर करा",
      analyze: "विश्लेषण करा",
      upload: "फोटो / फाइल अपलोड करा",
      viewDetails: "तपशील पहा",
      apply: "अर्ज करा",
      calculate: "नफा मोजा",
      filter: "फिल्टर",
      search: "शोधा...",
      refresh: "ताजे करा",
      speak: "बोला",
      exportData: "अहवाल डाउनलोड करा (PDF)",
      completed: "पूर्ण झाले",
      pending: "बाकी आहे",
    },
    common: {
      acres: "एकर",
      quintal: "क्विंटल",
      rupees: "₹",
      confidence: "अचूकता",
      severity: "तीव्रता",
      high: "जास्त",
      medium: "मध्यम",
      low: "कमी",
      safe: "उत्कृष्ट",
      danger: "धोकादायक",
      warning: "सावधगिरी आवश्यक",
      recommended: "शिफारस केलेले",
      verified: "सत्यापित",
      official: "अधिकृत स्रोत",
    },
  },
};
