import {
  DEMO_FARMER,
  DEMO_FARMS,
  DEMO_SOIL_REPORT,
  DEMO_WEATHER_DAYS,
  DEMO_MANDI_PRICES,
  DEMO_SCHEMES,
  DEMO_DISEASE_RECORDS,
  DEMO_FINANCE_SUMMARY,
  DEMO_ACTIONS,
  Farm,
  FarmAction,
} from "./demo-data";
import { Language } from "./i18n";

export interface ToolResult {
  tool: string;
  args: Record<string, unknown>;
  output: unknown;
}

export interface RAGCitation {
  id: string;
  source: string;
  title: string;
  section: string;
  year: string;
  authority: string;
  confidenceScore: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  toolsUsed?: ToolResult[];
  citations?: RAGCitation[];
  suggestedFollowUps?: string[];
}

export interface CropRecommendationResult {
  cropName: string;
  variety: string;
  overallScore: number;
  expectedYieldQuintalPerAcre: number;
  estimatedCostPerAcre: number;
  estimatedRevenuePerAcre: number;
  estimatedNetProfitPerAcre: number;
  soilCompatibilityScore: number;
  climateCompatibilityScore: number;
  waterFeasibilityScore: number;
  marketDemandScore: number;
  reasons: string[];
  risks: string[];
  season: string;
}

// 1. Tool execution engine
export class KrishiMitraToolEngine {
  static getFarmerProfile() {
    return DEMO_FARMER;
  }

  static getFarmData(farmId?: string) {
    if (farmId) {
      return DEMO_FARMS.find((f) => f.id === farmId) || DEMO_FARMS[0];
    }
    return DEMO_FARMS[0];
  }

  static getSoilData(_farmId?: string) {
    return DEMO_SOIL_REPORT;
  }

  static getWeather() {
    return DEMO_WEATHER_DAYS[0];
  }

  static getWeatherForecast() {
    return DEMO_WEATHER_DAYS;
  }

  static getMarketPrices(commodity?: string) {
    if (commodity) {
      return DEMO_MANDI_PRICES.filter((m) =>
        m.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }
    return DEMO_MANDI_PRICES;
  }

  static getNearbyMarkets(_lat: number, _lng: number) {
    return DEMO_MANDI_PRICES;
  }

  static calculateTransportCost(distanceKm: number, ratePerKmPerQtl = 1.85, baseLoading = 20) {
    const cost = Math.round(distanceKm * ratePerKmPerQtl + baseLoading);
    return {
      distanceKm,
      costPerQuintal: cost,
      formula: `${distanceKm} km × ₹${ratePerKmPerQtl}/km + ₹${baseLoading} loading`,
    };
  }

  static calculateNetProfit(mandiPrice: number, transportCost: number, harvestingCost = 150) {
    const netReturn = mandiPrice - transportCost - harvestingCost;
    return {
      grossMandiPrice: mandiPrice,
      transportCost,
      harvestingCost,
      netEstimatedReturn: netReturn,
    };
  }

  static getGovernmentSchemes() {
    return DEMO_SCHEMES;
  }

  static checkSchemeEligibility(schemeId: string) {
    const scheme = DEMO_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) return { eligible: false, reason: "Scheme not found" };
    return {
      schemeTitle: scheme.title,
      status: scheme.status,
      matchReason: scheme.matchReason,
      documentsRequired: scheme.documentsRequired,
      subsidyPercentage: scheme.subsidyPercentage,
    };
  }

  static analyzeDisease(diseaseNameQuery?: string) {
    if (diseaseNameQuery) {
      const match = DEMO_DISEASE_RECORDS.find((d) =>
        d.diseaseName.toLowerCase().includes(diseaseNameQuery.toLowerCase())
      );
      if (match) return match;
    }
    return DEMO_DISEASE_RECORDS[0];
  }

  static getFarmRiskScore() {
    return {
      overallRiskScore: 28,
      riskLevel: "Low to Moderate",
      breakdown: {
        weatherRisk: 35,
        diseaseRisk: 42,
        pestRisk: 18,
        waterRisk: 12,
        marketRisk: 25,
      },
      topMitigation: "Scout Zone B lower leaves for early blight following overnight moisture.",
    };
  }

  static calculateIrrigationRequirement(crop: string, stage: string, rainfallMmToday: number) {
    const baseRequirementLitresPerAcre = 8500;
    if (rainfallMmToday >= 15) {
      return {
        decision: "SKIP_IRRIGATION",
        reason: `Predicted rainfall (${rainfallMmToday} mm) exceeds daily crop water consumption. Operating irrigation will lead to root zone waterlogging.`,
        litresSaved: baseRequirementLitresPerAcre,
        costSavedInINR: 95,
      };
    } else if (rainfallMmToday > 5) {
      return {
        decision: "REDUCE_IRRIGATION",
        reason: `Light rain expected. Reduce normal drip runtime by 50% (operate for 20 mins instead of 40 mins).`,
        litresSaved: baseRequirementLitresPerAcre * 0.5,
        costSavedInINR: 48,
      };
    } else {
      return {
        decision: "IRRIGATE_NORMALLY",
        reason: `No significant rainfall. Run morning drip cycle for 45 minutes to maintain 65% field capacity.`,
        litresRequired: baseRequirementLitresPerAcre,
        costSavedInINR: 0,
      };
    }
  }

  static getFarmExpenses() {
    return DEMO_FINANCE_SUMMARY;
  }
}

// 2. Multilingual Agronomic Intelligence Response Generator
export function generateCopilotResponse(query: string, farm: Farm, lang: Language = "en"): AIChatMessage {
  const q = query.toLowerCase();
  const toolsUsed: ToolResult[] = [];
  const citations: RAGCitation[] = [];
  let replyText = "";
  const followUps: string[] = [];

  // Keywords across 6 Indian Languages
  const isIrrigationQuery =
    q.includes("irrigate") || q.includes("water") || q.includes("rain") ||
    q.includes("पानी") || q.includes("सिंचाई") || q.includes("बारिश") ||
    q.includes("ನೀರಾವರಿ") || q.includes("ನೀರು") || q.includes("ಮಳೆ") ||
    q.includes("నీరు") || q.includes("నీటిపారుదల") || q.includes("వర్షం") ||
    q.includes("தண்ணீர்") || q.includes("பாசனம்") || q.includes("மழை") ||
    q.includes("पाणी") || q.includes("सिंचन") || q.includes("पाऊस");

  const isDiseasePestQuery =
    q.includes("leaf") || q.includes("yellow") || q.includes("spot") || q.includes("blight") || q.includes("disease") || q.includes("pest") ||
    q.includes("रोग") || q.includes("कीट") || q.includes("पत्ता") || q.includes("पीला") ||
    q.includes("ರೋಗ") || q.includes("ಕೀಟ") || q.includes("ಎಲೆ") || q.includes("ಹಳದಿ") ||
    q.includes("తెగులు") || q.includes("పురుగు") || q.includes("ఆకు") || q.includes("పసుపు") ||
    q.includes("நோய்") || q.includes("பூச்சி") || q.includes("இலை") || q.includes("மஞ்சள்") ||
    q.includes("रोग") || q.includes("कीड") || q.includes("पान") || q.includes("पिवळे");

  const isMarketPriceQuery =
    q.includes("market") || q.includes("price") || q.includes("sell") || q.includes("mandi") || q.includes("rate") ||
    q.includes("मंडी") || q.includes("भाव") || q.includes("बिक्री") || q.includes("दाम") ||
    q.includes("ಮಾರುಕಟ್ಟೆ") || q.includes("ದರ") || q.includes("ಧಾರಣೆ") || q.includes("ಮಾರಾಟ") ||
    q.includes("మార్కెట్") || q.includes("ధర") || q.includes("మండి") || q.includes("అమ్మకం") ||
    q.includes("சந்தை") || q.includes("விலை") || q.includes("விற்பனை") ||
    q.includes("बाजार") || q.includes("भाव") || q.includes("बाजारभाव");

  const isSchemeQuery =
    q.includes("scheme") || q.includes("subsidy") || q.includes("pm-kisan") || q.includes("pmfby") || q.includes("benefit") ||
    q.includes("योजना") || q.includes("सब्सिडी") || q.includes("अनुदान") || q.includes("पीएम किसान") ||
    q.includes("ಯೋಜನೆ") || q.includes("ಸಬ್ಸಿಡಿ") || q.includes("ಅನುದಾನ") ||
    q.includes("పథకం") || q.includes("సబ్సిడీ") || q.includes("రైతు భరోసా") ||
    q.includes("திட்டம்") || q.includes("மானியம்") ||
    q.includes("योजना") || q.includes("अनुदान") || q.includes("शेतकरी योजना");

  // CASE 1: Irrigation & Weather Advisory
  if (isIrrigationQuery) {
    toolsUsed.push({ tool: "getFarmData", args: { farmId: farm.id }, output: { currentCrop: farm.currentCrop, stage: farm.cropStage } });
    toolsUsed.push({ tool: "getWeatherForecast", args: { location: farm.district }, output: DEMO_WEATHER_DAYS[0] });
    
    const irriResult = KrishiMitraToolEngine.calculateIrrigationRequirement(farm.currentCrop, farm.cropStage, DEMO_WEATHER_DAYS[0].rainfallMm);
    toolsUsed.push({ tool: "calculateIrrigationRequirement", args: { rainfall: DEMO_WEATHER_DAYS[0].rainfallMm }, output: irriResult });

    if (lang === "hi") {
      replyText = `**आज का निर्णय (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ सिंचाई रोकें (Hold Irrigation)' : '✅ सामान्य सिंचाई करें'}**

• **कारण:** शाम 4:30 बजे 18.5 मिमी वर्षा की 84% संभावना है।
• **बचत:** आज ड्रिप चक्र रोकने से लगभग **4,200 लीटर** भूजल की बचत होगी और जड़ों में जलभराव नहीं होगा।
• **सलाह:** यदि कोई पोषक तत्व का छिड़काव करना है, तो दोपहर 1:30 बजे से पहले पूरा करें।`;
      followUps.push("7 दिन का मौसम पूर्वानुमान देखें", "मिट्टी में नमी का स्तर", "कीटनाशक छिड़काव का सही समय");
    } else if (lang === "kn") {
      replyText = `**ಇಂದಿನ ನೀರಾವರಿ ನಿರ್ಧಾರ (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ ನೀರಾವರಿ ಬೇಡ (Skip Irrigation)' : '✅ ನಿಯಮಿತ ನೀರಾವರಿ ಮಾಡಿ'}**

• **ಕಾರಣ:** ಸಂಜೆ 4:30 ಕ್ಕೆ 18.5 ಮಿಮೀ ಮಳೆಯಾಗುವ 84% ಸಂಭವನೀಯತೆಯಿದೆ.
• **ಉಳಿತಾಯ:** ಇಂದಿನ ಡ್ರಿಪ್ ನಿಲ್ಲಿಸುವುದರಿಂದ **4,200 ಲೀಟರ್** ಬೋರ್‌ವೆಲ್ ನೀರು ಉಳಿತಾಯವಾಗುತ್ತದೆ.
• **ಸಲಹೆ:** ರಸಗೊಬ್ಬರ ಅಥವಾ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಮಧ್ಯಾಹ್ನ 1:30 ರೊಳಗೆ ಪೂರ್ಣಗೊಳಿಸಿ.`;
      followUps.push("7 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ", "ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ", "ಸಿಂಪರಣೆ ವೇಳಾಪಟ್ಟಿ");
    } else if (lang === "te") {
      replyText = `**నేటి నీటిపారుదల నిర్ణయం (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ నీటిపారుదల వాయిదా వేయండి' : '✅ సాధారణ నీరు పెట్టండి'}**

• **కారణం:** సాయంత్రం 4:30 గంటలకు 18.5 మిమీ వర్షం కురిసే అవకాశం 84% ఉంది.
• **ఆదా:** డ్రిప్ ఆపడం ద్వారా **4,200 లీటర్ల** భూగర్భ జలాలు ఆదా అవుతాయి.
• **సలహా:** మందుల పిచికారీని మధ్యాహ్నం 1:30 లోపు పూర్తి చేయండి.`;
      followUps.push("7 రోజుల వాతావరణ సమాచారం", "నేలలో తేమ శాతం", "పిచికారీ సమయం");
    } else if (lang === "ta") {
      replyText = `**இன்றைய நீர்ப்பாசன முடிவு (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ பாசனத்தை தவிர்க்கவும்' : '✅ வழக்கமான பாசனம் செய்யவும்'}**

• **காரணம்:** மாலை 4:30 மணிக்கு 18.5 மிமீ மழை பெய்ய 84% வாய்ப்புள்ளது.
• **சேமிப்பு:** சொட்டுநீர்ப்பாசனத்தை நிறுத்துவதால் **4,200 லிட்டர்** தண்ணீர் சேமிக்கப்படுகிறது.
• **பரிந்துரை:** மருந்து தெளிக்கும் பணிகளை மதியம் 1:30 மணிக்குள் முடிக்கவும்.`;
      followUps.push("7 நாள் வானிலை முன்னறிவிப்பு", "மண் ஈரப்பதம் சரிபார்க்க", "தெளிப்பு அட்டவணை");
    } else if (lang === "mr") {
      replyText = `**आजचा सिंचन निर्णय (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ आज सिंचन थांबवा' : '✅ नियमित सिंचन करा'}**

• **कारण:** संध्याकाळी 4:30 वाजता 18.5 मिमी पावसाची 84% शक्यता आहे.
• **बचत:** आज ठिबक सिंचन थांबवल्याने **4,200 लिटर** पाण्याची बचत होईल.
• **सल्ला:** फवारणी दुपारी 1:30 पूर्वी पूर्ण करा.`;
      followUps.push("7 दिवसांचा हवामान अंदाज", "मातीतील ओलावा तपासा", "फवारणीची वेळ");
    } else {
      replyText = `**Decision for Today (${farm.name}): ${irriResult.decision === 'SKIP_IRRIGATION' ? '❌ Skip Irrigation' : '✅ Proceed with Normal Irrigation'}**

• **Why:** 18.5 mm thunderstorm rain is predicted at 4:30 PM with an 84% probability.
• **Resource Savings:** Skipping this cycle saves **4,200 Litres** of borewell water and prevents root saturation.
• **Next Step:** Complete any foliar sprays before 1:30 PM for rain-fast bonding.`;
      followUps.push("What is the 7-day rain forecast?", "Check current soil moisture", "When should I spray nutrients?");
    }

    citations.push({
      id: "kb_02",
      source: "UAS Bangalore Horti Water Management Bulletin 14",
      title: "Drip Irrigation Scheduling for Solanaceous Crops",
      section: "Section 4.1 - Wetting Front Dynamics",
      year: "2025",
      authority: "UAS Bangalore",
      confidenceScore: 0.96,
    });
  }
  // CASE 2: Disease & Pest Pathology
  else if (isDiseasePestQuery) {
    const dis = DEMO_DISEASE_RECORDS[0];
    toolsUsed.push({ tool: "getFarmData", args: { farmId: farm.id }, output: { crop: farm.currentCrop } });
    toolsUsed.push({ tool: "analyzeDisease", args: { query: "Early Blight" }, output: dis });

    if (lang === "hi") {
      replyText = `**रोग निदान (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% सटीकता)**

• **लक्षण:** पत्तियों पर कत्थई गोल छल्लेदार धब्बे और निचली पत्तियों का पीला पड़ना।
• **उपचार 1 (जैविक):** ट्राइकोडर्मा विरिडी (Trichoderma) 5 ग्राम/लीटर पानी में मिलाकर छिड़कें।
• **उपचार 2 (रासायनिक):** मेंकोजेब (Mancozeb 75% WP) 2.5 ग्राम/लीटर पानी में घोलकर सुबह छिड़कें।
• **सावधानी:** संक्रमित निचली पत्तियों को तोड़कर खेत से बाहर नष्ट करें।`;
      followUps.push("पत्ते की फोटो स्कैन करें", "निकटतम कृषि विशेषज्ञ से पूछें", "दवा की सही मात्रा");
    } else if (lang === "kn") {
      replyText = `**ರೋಗ ಪತ್ತೆ (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% ನಿಖರತೆ)**

• **ಲಕ್ಷಣಗಳು:** ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಕಲೆಗಳು ಮತ್ತು ಕೆಳಭಾಗದ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು.
• **ಸಾವಯವ ಪರಿಹಾರ:** ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ 5 ಗ್ರಾಂ/ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.
• **ರಾಸಾಯನಿಕ ಪರಿಹಾರ:** ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP 2.5 ಗ್ರಾಂ/ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಬೆಳಗಿನ ಜಾವ ಸಿಂಪಡಿಸಿ.
• **ಮುನ್ನೆಚ್ಚರಿಕೆ:** ರೋಗಪೀಡಿತ ಕೆಳ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ಜಮೀನಿನ ಹೊರಗೆ ನಾಶಪಡಿಸಿ.`;
      followUps.push("ಎಲೆಯ ಫೋಟೋ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", "ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ", "ಔಷಧ ಪ್ರಮಾಣ ಲೆಕ್ಕಹಾಕಿ");
    } else if (lang === "te") {
      replyText = `**తెగులు నిర్ధారణ (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% ఖచ్చితత్వం)**

• **లక్షణాలు:** ఆకులపై ముదురు గోధుమ రంగు వలయాల మచ్చలు.
• **సేంద్రీయ చికిత్స:** ట్రైకోడెర్మా విరిడే 5 గ్రా/లీటరు నీటిలో కలిపి పిచికారీ చేయండి.
• **రసాయన చికిత్స:** మాంకోజెబ్ 75% WP 2.5 గ్రా/లీటరు నీటిలో కలిపి ఉదయం వేళ పిచికారీ చేయండి.`;
      followUps.push("ఆకు ఫోటో స్కాన్ చేయండి", "వ్యవసాయ నిపుణుడిని సంప్రదించండి", "మందుల మోతాదు");
    } else if (lang === "ta") {
      replyText = `**நோய் கண்டறிதல் (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% துல்லியம்)**

• **அறிகுறிகள்:** இலைகளில் வட்டமான கரும்பழுப்பு புள்ளிகள்.
• **இயற்கை சிகிச்சை:** டிரைக்கோடெர்மா விரிடி 5 கிராம்/லிட்டர் நீரில் கலந்து தெளிக்கவும்.
• **இரசாயன சிகிச்சை:** மான்கோசெப் 75% WP 2.5 கிராம்/லிட்டர் நீரில் கலந்து காலையில் தெளிக்கவும்.`;
      followUps.push("இலை புகைப்படத்தை ஸ்கேன் செய்ய", "விவசாய நிபுணர் ஆலோசனை", "மருந்தளவு விவரம்");
    } else if (lang === "mr") {
      replyText = `**रोग निदान (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% अचूकता)**

• **लक्षणे:** पानांवर तपकिरी गोलाकार डाग पडणे.
• **जैविक उपाय:** ट्रायकोडर्मा व्हिरिडी ५ ग्रॅम/लिटर पाण्यात मिसळून फवारा.
• **रासायनिक उपाय:** मँकोझेब ७५% डब्ल्यूपी २.५ ग्रॅम/लिटर पाण्यात मिसळून सकाळी फवारा.`;
      followUps.push("पानाचा फोटो स्कॅन करा", "कृषी तज्ञांचा सल्ला घ्या", "औषधाचे प्रमाण");
    } else {
      replyText = `**Pathology Advisory (${farm.currentCrop}): ${dis.diseaseName} (${dis.confidence}% AI Confidence)**

• **Primary Symptoms:** Dark concentric target-board rings on lower foliage with chlorotic halos.
• **Organic IPM Track:** Apply *Trichoderma viride* @ 5g/L or Neem Oil (10,000 ppm) @ 2ml/L.
• **Chemical IPM Track:** Spray *Mancozeb 75% WP* @ 2.5g/L during dry morning hours (PHI: 7 days).
• **Sanitation:** Prune lower 15-20cm diseased leaves and dispose outside field boundaries.`;
      followUps.push("Scan a photo of my leaf", "Book expert consultation", "Check nearby disease alerts");
    }

    citations.push({
      id: "kb_01",
      source: "ICAR Horticultural Package of Practices",
      title: "Alternaria Solani Integrated Disease Management",
      section: "Pathology - Solanaceae",
      year: "2025",
      authority: "ICAR-IIHR",
      confidenceScore: 0.94,
    });
  }
  // CASE 3: Mandi Prices & Economics
  else if (isMarketPriceQuery) {
    toolsUsed.push({ tool: "getMarketPrices", args: { commodity: farm.currentCrop }, output: DEMO_MANDI_PRICES });
    toolsUsed.push({ tool: "calculateTransportCost", args: { distanceKm: 68 }, output: { netSpread: "+₹240/qtl" } });

    if (lang === "hi") {
      replyText = `**मंडी भाव विश्लेषण (${farm.currentCrop} - आज का AGMARKNET डेटा):**

1. 🏆 **सर्वोत्तम मुनाफा: बेंगलुरु यशवंतपुर APMC**
   • मॉडल भाव: **₹2,780 / क्विंटल**
   • परिवहन खर्च: ₹125/क्विंटल (दूरी: 68 किमी)
   • **किसान को शुद्ध प्राप्ति: ₹2,655 / क्विंटल**

2. **कोलार APMC (स्थानीय):**
   • मॉडल भाव: **₹2,450 / क्विंटल**
   • परिवहन खर्च: ₹40/क्विंटल
   • **शुद्ध प्राप्ति: ₹2,410 / क्विंटल**

💡 **सलाह:** 15 क्विंटल से अधिक माल होने पर बेंगलुरु मंडी में बेचने पर **+₹245/क्विंटल अधिक मुनाफा** मिलेगा।`;
      followUps.push("20 क्विंटल के लिए परिवहन लागत", "30 दिनों का भाव रुझान", "मार्केटप्लेस पर फसल सूचीबद्ध करें");
    } else if (lang === "kn") {
      replyText = `**ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ ವಿಶ್ಲೇಷಣೆ (${farm.currentCrop} - AGMARKNET ಲೈವ್):**

1. 🏆 **ಅತ್ಯುತ್ತಮ ಲಾಭ: ಬೆಂಗಳೂರು ಯಶವಂತಪುರ APMC**
   • ಸರಾಸರಿ ದರ: **₹2,780 / ಕ್ವಿಂಟಾಲ್**
   • ಸಾರಿಗೆ ವೆಚ್ಚ: ₹125/ಕ್ವಿಂಟಾಲ್ (ದೂರ: 68 ಕಿಮೀ)
   • **ರೈತನಿಗೆ ನಿವ್ವಳ ಲಾಭ: ₹2,655 / ಕ್ವಿಂಟಾಲ್**

2. **ಕೋಲಾರ APMC (ಸ್ಥಳೀಯ):**
   • ಸರಾಸರಿ ದರ: **₹2,450 / ಕ್ವಿಂಟಾಲ್**
   • ಸಾರಿಗೆ ವೆಚ್ಚ: ₹40/ಕ್ವಿಂಟಾಲ್
   • **ನಿವ್ವಳ ಲಾಭ: ₹2,410 / ಕ್ವಿಂಟಾಲ್**

💡 **ಶಿಫಾರಸು:** 15 ಕ್ವಿಂಟಾಲ್‌ಗಿಂತ ಹೆಚ್ಚು ಇಳುವರಿ ಇದ್ದರೆ ಬೆಂಗಳೂರು ಮಾರುಕಟ್ಟೆಗೆ ಸಾಗಿಸುವುದರಿಂದ **+₹245/ಕ್ವಿಂಟಾಲ್ ಹೆಚ್ಚುವರಿ ಲಾಭ** ಸಿಗುತ್ತದೆ.`;
      followUps.push("ಸಾರಿಗೆ ವೆಚ್ಚ ಲೆಕ್ಕಹಾಕಿ", "30 ದಿನಗಳ ಬೆಲೆ ಟ್ರೆಂಡ್", "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಉತ್ಪನ್ನ ಪಟ್ಟಿ ಮಾಡಿ");
    } else if (lang === "te") {
      replyText = `**మార్కెట్ ధరల విశ్లేషణ (${farm.currentCrop} - AGMARKNET సమాచారం):**

1. 🏆 **ఉత్తమ లాభం: బెంగళూరు యశ్వంత్‌పూర్ APMC**
   • మోడల్ ధర: **₹2,780 / క్వింటాల్**
   • రవాణా ఖర్చు: ₹125/క్వింటాల్
   • **రైతు నికర రాబడి: ₹2,655 / క్వింటాల్**

2. **కోలార్ APMC (స్థానిక):**
   • మోడల్ ధర: **₹2,450 / క్వింటాల్**
   • **నికర రాబడి: ₹2,410 / క్వింటాల్**

💡 **సలహా:** బెంగళూరు మార్కెట్‌లో విక్రయిస్తే **+₹245/క్వింటాల్ అదనపు లాభం** లభిస్తుంది.`;
      followUps.push("రవాణా ఖర్చు గణన", "30 రోజుల ధరల గ్రాఫ్", "ఉత్పత్తి అమ్మకానికి పెట్టండి");
    } else if (lang === "ta") {
      replyText = `**சந்தை விலை ஒப்பீடு (${farm.currentCrop} - AGMARKNET):**

1. 🏆 **சிறந்த லாபம்: பெங்களூரு யஷ்வந்த்பூர் APMC**
   • சராசரி விலை: **₹2,780 / குவிண்டால்**
   • போக்குவரத்து செலவு: ₹125/குவிண்டால்
   • **நிகர லாபம்: ₹2,655 / குவிண்டால்**

2. **கோலார் APMC (உள்ளூர்):**
   • சராசரி விலை: **₹2,450 / குவிண்டால்**
   • **நிகர லாபம்: ₹2,410 / குவிண்டால்**`;
      followUps.push("போக்குவரத்து செலவு கணக்கீடு", "30 நாள் விலை போக்கு", "சந்தையில் விற்க");
    } else if (lang === "mr") {
      replyText = `**बाजारभाव विश्लेषण (${farm.currentCrop} - AGMARKNET थेट माहिती):**

1. 🏆 **सर्वोत्तम नफा: बंगळुरू यशवंतपूर APMC**
   • सरासरी भाव: **₹२,७८० / क्विंटल**
   • वाहतूक खर्च: ₹१२५/क्विंटल
   • **शेतकऱ्याला मिळणारा निव्वळ भाव: ₹२,६५५ / क्विंटल**

२. **कोलार APMC (स्थानिक):**
   • सरासरी भाव: **₹२,४५० / क्विंटल**
   • **निव्वळ भाव: ₹२,४१० / क्विंटल**`;
      followUps.push("वाहतूक खर्च मोजा", "३० दिवसांचा दर आलेख", "बाजारपेठेत विक्री करा");
    } else {
      replyText = `**Market Price Realization for ${farm.currentCrop} (Today's AGMARKNET Spread):**

1. 🏆 **Best Net Take-Home: Bengaluru Yeshwantpur APMC**
   • Modal Price: **₹2,780 / Quintal**
   • Transport Cost: ₹125/qtl (Distance: 68 km)
   • **Net Farmer Return: ₹2,655 / Quintal**

2. **Kolar APMC (Local):**
   • Modal Price: **₹2,450 / Quintal**
   • Transport Cost: ₹40/qtl (Distance: 14 km)
   • **Net Farmer Return: ₹2,410 / Quintal**

💡 **Recommendation:** You gain **+₹245/quintal net profit** by transporting harvest to Bengaluru Yeshwantpur if lot size ≥ 15 quintals.`;
      followUps.push("Calculate transport cost for 20 quintals", "View 30-day price trend", "List produce on marketplace");
    }

    citations.push({
      id: "kb_mandi",
      source: "AGMARKNET & e-NAM National Price Ticker",
      title: "Daily APMC Arrivals and Modal Spread Analysis",
      section: "Market Intelligence Desk",
      year: "2026",
      authority: "Directorate of Marketing & Inspection (DMI)",
      confidenceScore: 0.99,
    });
  }
  // CASE 4: Government Schemes & Subsidies
  else if (isSchemeQuery) {
    toolsUsed.push({ tool: "getFarmerProfile", args: {}, output: DEMO_FARMER });
    toolsUsed.push({ tool: "getGovernmentSchemes", args: {}, output: DEMO_SCHEMES });

    if (lang === "hi") {
      replyText = `**आपके लिए सत्यापित सरकारी योजनाएं (${DEMO_FARMER.name} - 4.0 एकड़ भूमि):**

1. **PM-KISAN (प्रधानमंत्री किसान सम्मान निधि)** — *सत्यापित पात्र*
   • लाभ: ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें सीधे बैंक खाते में)।

2. **PMKSY (ड्रिप सिंचाई 55% सब्सिडी)** — *उच्च प्राथमिकता*
   • लाभ: ड्रिप लाइन विस्तार के लिए ₹45,000/एकड़ तक सब्सिडी।
   • आवश्यक दस्तावेज: खतौनी (RTC), आधार कार्ड, बैंक पासबुक।

3. **PM-KUSUM (सोलर कृषि पंप)** — *60% कुल सब्सिडी*
   • 5 HP स्टैंडअलोन सोलर पंप पर 60% सरकारी छूट।

4. **PMFBY (प्रधानमंत्री फसल बीमा योजना)** — *30 सितंबर तक आवेदन करें*
   • टमाटर व मूंगफली फसल के लिए ₹65,000/एकड़ तक का बीमा सुरक्षा कवर।`;
      followUps.push("ड्रिप सब्सिडी के लिए आवेदन प्रक्रिया", "फसल बीमा क्लेम कैसे करें", "पात्रता प्रमाण पत्र");
    } else if (lang === "kn") {
      replyText = `**ನಿಮಗೆ ಲಭ್ಯವಿರುವ ಪರಿಶೀಲಿಸಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು (${DEMO_FARMER.name} - 4.0 ಎಕರೆ ಜಮೀನು):**

1. **ಪಿಎಂ-ಕಿಸಾನ್ (PM-KISAN)** — *ಪರಿಶೀಲಿಸಿದ ಫಲಾನುಭವಿ*
   • ಸೌಲಭ್ಯ: ವರ್ಷಕ್ಕೆ ₹6,000 (₹2,000 ರ 3 ಕಂತುಗಳು ನೇರವಾಗಿ ಖಾತೆಗೆ)।

2. **ಪಿಎಂಕೆಎಸ್‌ವೈ (ಹನಿ ನೀರಾವರಿ 55% ಸಬ್ಸಿಡಿ)** — *ಹೆಚ್ಚಿನ ಆದ್ಯತೆ*
   • ಸೌಲಭ್ಯ: ಪ್ಲಾಟ್ 2 ಗೆ ಡ್ರಿಪ್ ಅಳವಡಿಕೆಗೆ ಎಕರೆಗೆ ₹45,000 ವರೆಗೆ ಸಬ್ಸಿಡಿ।
   • ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಪಹಣಿ (RTC), ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್।

3. **ಪಿಎಂ-ಕುಸುಮ್ (ಸೌರಶಕ್ತಿ ಕೃಷಿ ಪಂಪ್)** — *60% ಸಬ್ಸಿಡಿ*
   • 5 HP ಸೋಲಾರ್ ಪಂಪ್‌ಗೆ 60% ಸರ್ಕಾರಿ ರಿಯಾಯಿತಿ।

4. **ಪಿಎಂಎಫ್‌ಬಿವೈ (ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ)** — *ಸೆಪ್ಟೆಂಬರ್ 30 ಕೊನೆಯ ದಿನ*
   • ಟೊಮೆಟೊ ಮತ್ತು ನೆಲಗಡಲೆ ಬೆಳೆಗೆ ಎಕರೆಗೆ ₹65,000 ವರೆಗೆ ವಿಮಾ ರಕ್ಷಣೆ।`;
      followUps.push("ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಅರ್ಜಿ ವಿಧಾನ", "ಬೆಳೆ ವಿಮೆ ಪರಿಹಾರ ಪ್ರಕ್ರಿಯೆ", "ಅರ್ಹತೆ ಪ್ರಮಾಣಪತ್ರ");
    } else {
      replyText = `**Matched Government Benefits for ${DEMO_FARMER.name} (4.0 Acres in Kolar, Karnataka):**

1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)** — *Eligible & Verified*
   • Benefit: ₹6,000/year in 3 DBT direct installments.
   • Status: Linked with your RTC / Pahani.

2. **PMKSY (Micro-Irrigation 55% Subsidy)** — *High Priority Match*
   • Benefit: Up to ₹45,000/acre subsidy for expanding drip lines to Plot 2.
   • Documents: RTC / Pahani, Aadhar, Bank Passbook, Soil Test Report.

3. **PM-KUSUM Component B (Solar Agri Pump)** — *60% Total Subsidy*
   • Standalone 5 HP solar agri pump with grid backup.

4. **PMFBY (Crop Insurance)** — *Deadline: September 30*
   • Comprehensive coverage up to ₹65,000/acre for notified Kharif crops.`;
      followUps.push("How to apply for PMKSY drip subsidy?", "Check insurance claim process", "Download eligibility certificate");
    }

    citations.push({
      id: "kb_03",
      source: "Ministry of Agriculture & Farmers Welfare, GoI",
      title: "PMKSY & PM-KISAN Operational Guidelines",
      section: "Direct Benefit Schemes",
      year: "2025",
      authority: "Govt of India",
      confidenceScore: 0.98,
    });
  }
  // DEFAULT: Holistic Farm Plan
  else {
    toolsUsed.push({ tool: "getFarmData", args: { farmId: farm.id }, output: farm });
    toolsUsed.push({ tool: "getSoilData", args: {}, output: DEMO_SOIL_REPORT });
    toolsUsed.push({ tool: "getWeatherForecast", args: {}, output: DEMO_WEATHER_DAYS[0] });
    toolsUsed.push({ tool: "getFarmRiskScore", args: {}, output: { score: 28 } });

    if (lang === "hi") {
      replyText = `**नमस्ते ${DEMO_FARMER.name}! आज की कृषिमित्र कार्ययोजना (${farm.name}):**

1. 💧 **सिंचाई रोकें:** शाम 4:30 बजे 18.5 मिमी बारिश (84% संभावना)।
2. 🔍 **खेत निरीक्षण:** उच्च आर्द्रता (88%) के कारण कवक रोग से बचाव के लिए निचली पत्तियों की जांच करें।
3. ⛔ **छिड़काव रोकें:** 22 किमी/घंटा की तेज हवाओं से दवा बहने का खतरा।
4. 📈 **मंडी अवसर:** बेंगलुरु मंडी में ₹2,780/क्विंटल भाव मिल रहा है।
5. 🛡️ **फार्म रिस्क स्कोर:** **28 / 100 (सुरक्षित व अनुकूल)**।`;
      followUps.push("सिंचाई रोकने का कारण", "पत्ते के रोग की जांच कैसे करें", "सर्वश्रेष्ठ मंडी भाव");
    } else if (lang === "kn") {
      replyText = `**ನಮಸ್ಕಾರ ${DEMO_FARMER.name}! ಇಂದಿನ ಕೃಷಿ ಕಾರ್ಯಯೋಜನೆ (${farm.name}):**

1. 💧 **ನೀರಾವರಿ ಬೇಡ:** ಸಂಜೆ 4:30 ಕ್ಕೆ 18.5 ಮಿಮೀ ಮಳೆ ಸಂಭವನೀಯತೆ (84%).
2. 🔍 **ಜಮೀನು ಪರಿಶೀಲನೆ:** ರಾತ್ರಿ ಹೆಚ್ಚಿನ ತೇವಾಂಶವಿದ್ದ ಕಾರಣ ಎಲೆಗಳ ರೋಗ ತಪಾಸಣೆ ನಡೆಸಿ.
3. ⛔ **ಸಿಂಪರಣೆ ಬೇಡ:** 22 ಕಿಮೀ/ಗಂಟೆ ವೇಗದ ಗಾಳಿಯಿರುವ ಕಾರಣ ಸಿಂಪಡಣೆ ಮಾಡಬೇಡಿ.
4. 📈 **ಮಾರುಕಟ್ಟೆ ಅವಕಾಶ:** ಬೆಂಗಳೂರು ಎಪಿಎಂಸಿಯಲ್ಲಿ ₹2,780/ಕ್ವಿಂಟಾಲ್ ಬೆಲೆಯಿದೆ.
5. 🛡️ **ಫಾರ್ಮ್ ರಿಸ್ಕ್ ಸ್ಕೋರ್:** **28 / 100 (ಸುರಕ್ಷಿತ)**.`;
      followUps.push("ನೀರಾವರಿ ನಿಲ್ಲಿಸುವ ವಿವರ", "ಎಲೆ ರೋಗ ತಪಾಸಣೆ ಹೇಗೆ", "ಮಾರುಕಟ್ಟೆ ದರಗಳ ಪಟ್ಟಿ");
    } else {
      replyText = `**Hello ${DEMO_FARMER.name}! Here is your AI Farm Action Plan for Today (${farm.name}):**

1. 💧 **Skip Irrigation:** 18.5 mm rain expected at 4:30 PM (84% chance).
2. 🔍 **Scout Zone B:** High overnight humidity (88%) created risk of early blight on lower canopy.
3. ⛔ **Hold Chemical Sprays:** Gusty winds (22 km/h) will cause pesticide drift.
4. 📈 **Mandi Opportunity:** Bengaluru price is ₹2,780/qtl (+₹245/qtl net over Kolar).
5. 🛡️ **Farm Risk Index:** **28 / 100 (Safe / Optimal)**.`;
      followUps.push("Explain why to skip irrigation", "How to scout for early blight?", "Show best selling market");
    }
  }

  return {
    id: `msg_${Date.now()}`,
    sender: "assistant",
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    toolsUsed,
    citations,
    suggestedFollowUps: followUps,
  };
}

// 3. High-level API Helper Functions
export async function executeAgentTurn(
  message: string,
  language: Language = "en",
  activeFarm?: Farm,
  history: any[] = []
) {
  const farm = activeFarm || DEMO_FARMS[0];
  const response = generateCopilotResponse(message, farm, language);
  return {
    reply: response.text,
    toolsUsed: response.toolsUsed || [],
    citations: response.citations || [],
    data: {
      timestamp: new Date().toISOString(),
      language,
      farmId: farm.id
    }
  };
}

export async function analyzeLeafImage(imageBase64: string, crop: string = "Tomato") {
  const dis = DEMO_DISEASE_RECORDS[0];
  return {
    pathogen: dis.diseaseName,
    scientificName: dis.scientificName,
    confidence: dis.confidence,
    severity: dis.severity,
    symptoms: dis.symptoms,
    causes: dis.causes,
    immediateActions: dis.immediateActions,
    preventiveActions: dis.preventiveActions,
    expertEscalationNeeded: dis.expertEscalationNeeded,
    chemicalSpraySchedule: "Mancozeb 75% WP @ 2.5g/L (Pre-harvest interval: 7 days)"
  };
}

export function generateDeterministicPlan(plotId: string = "plot-1") {
  return DEMO_ACTIONS;
}

export function calculateCropRecommendations(input: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  rainfallMm: number;
  tempCelsius: number;
  soilType: string;
  season: string;
}): CropRecommendationResult[] {
  const crops: CropRecommendationResult[] = [
    {
      cropName: "Tomato (Hybrid)",
      variety: "Arka Rakshak / US-440",
      overallScore: 94,
      expectedYieldQuintalPerAcre: 180,
      estimatedCostPerAcre: 48000,
      estimatedRevenuePerAcre: 198000,
      estimatedNetProfitPerAcre: 150000,
      soilCompatibilityScore: 96,
      climateCompatibilityScore: 92,
      waterFeasibilityScore: 95,
      marketDemandScore: 93,
      reasons: [
        "Soil pH (6.8) and potassium reserves (285 kg/ha) are optimal for solanaceous fruit development.",
        "Kolar and Bengaluru APMC markets have strong modal price trends (₹2,400 - ₹2,800/qtl).",
        "Arka Rakshak variety has triple disease resistance (ToLCV + Bacterial Wilt + Early Blight).",
      ],
      risks: [
        "Price volatility during peak harvest months.",
        "Requires active drip line maintenance and humidity scouting.",
      ],
      season: "Kharif / Rabi",
    },
    {
      cropName: "Groundnut",
      variety: "TMV 2 / Kadiri 6",
      overallScore: 89,
      expectedYieldQuintalPerAcre: 12,
      estimatedCostPerAcre: 18000,
      estimatedRevenuePerAcre: 72000,
      estimatedNetProfitPerAcre: 54000,
      soilCompatibilityScore: 92,
      climateCompatibilityScore: 90,
      waterFeasibilityScore: 88,
      marketDemandScore: 86,
      reasons: [
        "Red sandy loam soil has excellent peg penetration texture.",
        "Nitrogen-fixing root nodules will replenish depleted soil nitrogen for subsequent crop cycles.",
        "Low water requirement (350-450mm) makes it resilient during dry spells.",
      ],
      risks: [
        "Tikka leaf spot during excessive humid spells.",
        "Need gypsum application at 45 days.",
      ],
      season: "Kharif",
    },
    {
      cropName: "Sweet Corn / Baby Corn",
      variety: "Sugar 75",
      overallScore: 84,
      expectedYieldQuintalPerAcre: 60,
      estimatedCostPerAcre: 22000,
      estimatedRevenuePerAcre: 96000,
      estimatedNetProfitPerAcre: 74000,
      soilCompatibilityScore: 88,
      climateCompatibilityScore: 85,
      waterFeasibilityScore: 82,
      marketDemandScore: 81,
      reasons: [
        "Short crop duration (75-80 days) allows fast land turnover.",
        "High urban food processing and hotel demand in Bengaluru peri-urban zone.",
        "High green fodder biomass value for dairy livestock.",
      ],
      risks: [
        "Fall Armyworm (Spodoptera frugiperda) monitoring required from whorl stage.",
      ],
      season: "All seasons",
    },
    {
      cropName: "Ragi (Finger Millet)",
      variety: "GPU-28 / MR-6",
      overallScore: 78,
      expectedYieldQuintalPerAcre: 14,
      estimatedCostPerAcre: 12000,
      estimatedRevenuePerAcre: 53200,
      estimatedNetProfitPerAcre: 41200,
      soilCompatibilityScore: 95,
      climateCompatibilityScore: 95,
      waterFeasibilityScore: 96,
      marketDemandScore: 72,
      reasons: [
        "Extreme drought resilience and minimal chemical fertilizer requirement.",
        "Assured state MSP procurement under Karnataka Raitha Siri program (₹3,846/qtl).",
      ],
      risks: [
        "Lower gross revenue ceiling compared to commercial horticulture.",
      ],
      season: "Kharif",
    },
    {
      cropName: "Capsicum (Green Bell Pepper)",
      variety: "Indra / Bharat",
      overallScore: 73,
      expectedYieldQuintalPerAcre: 90,
      estimatedCostPerAcre: 52000,
      estimatedRevenuePerAcre: 180000,
      estimatedNetProfitPerAcre: 128000,
      soilCompatibilityScore: 80,
      climateCompatibilityScore: 72,
      waterFeasibilityScore: 78,
      marketDemandScore: 79,
      reasons: [
        "High market price realization in hospitality segment.",
        "Performs well on well-drained sandy loam with drip irrigation.",
      ],
      risks: [
        "Sensitive to thrips, mites, and sudden temperature fluctuations (>32°C causes blossom drop).",
      ],
      season: "Rabi / Winter",
    },
  ];

  return crops;
}
