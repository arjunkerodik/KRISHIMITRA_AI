/**
 * KRISHIMITRA AI — VERIFIED GOVERNMENT SCHEMES DATA SERVICE
 * Sourced directly from official portals and myScheme.gov.in
 * Ministry of Agriculture and Farmers Welfare & State Nodal Departments
 */

export interface VerifiedGovtScheme {
  id: string;
  title: string;
  codeName: string;
  ministry: string;
  department: string;
  level: "Central" | "State";
  stateApplicability: string[];
  category: 
    | "Direct Benefit" 
    | "Irrigation" 
    | "Credit & Finance" 
    | "Insurance" 
    | "Solar Energy" 
    | "Farm Machinery" 
    | "Organic & Natural Farming" 
    | "Horticulture" 
    | "Soil Health";
  shortDescription: string;
  eligibility: string[];
  benefits: string;
  subsidyPercentage?: number;
  maxFinancialAssistance?: string;
  documentsRequired: string[];
  applicationProcess: string[];
  lastVerified: string;
  officialPortal: string;
  officialApplicationUrl: string | null;
  mySchemeUrl: string;
  helplinePhone: string;
  helplineEmail?: string;
  isVerifiedOfficial: boolean;
  status: "Active" | "Upcoming" | "Closing Soon";
  deadlineText?: string;
  matchCriteria: {
    maxLandAcres?: number;
    minLandAcres?: number;
    eligibleStates?: string[];
    eligibleCrops?: string[];
    eligibleSoilTypes?: string[];
    irrigationType?: string[];
  };
}

export const VERIFIED_GOVERNMENT_SCHEMES: VerifiedGovtScheme[] = [
  {
    id: "sch_pmkisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    codeName: "PM-KISAN",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "Department of Agriculture and Farmers Welfare (DA&FW)",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Direct Benefit",
    shortDescription: "Direct income support of ₹6,000 per year transferred in 3 equal four-monthly installments of ₹2,000 directly into the Aadhaar-seeded bank accounts of farmer families.",
    benefits: "₹6,000 annually in 3 installments of ₹2,000 each via Direct Benefit Transfer (DBT) to institutionalized bank accounts.",
    maxFinancialAssistance: "₹6,000 / year",
    eligibility: [
      "All landholding farmer families with cultivable landholding in their names.",
      "Land records must be updated and verified on State Revenue Portals (e.g., Bhoomi / Pahani in Karnataka).",
      "Farmer must complete Aadhaar e-KYC on the PM-KISAN portal.",
      "Exclusions: Institutional landholders, serving/retired government officers, income tax payees, constitutional post holders.",
    ],
    documentsRequired: [
      "Aadhaar Card with linked active mobile number",
      "Land Ownership Document (Record of Rights, Tenancy and Crops - RTC / Pahani / RoR)",
      "Bank Account Passbook (Aadhaar & NPCI Direct Benefit Transfer seeded)",
      "Self-Declaration Form of Land Possession",
    ],
    applicationProcess: [
      "1. Visit the official PM-KISAN portal (https://pmkisan.gov.in) and click on 'New Farmer Registration'.",
      "2. Enter Aadhaar Number and State, then complete OTP verification.",
      "3. Fill in Personal Details, Land Survey Number, Sub-Division, and Upload RTC Document.",
      "4. Submit the registration form. The Taluk Agriculture Officer (ADA) will verify field records.",
      "5. Track application status under 'Know Your Status' tab using Registration / Aadhaar number.",
    ],
    lastVerified: "2026-09-15",
    officialPortal: "https://pmkisan.gov.in",
    officialApplicationUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/pm-kisan",
    helplinePhone: "155261 / 011-24300606",
    helplineEmail: "pmkisan-ict@gov.in",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "Open Year-Round for Eligible Farmers",
    matchCriteria: {
      maxLandAcres: 50,
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    codeName: "PMFBY",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "Department of Agriculture and Farmers Welfare",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Insurance",
    shortDescription: "Comprehensive crop insurance coverage against unavoidable natural risks from pre-sowing to post-harvest at an extremely low farmer premium (1.5% for Rabi, 2% for Kharif, 5% for Annual Horticultural crops).",
    benefits: "Full Sum Insured coverage for localized calamities (hailstorm, landslide, inundation), mid-season adversity, and post-harvest losses with direct claim settlement.",
    subsidyPercentage: 85,
    maxFinancialAssistance: "Sum Insured up to ₹65,000 / acre based on district scale of finance",
    eligibility: [
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
      "Applicable for both Loanee farmers (via Banks/PACs) and Non-Loanee farmers.",
      "Sowing must be verified by local Village Agriculture Assistant or Sowing Certificate.",
    ],
    documentsRequired: [
      "Land Record Certificate (RTC / Pahani / Patta)",
      "Sowing Certificate issued by Village Accountant / Self-declaration",
      "Aadhaar Card",
      "Bank Account Details with IFSC Code and cancelled cheque/passbook copy",
    ],
    applicationProcess: [
      "1. Log in to PMFBY Portal (https://pmfby.gov.in) or download the Crop Insurance App.",
      "2. Click 'Farmer Application' and select State, Season, Year, and Scheme (PMFBY).",
      "3. Enter Aadhaar number, farmer details, and village survey number.",
      "4. Select notified crop and enter sowing area acreage.",
      "5. Pay nominal premium (1.5% - 2%) via Net Banking/UPI and download Insurance Policy Receipt.",
    ],
    lastVerified: "2026-09-12",
    officialPortal: "https://pmfby.gov.in",
    officialApplicationUrl: "https://pmfby.gov.in/farmerRegistrationForm",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/pmfby",
    helplinePhone: "14447 (Toll-Free National Helpline)",
    helplineEmail: "help.agri-insurance@gov.in",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "Kharif Cycle cutoff: Sep 30 • Rabi Cycle cutoff: Dec 31",
    matchCriteria: {
      eligibleStates: ["All India"],
      eligibleCrops: ["Tomato", "Groundnut", "Paddy", "Maize", "Ragi", "Cotton", "Wheat"],
    },
  },
  {
    id: "sch_pmksy",
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
    codeName: "PMKSY-PDMC",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "DA&FW - Micro Irrigation Division",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Irrigation",
    shortDescription: "Financial assistance of 55% for Small & Marginal farmers and 45% for Other category farmers for installing high-efficiency Drip and Sprinkler irrigation systems.",
    benefits: "55% government subsidy on benchmark installation costs for drip lateral systems, online emitters, filter units, and fertigation tanks.",
    subsidyPercentage: 55,
    maxFinancialAssistance: "₹45,000 / acre",
    eligibility: [
      "Farmers having an assured water source (Borewell, Open Well, Canal, or Farm Pond).",
      "Land ownership title (RTC) or registered long-term lease agreement (min 7 years).",
      "Beneficiary must not have availed micro-irrigation subsidy on the same survey plot within the past 7 years.",
    ],
    documentsRequired: [
      "RTC / Pahani Land Record",
      "Water Source Feasibility Proof / Electricity pump bill or NOC",
      "Soil & Water Test Lab Report",
      "Aadhaar Card & Bank Passbook copy",
      "Quotation / Design layout from empaneled micro-irrigation manufacturer (Jain / Netafim etc.)",
    ],
    applicationProcess: [
      "1. Register on State Micro Irrigation Portal (e.g. Karnataka Raitamitra / PMKSY nodal portal).",
      "2. Select empaneled micro-irrigation vendor for farm survey and GPS layout drawing.",
      "3. Upload vendor quotation, RTC, and water test report.",
      "4. Assistant Director of Horticulture/Agriculture verifies field parameters and issues Work Order.",
      "5. Vendor installs drip system; Department engineers conduct GPS verification before releasing 55% subsidy.",
    ],
    lastVerified: "2026-09-10",
    officialPortal: "https://pmksy.gov.in",
    officialApplicationUrl: "https://pmksy.gov.in/mis/frmDashboard.aspx",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/pmksy-pdmc",
    helplinePhone: "1800-180-1551 (Kisan Call Centre)",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "Applications Open on First-Come-First-Serve Basis",
    matchCriteria: {
      maxLandAcres: 12.5,
      irrigationType: ["Borewell", "Drip", "Open Well", "Sprinkler"],
    },
  },
  {
    id: "sch_pmkusum",
    title: "PM-KUSUM (Component B - Standalone Solar Agriculture Pumps)",
    codeName: "PM-KUSUM",
    ministry: "Ministry of New and Renewable Energy (MNRE)",
    department: "National Solar Energy Division",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Solar Energy",
    shortDescription: "60% subsidy (30% Central + 30% State) for individual farmers to replace existing diesel irrigation pumps or install standalone off-grid solar PV water pumping systems up to 7.5 HP.",
    benefits: "60% combined subsidy on total capital cost. Farmer pays only 10% upfront; remaining 30% available via low-interest bank loan.",
    subsidyPercentage: 60,
    maxFinancialAssistance: "Up to ₹1,85,000 per 5 HP Solar Pump Set",
    eligibility: [
      "Individual farmers, Water User Associations, and Farmer Producer Organizations (FPOs).",
      "Land must not have an existing energized agricultural grid electricity connection.",
      "Borewell / water source must have adequate perennial yield verified by Ground Water Directorate.",
    ],
    documentsRequired: [
      "Land RTC / Patta showing cultivable area",
      "Groundwater Department Water Yield Feasibility Certificate",
      "Aadhaar Card and 2 Passport Photos",
      "Caste Certificate (for additional SC/ST subsidy where applicable)",
      "Bank Account NOC for direct disbursement",
    ],
    applicationProcess: [
      "1. Access the State Renewable Energy Development Agency portal (e.g. KREDL in Karnataka / MEDA in Maharashtra).",
      "2. Click 'PM-KUSUM Component B Application' and verify Aadhaar.",
      "3. Select required pump capacity (3 HP, 5 HP, or 7.5 HP) based on water depth.",
      "4. Pay 10% farmer share into the designated state agency escrow account.",
      "5. Empaneled solar vendor installs PV array and DC submersible pump with 5-year comprehensive warranty.",
    ],
    lastVerified: "2026-09-08",
    officialPortal: "https://pmkusum.mnre.gov.in",
    officialApplicationUrl: "https://pmkusum.mnre.gov.in/landing.html",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/pm-kusum",
    helplinePhone: "1800-180-3333 (MNRE National Solar Helpline)",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "Phase-III Target: 2026-27 Active Quota",
    matchCriteria: {
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_smam",
    title: "Sub-Mission on Agricultural Mechanization (SMAM - Custom Hiring & Machinery)",
    codeName: "SMAM",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "Mechanization and Technology Division",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Farm Machinery",
    shortDescription: "Subsidy of 40% to 50% for individual farmers for purchasing tractors, power tillers, rotavators, drone sprayers, and up to 80% grant for FPOs to establish Custom Hiring Centres (CHC).",
    benefits: "40% - 50% financial assistance on tractors (up to ₹2.0 Lakh) and 50% subsidy on agricultural spraying drones for individual farmers / 100% for ICAR-KVK institutions.",
    subsidyPercentage: 50,
    maxFinancialAssistance: "₹2,00,000 for Tractors / ₹5,00,000 for Agri Drones",
    eligibility: [
      "Individual farmers owning registered land records.",
      "Preference given to Small, Marginal, Women, and SC/ST farmers.",
      "Must purchase machinery models tested by FMTTI (Farm Machinery Training and Testing Institute).",
    ],
    documentsRequired: [
      "Aadhaar Card and Mobile Number",
      "Land Ownership Record (RTC)",
      "Bank Account Passbook copy",
      "Driving License / Drone Pilot Certification (if applying for Agri Drone)",
      "FMTTI tested machinery quotation from registered dealer",
    ],
    applicationProcess: [
      "1. Register on DBT Agri Machinery Portal (https://agrimachinery.nic.in).",
      "2. Select equipment type, manufacturer, and authorized district dealer.",
      "3. Upload land records and bank documents.",
      "4. Department issues online pre-sanction approval letter.",
      "5. Purchase machine, upload tax invoice, and receive direct subsidy credit via DBT.",
    ],
    lastVerified: "2026-09-05",
    officialPortal: "https://agrimachinery.nic.in",
    officialApplicationUrl: "https://agrimachinery.nic.in/Farmer/Registration",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/smam",
    helplinePhone: "011-23381012",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "FY 2026-27 Open Allocation",
    matchCriteria: {
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_soilhealth",
    title: "Soil Health Card Scheme (SHC)",
    codeName: "SHC",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "Integrated Nutrient Management Division",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Soil Health",
    shortDescription: "Free periodic soil testing and distribution of customized Soil Health Cards providing 12-parameter soil fertility status and exact stoichiometric NPK & organic fertilizer dosages.",
    benefits: "100% free lab testing of 12 chemical parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with tailored crop-wise fertilizer recommendations.",
    subsidyPercentage: 100,
    maxFinancialAssistance: "Free Soil Testing & Lab Report Card",
    eligibility: [
      "Every farmer with active agricultural landholding.",
      "Soil sample collected GPS-tagged by Village Agriculture Assistant or self-submitted to district lab.",
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Survey Number and Village Details",
      "Previous Crop and Next Planned Crop Information",
    ],
    applicationProcess: [
      "1. Visit the National Soil Health Portal (https://soilhealth.dac.gov.in).",
      "2. Submit soil sample (0-15cm depth zigzag method) to local Raitha Samparka Kendra / KVK Lab.",
      "3. Lab analyzes parameters and uploads analytical results against Farmer Mobile/Aadhaar.",
      "4. Download computerized Soil Health Card and fertilizer recommendations.",
    ],
    lastVerified: "2026-09-14",
    officialPortal: "https://soilhealth.dac.gov.in",
    officialApplicationUrl: "https://soilhealth.dac.gov.in/soilhealthcard/sampledataentry",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/shcs",
    helplinePhone: "1800-180-1551",
    isVerifiedOfficial: true,
    status: "Active",
    matchCriteria: {
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_kcc",
    title: "Kisan Credit Card (KCC) & Modified Interest Subvention Scheme",
    codeName: "KCC",
    ministry: "Ministry of Finance & DA&FW",
    department: "Department of Financial Services / NABARD",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Credit & Finance",
    shortDescription: "Adequate and timely short-term credit for crop cultivation, post-harvest expenses, and farm maintenance at an effective concessional interest rate of only 4% per annum (7% base minus 3% prompt repayment incentive).",
    benefits: "Revolving crop credit limit up to ₹3.0 Lakh at 4% net interest rate per annum without collateral up to ₹1.60 Lakh.",
    maxFinancialAssistance: "Credit Limit up to ₹3,00,000",
    eligibility: [
      "All owner cultivators, tenant farmers, oral lessees, and sharecroppers.",
      "Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers.",
      "Animal husbandry and fisheries farmers are also eligible for working capital up to ₹2.0 Lakh.",
    ],
    documentsRequired: [
      "Duly completed KCC Application Form",
      "Identity & Address Proof (Aadhaar / Voter ID / Driving License)",
      "Land Record Documents (RTC / Pahani / Patta) certified by Revenue Authority",
      "Cropping pattern and sowing certificate",
    ],
    applicationProcess: [
      "1. Download standardized 1-page KCC application form from bank portal or visit local Commercial Bank / Grameen Bank / Cooperative.",
      "2. Submit land records and Aadhaar proof.",
      "3. Bank branch issues KCC RuPay Debit Card within 14 working days.",
      "4. Withdraw cash directly at ATM or purchase seeds/fertilizers at authorized POS counters.",
    ],
    lastVerified: "2026-09-02",
    officialPortal: "https://www.nabard.org",
    officialApplicationUrl: "https://pmkisan.gov.in/Documents/KCC_Application_Form.pdf",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/kcc",
    helplinePhone: "1800-11-2211 / 1800-425-3800",
    isVerifiedOfficial: true,
    status: "Active",
    matchCriteria: {
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_pkvy",
    title: "Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming Mission)",
    codeName: "PKVY",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "National Mission on Sustainable Agriculture (NMSA)",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Organic & Natural Farming",
    shortDescription: "Promotes organic cluster farming through Participatory Guarantee System (PGS) certification. Provides ₹50,000 per hectare for organic inputs, vermicompost units, bio-pesticides, packaging, and direct marketing.",
    benefits: "₹50,000/hectare assistance over 3 years, of which ₹31,000/ha is directly transferred for bio-fertilizers, neem cake, and bio-control agents.",
    subsidyPercentage: 70,
    maxFinancialAssistance: "₹50,000 / hectare",
    eligibility: [
      "Farmers forming a cluster of minimum 20 hectares (50 farmers).",
      "Commitment to chemical-free natural farming for 3 continuous years.",
    ],
    documentsRequired: [
      "Cluster Membership Resolution",
      "Individual Land RTC / Pahani",
      "Aadhaar Card and Bank Details",
      "Soil Baseline Organic Carbon Test Record",
    ],
    applicationProcess: [
      "1. Form a farmer cluster through Raitha Samparka Kendra or local FPO.",
      "2. Register the group on the PGS-India organic portal (https://pgsindia-ncof.gov.in).",
      "3. Receive first tranche for procurement of on-farm composting and biological inputs.",
      "4. Complete peer inspections and receive formal organic PGS-Green & PGS-India certification.",
    ],
    lastVerified: "2026-08-28",
    officialPortal: "https://pgsindia-ncof.gov.in",
    officialApplicationUrl: "https://pgsindia-ncof.gov.in/Registration.aspx",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/pkvy",
    helplinePhone: "0120-2764906",
    isVerifiedOfficial: true,
    status: "Active",
    matchCriteria: {
      eligibleStates: ["All India"],
    },
  },
  {
    id: "sch_krishibhagya",
    title: "Krishi Bhagya Scheme (Farm Pond, Polythene Mulching & Shade Nets)",
    codeName: "KRISHI-BHAGYA",
    ministry: "Department of Agriculture, Govt of Karnataka",
    department: "Watershed Development Department",
    level: "State",
    stateApplicability: ["Karnataka"],
    category: "Irrigation",
    shortDescription: "Flagship Karnataka state scheme providing 80% subsidy for General farmers and 90% for SC/ST farmers for rainwater harvesting Farm Ponds (Krishi Honda), polythene lining, diesel/solar pump sets, and shade net houses in rainfed taluks.",
    benefits: "80% - 90% direct subsidy for construction of 10m x 10m to 20m x 20m polythene lined Farm Ponds and micro-sprinklers.",
    subsidyPercentage: 80,
    maxFinancialAssistance: "Up to ₹1,75,000 for complete Farm Pond Package",
    eligibility: [
      "Farmers having landholding in rainfed and dryland taluks of Karnataka (Kolar, Chikkaballapur, Tumakuru, Chitradurga, etc.).",
      "Minimum 1 acre cultivable landholding.",
    ],
    documentsRequired: [
      "Land Pahani (RTC) with current year crop entry",
      "Aadhaar Card & Mobile number linked to FRUITS ID",
      "Bank Account details seeded in FRUITS portal",
      "Caste Certificate (RD number for SC/ST farmers)",
    ],
    applicationProcess: [
      "1. Submit application at local Raitha Samparka Kendra (RSK) or through Karnataka FRUITS portal (https://fruits.karnataka.gov.in).",
      "2. Department Agriculture Officer conducts pre-inspection GPS marking of farm pond site.",
      "3. Machinery excavates pond and installs 500-micron UV-stabilized polythene sheet.",
      "4. Post-work joint inspection verifies dimensions; subsidy credited directly via K-Kisan DBT.",
    ],
    lastVerified: "2026-09-14",
    officialPortal: "https://raitamitra.karnataka.gov.in",
    officialApplicationUrl: "https://fruits.karnataka.gov.in",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/krishi-bhagya-yojane",
    helplinePhone: "1800-425-3553 (Karnataka Agriculture Helpline)",
    isVerifiedOfficial: true,
    status: "Active",
    deadlineText: "Taluk Allocation Quota Open",
    matchCriteria: {
      eligibleStates: ["Karnataka"],
    },
  },
  {
    id: "sch_midh",
    title: "Mission for Integrated Development of Horticulture (MIDH)",
    codeName: "MIDH",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    department: "Horticulture Division",
    level: "Central",
    stateApplicability: ["All India"],
    category: "Horticulture",
    shortDescription: "Centrally sponsored scheme for holistic growth of horticulture sector covering fruits, vegetables, and flowers. Offers 50% subsidy on Polyhouse construction, shade-net houses, packhouses, and cold storage units.",
    benefits: "50% capital subsidy on naturally ventilated polyhouses (up to ₹445/sqm) and 50% subsidy for on-farm solar cold rooms (up to ₹15 Lakh for 500 MT).",
    subsidyPercentage: 50,
    maxFinancialAssistance: "₹4,45,000 / 1000 sqm Polyhouse",
    eligibility: [
      "Farmers growing high-value vegetables (Tomato, Capsicum, Cucumber) or flowers.",
      "Ownership of minimum 0.5 acre cultivable horticulture land with assured drip water.",
    ],
    documentsRequired: [
      "RTC / Pahani with horticulture crop feasibility report",
      "Detailed Project Report (DPR) prepared by approved structural engineer",
      "Aadhaar Card and Bank Passbook",
      "Soil and irrigation water salinity lab test report",
    ],
    applicationProcess: [
      "1. Apply on State Horticulture Portal or at District Senior Assistant Director of Horticulture (SADH) office.",
      "2. Submit DPR, structure blueprint, and vendor quote.",
      "3. State Horticulture Mission Board approves project and issues administrative sanction.",
      "4. Build polyhouse with empaneled structure fabricator.",
      "5. Committee conducts stage-wise technical inspection and disburses back-ended capital subsidy.",
    ],
    lastVerified: "2026-09-01",
    officialPortal: "https://midh.gov.in",
    officialApplicationUrl: "https://midh.gov.in/dbt/farmersRegistration.aspx",
    mySchemeUrl: "https://www.myscheme.gov.in/schemes/midh",
    helplinePhone: "011-23384468",
    isVerifiedOfficial: true,
    status: "Active",
    matchCriteria: {
      eligibleStates: ["All India"],
      eligibleCrops: ["Tomato", "Capsicum", "Vegetables", "Flowers"],
    },
  },
];
