"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import confetti from "canvas-confetti";
import {
  Tractor,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  PlusCircle,
  X,
  Calendar,
  Zap,
  CreditCard,
  QrCode,
  Smartphone,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Download,
  FileText,
  DollarSign,
  Search,
  Filter,
  Layers,
  Wheat,
  Check,
  Copy,
  Activity,
  Truck,
  Box,
  Users,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface MachineryService {
  id: string;
  name: string;
  category: "Tractor" | "Drone" | "Harvester" | "ColdStorage" | "Transport" | "Attachment";
  providerName: string;
  distanceKm: number;
  rate: number;
  rateUnit: string;
  availability: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  subsidyEligible: boolean;
  subsidyPercent: number;
  description: string;
  features: string[];
}

const MACHINERY_FLEET: MachineryService[] = [
  {
    id: "mch_01",
    name: "Mahindra 575 DI (50 HP Tractor + Rotavator)",
    category: "Tractor",
    providerName: "Kolar Taluk Farmers FPO / CHC",
    distanceKm: 4.2,
    rate: 850,
    rateUnit: "per hour",
    availability: "Available Today (Within 2 hrs)",
    phone: "+91 94480 88210",
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: "/images/tractor_rental.jpg",
    subsidyEligible: true,
    subsidyPercent: 40,
    description: "Heavy duty 50 HP tractor equipped with 42-blade Fieldking rotavator for complete primary and secondary soil tillage.",
    features: ["Certified Operator Included", "Diesel Included", "Laser Leveler Ready"],
  },
  {
    id: "mch_02",
    name: "Garuda Agri-Pro Hexacopter Spraying Drone (16L)",
    category: "Drone",
    providerName: "KrishiFly Drone Pilot Hub",
    distanceKm: 6.8,
    rate: 450,
    rateUnit: "per acre",
    availability: "Available Tomorrow Morning",
    phone: "+91 98860 11920",
    rating: 4.95,
    reviewsCount: 98,
    imageUrl: "/images/drone_spraying.jpg",
    subsidyEligible: true,
    subsidyPercent: 50,
    description: "DGCA-certified drone pilot providing ultra-fine micronized foliar nutrient and organic bio-fungicide spraying in 10 mins/acre.",
    features: ["16-Liter Tank", "Centrifugal Atomizers", "Zero Crop Trampling", "DGCA Certified Pilot"],
  },
  {
    id: "mch_03",
    name: "Kolar District Solar Cold Chain Storage",
    category: "ColdStorage",
    providerName: "Karnataka State Warehousing Corp",
    distanceKm: 8.5,
    rate: 25,
    rateUnit: "per crate / day",
    availability: "Immediate Slots Available",
    phone: "+91 81522 34910",
    rating: 4.8,
    reviewsCount: 310,
    imageUrl: "/images/cold_storage.jpg",
    subsidyEligible: true,
    subsidyPercent: 35,
    description: "Solar-powered climate-controlled pre-cooling and storage chamber maintaining 3.8°C and 90% humidity to prevent post-harvest spoilage.",
    features: ["Chamber Temp: 3.8°C", "90% Relative Humidity", "Digital e-NWR Receipt", "Zero Weight Loss Guarantee"],
  },
  {
    id: "mch_04",
    name: "Kubota Multi-Crop Combine Harvester",
    category: "Harvester",
    providerName: "Sri Rama Agri Services",
    distanceKm: 14.0,
    rate: 2200,
    rateUnit: "per hour",
    availability: "Book 2 Days Ahead",
    phone: "+91 94490 33400",
    rating: 4.7,
    reviewsCount: 76,
    imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=80",
    subsidyEligible: true,
    subsidyPercent: 30,
    description: "High-speed grain & paddy combine harvester with automatic threshing, de-chaffing, and grain bagging.",
    features: ["Paddy, Ragi & Maize Ready", "99% Grain Recovery", "Low Ground Compaction"],
  },
  {
    id: "mch_05",
    name: "Refrigerated Farm-to-Mandi Mini Truck (Bolero)",
    category: "Transport",
    providerName: "Kolar Fast Agri Logistics",
    distanceKm: 3.5,
    rate: 140,
    rateUnit: "per quintal",
    availability: "Daily Evening Trips to Bangalore",
    phone: "+91 98455 77112",
    rating: 4.85,
    reviewsCount: 220,
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80",
    subsidyEligible: false,
    subsidyPercent: 0,
    description: "Direct farmgate pickup with real-time GPS tracking to Bangalore Yeshwantpur & Kolar APMC mandis.",
    features: ["Farmgate Loading", "APMC Gate Pass Handover", "Live GPS Link via SMS"],
  },
  {
    id: "mch_06",
    name: "John Deere 4WD Heavy Tillage Tractor (55 HP)",
    category: "Tractor",
    providerName: "Shakti Custom Hiring Centre",
    distanceKm: 5.1,
    rate: 950,
    rateUnit: "per hour",
    availability: "Available Today",
    phone: "+91 98451 90211",
    rating: 4.88,
    reviewsCount: 114,
    imageUrl: "/images/tractor_rental.jpg",
    subsidyEligible: true,
    subsidyPercent: 40,
    description: "High-power 4-wheel drive tractor with reversible MB Plough and laser land leveler for precision gradient grading.",
    features: ["4-Wheel Drive", "Laser Leveling Unit", "Fuel & Operator Included"],
  },
  {
    id: "mch_07",
    name: "Laser Land Leveler Unit + Transmitter Mast",
    category: "Attachment",
    providerName: "Kolar Precision Agriculture FPO",
    distanceKm: 7.2,
    rate: 600,
    rateUnit: "per hour",
    availability: "Slots Available Tomorrow",
    phone: "+91 94481 22340",
    rating: 4.92,
    reviewsCount: 65,
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=80",
    subsidyEligible: true,
    subsidyPercent: 50,
    description: "Precision laser guidance grade control system saving up to 35% irrigation water and improving crop emergence uniformity.",
    features: ["±2mm Grade Accuracy", "35% Water Savings", "Certified Laser Tech"],
  },
  {
    id: "mch_08",
    name: "Solar Powered Portable Water Pump (7.5 HP)",
    category: "Attachment",
    providerName: "Kolar Green Energy Raitha Sangha",
    distanceKm: 4.8,
    rate: 300,
    rateUnit: "per day",
    availability: "Ready for Dispatch",
    phone: "+91 97410 88921",
    rating: 4.8,
    reviewsCount: 52,
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=80",
    subsidyEligible: true,
    subsidyPercent: 60,
    description: "Portable solar PV array with submersible pump for off-grid drip irrigation and farm tank filling.",
    features: ["Zero Fuel Cost", "Automatic Float Switch", "Includes 100m Delivery Pipe"],
  },
];

interface BookingRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  date: string;
  timeSlot: string;
  quantity: string;
  totalAmount: number;
  paidAmount: number;
  subsidyDiscount: number;
  paymentMethod: "UPI" | "KCC" | "DBT" | "NetBanking" | "PostHarvest" | "COD";
  paymentStatus: "Paid" | "Authorized" | "PostHarvest" | "Pending";
  bookingStatus: "Confirmed" | "En Route" | "In Progress" | "Completed";
  otpCode: string;
  driverPhone: string;
  bookedAt: string;
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "KM-MCH-8842",
    serviceId: "mch_02",
    serviceName: "Garuda Agri-Pro Hexacopter Spraying Drone",
    category: "Drone",
    date: "2026-09-12",
    timeSlot: "Morning (07:00 AM)",
    quantity: "2.5 Acres (Sri Lakshmi Farm)",
    totalAmount: 1125,
    paidAmount: 675,
    subsidyDiscount: 450,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    bookingStatus: "En Route",
    otpCode: "8492",
    driverPhone: "+91 98860 11920",
    bookedAt: "Today, 06:15 AM",
  },
  {
    id: "KM-MCH-7719",
    serviceId: "mch_01",
    serviceName: "Mahindra 575 DI (50 HP Tractor + Rotavator)",
    category: "Tractor",
    date: "2026-09-10",
    timeSlot: "Afternoon (02:00 PM)",
    quantity: "3 Hours",
    totalAmount: 2550,
    paidAmount: 1530,
    subsidyDiscount: 1020,
    paymentMethod: "DBT",
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    otpCode: "3104",
    driverPhone: "+91 94480 88210",
    bookedAt: "Sep 10, 2026",
  },
];

export default function MachineryRentalPage() {
  const { showToast, activeFarm } = useApp();

  const [activeTab, setActiveTab] = useState<"fleet" | "my-bookings" | "invoices">("fleet");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Machine List & Bookings
  const [fleetList, setFleetList] = useState<MachineryService[]>(MACHINERY_FLEET);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Booking Modal State
  const [selectedMachine, setSelectedMachine] = useState<MachineryService | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("2026-09-12");
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>("Morning (07:00 AM - 11:00 AM)");
  const [bookingUnits, setBookingUnits] = useState<number>(3);
  const [includeDriver, setIncludeDriver] = useState<boolean>(true);
  const [targetPlot, setTargetPlot] = useState<string>("Sri Lakshmi Farm - Plot 1 (2.5 Acres)");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "kcc" | "dbt" | "netbanking" | "postharvest" | "cod">("upi");
  const [upiVpa, setUpiVpa] = useState<string>("9845012345@paytm");
  const [kccCardNumber, setKccCardNumber] = useState<string>("6081 4452 9901 6721");
  const [kccExpiry, setKccExpiry] = useState<string>("08/28");
  const [kccCvv, setKccCvv] = useState<string>("419");
  const [selectedBank, setSelectedBank] = useState<string>("State Bank of India (SBI)");

  // OTP Verification Modal
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>("8942");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Success Confirmation & Invoice Modal
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // List Your Machine Modal
  const [showAddMachineModal, setShowAddMachineModal] = useState<boolean>(false);
  const [newMachineName, setNewMachineName] = useState<string>("");
  const [newMachineCategory, setNewMachineCategory] = useState<"Tractor" | "Drone" | "Harvester" | "ColdStorage" | "Transport" | "Attachment">("Tractor");
  const [newMachineRate, setNewMachineRate] = useState<number>(800);
  const [newMachineRateUnit, setNewMachineRateUnit] = useState<string>("per hour");
  const [newMachinePhone, setNewMachinePhone] = useState<string>("+91 98450 12345");

  // Filtering
  const filteredFleet = useMemo(() => {
    return fleetList.filter((m) => {
      const matchCategory =
        selectedCategory === "All" || m.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [fleetList, selectedCategory, searchQuery]);

  // Pricing Calculation
  const currentPricing = useMemo(() => {
    if (!selectedMachine) return { base: 0, driver: 0, subsidy: 0, total: 0, subtotal: 0 };
    const base = selectedMachine.rate * bookingUnits;
    const driver = includeDriver && selectedMachine.category === "Tractor" ? 350 : 0;
    const subtotal = base + driver;
    const subsidy = selectedMachine.subsidyEligible
      ? Math.round((subtotal * selectedMachine.subsidyPercent) / 100)
      : 0;
    const total = subtotal - subsidy;
    return { base, driver, subsidy, total, subtotal };
  }, [selectedMachine, bookingUnits, includeDriver]);

  // Handle Payment Initiation
  const handleProceedToPay = () => {
    if (!selectedMachine) return;

    if (paymentMethod === "kcc" || paymentMethod === "netbanking") {
      setShowOtpModal(true);
    } else {
      executeBookingSuccess();
    }
  };

  // Complete Booking Execution
  const executeBookingSuccess = () => {
    if (!selectedMachine) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowOtpModal(false);

      const newRecord: BookingRecord = {
        id: `KM-MCH-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: selectedMachine.id,
        serviceName: selectedMachine.name,
        category: selectedMachine.category,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        quantity: `${bookingUnits} ${selectedMachine.rateUnit} (${targetPlot.split(" - ")[1] || "Field"})`,
        totalAmount: currentPricing.subtotal,
        paidAmount: paymentMethod === "postharvest" || paymentMethod === "cod" ? 0 : currentPricing.total,
        subsidyDiscount: currentPricing.subsidy,
        paymentMethod: paymentMethod === "postharvest" ? "PostHarvest" : paymentMethod.toUpperCase() as any,
        paymentStatus: paymentMethod === "postharvest" ? "PostHarvest" : paymentMethod === "cod" ? "Pending" : "Paid",
        bookingStatus: "Confirmed",
        otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        driverPhone: selectedMachine.phone,
        bookedAt: "Just now",
      };

      setBookings([newRecord, ...bookings]);
      setConfirmedBooking(newRecord);
      setSelectedMachine(null);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}

      showToast(
        "Machinery Booking Confirmed! 🚜",
        `Booking ${newRecord.id} reserved. Operator ${selectedMachine.providerName} notified.`,
        "success"
      );
    }, 800);
  };

  // Add New Machine
  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineName.trim()) return;

    const newMch: MachineryService = {
      id: `mch_${Date.now()}`,
      name: newMachineName,
      category: newMachineCategory,
      providerName: "Self-Listed (Kolar Farmer)",
      distanceKm: 1.5,
      rate: Number(newMachineRate),
      rateUnit: newMachineRateUnit,
      availability: "Available from Tomorrow",
      phone: newMachinePhone,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: "/images/tractor_rental.jpg",
      subsidyEligible: true,
      subsidyPercent: 40,
      description: "Farmer-owned verified machinery available for shared custom hiring in local panchayat.",
      features: ["Panchayat Verified", "Includes Local Operator", "On-Time Dispatch"],
    };

    setFleetList([newMch, ...fleetList]);
    setShowAddMachineModal(false);
    setNewMachineName("");

    showToast("Machinery Listed Successfully! 🎉", `${newMch.name} is now available for booking by neighboring farmers.`, "success");
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Top Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-black/80 to-teal-950/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <Tractor className="w-3.5 h-3.5 text-emerald-300" />
                <span>Custom Hiring Centre (CHC) & Drone Fleet</span>
                <span className="text-emerald-400">•</span>
                <span className="text-amber-300">SMAM 40-50% Subsidy</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-title tracking-tight text-white drop-shadow-md">
                Farm Machinery & Drone Rental Hub
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
                On-demand tractors, high-capacity spraying drones, combine harvesters, solar cold storage, and farm logistics with direct UPI QR, Kisan Credit Card (KCC), and PM-KISAN DBT payment integration.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => setShowAddMachineModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer transform hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Machine</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-neutral-400 block">Verified Equipment</span>
              <span className="text-lg font-black text-emerald-300">28+ Units Active</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-neutral-400 block">Avg Response Time</span>
              <span className="text-lg font-black text-amber-300">&lt; 45 Mins</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-neutral-400 block">Govt Direct Subsidy</span>
              <span className="text-lg font-black text-teal-300">Up to 50% Off</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-neutral-400 block">Payment Modes</span>
              <span className="text-lg font-black text-white">UPI • KCC • DBT</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 w-fit">
            <button
              onClick={() => setActiveTab("fleet")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "fleet"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Available Fleet ({fleetList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("my-bookings")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === "my-bookings"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Bookings</span>
              {bookings.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "invoices"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Invoices & Receipts</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tractors, drones, harvesters..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* TAB 1: FLEET CATALOG */}
        {activeTab === "fleet" && (
          <div className="space-y-6">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Tractor", "Drone", "Harvester", "ColdStorage", "Transport", "Attachment"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 font-bold"
                      : "bg-black/40 border border-white/15 text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat === "All" && "🚜 All Machinery"}
                  {cat === "Tractor" && "🚜 Tractors & Tillers"}
                  {cat === "Drone" && "🛸 Spraying Drones"}
                  {cat === "Harvester" && "🌾 Combine Harvesters"}
                  {cat === "ColdStorage" && "❄️ Cold Storage"}
                  {cat === "Transport" && "🚚 Agri Logistics"}
                  {cat === "Attachment" && "⚙️ Levelers & Pumps"}
                </button>
              ))}
            </div>

            {/* Machinery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFleet.map((machine) => (
                <div
                  key={machine.id}
                  className="rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 overflow-hidden flex flex-col justify-between hover:border-emerald-400/60 transition-all duration-300 shadow-xl group hover:shadow-emerald-500/10"
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={machine.imageUrl}
                        alt={machine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-md">
                        {machine.category === "Tractor" && <Tractor className="w-3.5 h-3.5 text-emerald-400" />}
                        {machine.category === "Drone" && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                        {machine.category === "Harvester" && <Wheat className="w-3.5 h-3.5 text-amber-400" />}
                        {machine.category === "ColdStorage" && <Box className="w-3.5 h-3.5 text-blue-400" />}
                        {machine.category === "Transport" && <Truck className="w-3.5 h-3.5 text-emerald-400" />}
                        {machine.category === "Attachment" && <Zap className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{machine.category}</span>
                      </span>

                      {/* Subsidy Badge */}
                      {machine.subsidyEligible && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[11px] font-black tracking-wide border border-emerald-400/50 backdrop-blur-md shadow-md">
                          {machine.subsidyPercent}% SMAM Subsidy
                        </span>
                      )}

                      {/* Rating & Distance */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{machine.rating}</span>
                          <span className="text-neutral-400">({machine.reviewsCount})</span>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-neutral-200">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{machine.distanceKm} km away</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {machine.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{machine.providerName}</span>
                        </p>
                      </div>

                      <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                        {machine.description}
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {machine.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-300"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Footer & CTAs */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                          Rental Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-emerald-300">
                            ₹{machine.rate.toLocaleString()}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">/{machine.rateUnit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                          Status
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {machine.availability}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${machine.phone}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast("Calling Machine Operator", `Dialing ${machine.phone}...`, "info");
                        }}
                        className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Operator</span>
                      </a>

                      <button
                        onClick={() => {
                          setSelectedMachine(machine);
                        }}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-[1.02]"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Book & Pay</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "my-bookings" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Showing <strong>{bookings.length} active and completed equipment bookings</strong></span>
              </div>
              <span className="text-neutral-400">Auto-synced with APMC and Custom Hiring Centres</span>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 hover:border-emerald-400/40 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {b.id}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        b.bookingStatus === "En Route"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                          : b.bookingStatus === "Confirmed"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {b.bookingStatus}
                      </span>
                      <span className="text-xs text-neutral-400">Booked: {b.bookedAt}</span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">{b.serviceName}</h4>
                      <div className="flex items-center gap-4 text-xs text-neutral-300 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{b.date} • {b.timeSlot}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{b.quantity}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-200">
                        Payment: <strong>{b.paymentMethod}</strong> ({b.paymentStatus})
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300 font-bold">
                        Paid: ₹{b.paidAmount.toLocaleString()}
                      </span>
                      {b.subsidyDiscount > 0 && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                          Govt Subsidy: ₹{b.subsidyDiscount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-row md:flex-col items-end gap-2.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Driver OTP</span>
                      <span className="font-mono text-sm font-black text-amber-300 tracking-widest">{b.otpCode}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${b.driverPhone}`}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Driver</span>
                      </a>

                      <button
                        onClick={() => {
                          setConfirmedBooking(b);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES & TAX RECEIPTS */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">GST & Agricultural Tax Invoices</h3>
                  <p className="text-xs text-neutral-300">
                    Official tax receipts with GSTIN, PM-KISAN subsidy deduction, and digital authentication.
                  </p>
                </div>
                <button
                  onClick={() => showToast("Exporting Statement", "Downloading combined GST statements for FY 2026-27...", "success")}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Statement</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-neutral-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">Invoice ID</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Gross Total</th>
                      <th className="p-3">Govt Subsidy</th>
                      <th className="p-3">Net Paid</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-neutral-200">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-emerald-400">{b.id}</td>
                        <td className="p-3 font-bold text-white">{b.serviceName}</td>
                        <td className="p-3 text-neutral-300">{b.date}</td>
                        <td className="p-3 text-neutral-300">₹{b.totalAmount.toLocaleString()}</td>
                        <td className="p-3 text-emerald-400 font-bold">-₹{b.subsidyDiscount.toLocaleString()}</td>
                        <td className="p-3 font-black text-white">₹{b.paidAmount.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-300">
                            {b.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setConfirmedBooking(b)}
                            className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* COMPLETE BOOKING & PAYMENT MODAL */}
      {/* ============================================================ */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900 via-black to-neutral-950 border border-emerald-500/40 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] text-white overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    Book & Pay: {selectedMachine.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Provider: {selectedMachine.providerName} • {selectedMachine.distanceKm} km
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMachine(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Step 1: Booking Details Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>1. Schedule & Farm Location</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">Target Farm Plot</label>
                    <select
                      value={targetPlot}
                      onChange={(e) => setTargetPlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Sri Lakshmi Farm - Plot 1 (2.5 Acres)">Sri Lakshmi Farm - Plot 1 (2.5 Acres)</option>
                      <option value="Narasapura East - Plot 2 (1.8 Acres)">Narasapura East - Plot 2 (1.8 Acres)</option>
                      <option value="Green Valley - Plot 3 (3.2 Acres)">Green Valley - Plot 3 (3.2 Acres)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">Booking Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">Time Slot</label>
                    <select
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Morning (07:00 AM - 11:00 AM)">Morning (07:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (02:00 PM - 06:00 PM)">Afternoon (02:00 PM - 06:00 PM)</option>
                      <option value="Full Day (07:00 AM - 05:00 PM)">Full Day (07:00 AM - 05:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-300 font-bold block mb-1">
                      Required Duration / Work Area ({selectedMachine.rateUnit})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={bookingUnits}
                        onChange={(e) => setBookingUnits(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-neutral-400 shrink-0 font-medium">{selectedMachine.rateUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Operator Toggle */}
                {selectedMachine.category === "Tractor" && (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white block">Certified Tractor Driver & Fuel</span>
                        <span className="text-neutral-400">Includes CHC licensed operator (+₹350/shift)</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDriver}
                        onChange={(e) => setIncludeDriver(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                )}
              </div>

              {/* Step 2: Live Price & Subsidy Breakdown */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Base Equipment Rental ({bookingUnits} × ₹{selectedMachine.rate})</span>
                  <span>₹{currentPricing.base.toLocaleString()}</span>
                </div>

                {currentPricing.driver > 0 && (
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Operator Allowance & Fuel</span>
                    <span>₹{currentPricing.driver.toLocaleString()}</span>
                  </div>
                )}

                {currentPricing.subsidy > 0 && (
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>SMAM Govt Direct Benefit Subsidy ({selectedMachine.subsidyPercent}%)</span>
                    <span>-₹{currentPricing.subsidy.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between text-sm font-black text-white">
                  <span>Total Payable Amount</span>
                  <span className="text-xl text-emerald-300">₹{currentPricing.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Step 3: Multi-Method Payment Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Choose Payment Method</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "upi"
                        ? "bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <span className="font-bold text-white block">UPI Instant Pay</span>
                      <span className="text-[10px] text-neutral-400">GPay, PhonePe, QR</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("kcc")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "kcc"
                        ? "bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-400 mb-2" />
                    <div>
                      <span className="font-bold text-white block">Kisan Credit Card</span>
                      <span className="text-[10px] text-amber-300">4% GoI Subvention</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("dbt")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "dbt"
                        ? "bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-cyan-400 mb-2" />
                    <div>
                      <span className="font-bold text-white block">PM-KISAN DBT</span>
                      <span className="text-[10px] text-neutral-400">Aadhaar Linked Bank</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("postharvest")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "postharvest"
                        ? "bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Wheat className="w-5 h-5 text-amber-400 mb-2" />
                    <div>
                      <span className="font-bold text-white block">Mandi Pay</span>
                      <span className="text-[10px] text-neutral-400">0% Advance Pay</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                      paymentMethod === "cod"
                        ? "bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <DollarSign className="w-5 h-5 text-emerald-300 mb-2" />
                    <div>
                      <span className="font-bold text-white block">Pay on Delivery</span>
                      <span className="text-[10px] text-neutral-400">Cash to Operator</span>
                    </div>
                  </button>
                </div>

                {/* Sub-Payment Dynamic Details */}
                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Dynamic QR Code Box */}
                      <div className="w-28 h-28 bg-black/80 border border-emerald-400/40 p-2 rounded-2xl shrink-0 shadow-lg flex flex-col items-center justify-center">
                        <div className="w-full h-full border-2 border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center text-emerald-400 text-center p-1">
                          <QrCode className="w-12 h-12 text-emerald-400" />
                          <span className="text-[8px] font-black uppercase text-emerald-300">₹{currentPricing.total}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-neutral-300 flex-1">
                        <span className="font-bold text-white block">Scan & Pay via any UPI App</span>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          Scan QR with PhonePe, Google Pay, Paytm, or BHIM. Payment is automatically detected within 3 seconds.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded border border-white/10 text-emerald-300">
                            krishimitra.kolar@sbi
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("krishimitra.kolar@sbi");
                              showToast("UPI ID Copied", "krishimitra.kolar@sbi copied to clipboard", "info");
                            }}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "kcc" && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">NABARD RuPay Kisan Credit Card</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        4% Subvention Interest
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-neutral-400 block mb-1 text-[11px]">KCC 16-Digit Card Number</label>
                        <input
                          type="text"
                          value={kccCardNumber}
                          onChange={(e) => setKccCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 font-mono text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-neutral-400 block mb-1 text-[11px]">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            value={kccExpiry}
                            onChange={(e) => setKccExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 font-mono text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-neutral-400 block mb-1 text-[11px]">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={kccCvv}
                            onChange={(e) => setKccCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 font-mono text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "dbt" && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Aadhaar-Linked PM-KISAN Bank Account</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        DBT Verified
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-neutral-300">
                      <div>
                        <span className="font-bold text-white block">State Bank of India (Kolar Main Branch)</span>
                        <span className="text-[11px] text-neutral-400">A/C: ••••••••• 6721 • IFSC: SBIN0000840</span>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                )}

                {paymentMethod === "postharvest" && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">APMC Mandi Post-Harvest Settlement</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        0% Upfront
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Rental fee of ₹{currentPricing.total.toLocaleString()} will be debited automatically from your APMC e-NAM sales proceeds upon tomato/crop dispatch next week.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-white/5 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">Total Net Pay</span>
                <span className="text-xl font-black text-emerald-300">₹{currentPricing.total.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMachine(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPay}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Authorize Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* OTP VERIFICATION MODAL FOR KCC & NETBANKING */}
      {/* ============================================================ */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-emerald-500/40 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Bank SMS OTP Verification</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Enter the 4-digit security code sent to farmer registered mobile <strong>+91 98450 •••45</strong> for authorizing ₹{currentPricing.total.toLocaleString()}.
            </p>

            <div>
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full py-3 text-center tracking-[1em] font-mono text-2xl font-black bg-black/80 border border-emerald-400/60 rounded-2xl text-emerald-300 focus:outline-none"
              />
              <span className="text-[10px] text-neutral-400 block text-center mt-1.5">
                Simulated Sandbox OTP: <strong>8942</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeBookingSuccess}
                disabled={isProcessingPayment}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-colors cursor-pointer"
              >
                {isProcessingPayment ? "Verifying..." : "Verify & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* INSTANT TAX INVOICE & CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/50 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
            
            <div className="p-6 text-center space-y-3 bg-gradient-to-b from-emerald-950/60 to-transparent">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-white">Booking Confirmed! 🚜</h3>
              <p className="text-xs text-neutral-300">
                Booking ID: <strong className="font-mono text-emerald-400">{confirmedBooking.id}</strong>
              </p>
            </div>

            {/* Official Tax Invoice Body */}
            <div className="p-6 pt-0 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white">Service</span>
                  <span className="text-neutral-200 text-right font-semibold">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Schedule</span>
                  <span>{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Quantity / Area</span>
                  <span>{confirmedBooking.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Payment Mode</span>
                  <span className="font-mono font-bold text-emerald-300">{confirmedBooking.paymentMethod} ({confirmedBooking.paymentStatus})</span>
                </div>
                {confirmedBooking.subsidyDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>Govt SMAM Subsidy</span>
                    <span>-₹{confirmedBooking.subsidyDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 font-black text-white text-sm">
                  <span>Net Amount Paid</span>
                  <span className="text-emerald-300">₹{confirmedBooking.paidAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Operator & Driver Contact Box */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase font-bold">Driver Verification OTP</span>
                  <span className="font-mono text-lg font-black text-amber-300 tracking-widest">{confirmedBooking.otpCode}</span>
                </div>
                <a
                  href={`tel:${confirmedBooking.driverPhone}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Operator</span>
                </a>
              </div>

              {/* Invoice Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast("Tax Invoice Downloaded", `Receipt for ${confirmedBooking.id} saved as PDF.`, "success");
                  }}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setActiveTab("my-bookings");
                  }}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>Track in My Bookings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LIST YOUR MACHINE MODAL */}
      {/* ============================================================ */}
      {showAddMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">List Your Farm Machine</h3>
              </div>
              <button
                onClick={() => setShowAddMachineModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Equipment Name & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swaraj 744 FE (48 HP) + 7-Tyne Cultivator"
                  value={newMachineName}
                  onChange={(e) => setNewMachineName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Category</label>
                  <select
                    value={newMachineCategory}
                    onChange={(e) => setNewMachineCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Tractor">Tractor & Tiller</option>
                    <option value="Drone">Spraying Drone</option>
                    <option value="Harvester">Combine Harvester</option>
                    <option value="ColdStorage">Cold Storage</option>
                    <option value="Transport">Agri Transport</option>
                    <option value="Attachment">Attachment / Leveler</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Rental Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMachineRate}
                    onChange={(e) => setNewMachineRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Pricing Unit</label>
                  <select
                    value={newMachineRateUnit}
                    onChange={(e) => setNewMachineRateUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="per hour">per hour</option>
                    <option value="per acre">per acre</option>
                    <option value="per day">per day</option>
                    <option value="per quintal">per quintal</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Operator Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newMachinePhone}
                    onChange={(e) => setNewMachinePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMachineModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transition-colors cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
