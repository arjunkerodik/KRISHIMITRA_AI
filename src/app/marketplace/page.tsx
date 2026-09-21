"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import { SourceBadge } from "@/components/SourceBadge";
import {
  VERIFIED_MARKETPLACE_PRODUCTS,
  MarketplaceProduct,
} from "@/lib/services/marketplaceService";
import {
  ShoppingBag,
  PlusCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Phone,
  MessageSquare,
  X,
  Tag,
  DollarSign,
  Filter,
  Search,
  ShoppingCart,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Info,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function MarketplacePage() {
  const {
    activeFarm,
    showToast,
    marketplaceProducts,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    awardCredits,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<MarketplaceProduct | null>(null);
  const [selectedProviderContact, setSelectedProviderContact] = useState<MarketplaceProduct | null>(null);
  
  // Checkout form modal
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    `Sri Lakshmi Farm, Survey No. 42/1, ${activeFarm.district}, Karnataka`
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "Pay on Delivery / Collection" | "Pay at FPO Counter" | "Direct Merchant UPI"
  >("Pay on Delivery / Collection");
  const [orderNotes, setOrderNotes] = useState<string>("");

  const categories = [
    "All",
    "Seeds",
    "Fertilizers",
    "Organic Inputs",
    "Farm Equipment",
    "Machinery",
    "Irrigation",
    "Crop Protection",
    "Storage & Post-Harvest",
    "Transport & Logistics",
    "Local Agricultural Services",
  ];

  const productsList = marketplaceProducts || VERIFIED_MARKETPLACE_PRODUCTS;

  const filteredProducts = productsList.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.offerPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = placeOrder(paymentMethod, deliveryAddress, orderNotes);
    if (order) {
      setShowCheckoutModal(false);
      setIsCartOpen(false);
      showToast(
        "Order Request Placed Successfully!",
        `Order ID: ${order.id}. ${order.creditsEarned} KrishiMitra Credits awarded to your account!`,
        "success"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Agri Inputs & Services
              </span>
              <span className="text-xs text-white/70">
                FPO & Government Empaneled Providers
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-emerald-400" />
              <span>Farmer Agricultural Marketplace</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Procure certified hybrid seeds, bio-inputs, custom machinery, irrigation systems, and transport from verified FPOs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/offers"
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Offers Hub</span>
            </Link>

            <Link
              href="/orders"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all"
            >
              My Orders
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg border border-emerald-400/40 inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
              {cart.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* 1. CONTROLS: SEARCH & 10 CATEGORIES */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Browse Marketplace Categories</span>
              </h3>
              <p className="text-xs text-white/60">
                Showing authentic input suppliers and service providers in <strong>{activeFarm.district} District</strong>.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search seed varieties, bio-fertilizers, drones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl border border-white/20 bg-black/60 text-white placeholder-white/40 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* 10 Agricultural Categories Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c
                    ? "bg-emerald-600 text-white shadow-md border border-emerald-400/40"
                    : "bg-black/40 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT LISTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const hasOffer = p.offerPrice && p.offerDiscountPercent;

            return (
              <div
                key={p.id}
                className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-5 shadow-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all text-white space-y-4 group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-black/40 border border-white/10 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-300 border border-white/15">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/80 backdrop-blur-md text-white border border-emerald-400/40 flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Provider</span>
                      </span>
                    </div>

                    {hasOffer && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-black shadow-md">
                          {p.offerDiscountPercent}% OFF • Ends {p.offerExpiry}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Provider Info */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-300 font-semibold mb-1">
                    <span className="flex items-center gap-1 truncate">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{p.providerName}</span>
                    </span>
                    <span className="text-[10px] text-white/50 shrink-0 font-mono">
                      Lic: {p.verifiedLicenseNo.slice(0, 10)}...
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                    {p.name}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 mt-1.5 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{p.location}, {p.district}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {hasOffer ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold font-mono text-emerald-400">
                            ₹{p.offerPrice}
                          </span>
                          <span className="text-xs text-white/50 line-through font-mono">
                            ₹{p.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-extrabold font-mono text-white">
                          ₹{p.price}
                        </span>
                      )}
                      <span className="text-[10px] text-white/50 block">
                        {p.unit}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {p.availability}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProviderContact(p)}
                      className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Contact Provider</span>
                    </button>

                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        showToast("Added to Farm Cart", `${p.name} added to your procurement basket.`, "success");
                      }}
                      className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg border border-emerald-400/40 inline-flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedProductDetails(p)}
                    className="w-full text-center text-[11px] text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    View Specifications & Quality Certifications →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="bg-black/95 backdrop-blur-2xl border-l border-white/20 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 text-white">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">Farm Procurement Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="mt-4 max-h-[55vh] overflow-y-auto divide-y divide-white/10 space-y-3 pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-white/50 space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto text-white/30" />
                    <p className="text-xs">Your farm cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const price = item.product.offerPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-emerald-300 font-mono">
                            ₹{price} <span className="text-white/50 text-[10px]">x {item.quantity}</span>
                          </p>
                          <span className="text-[10px] text-white/50 truncate block">
                            Provider: {item.product.providerName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-black/60 rounded-lg border border-white/15 text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 hover:bg-white/10"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-white/10"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/15 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-white">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>Eligible KrishiMitra Credits:</span>
                    <span className="font-mono font-bold">+35 🪙</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1.5">
                    <span>Total Order Value:</span>
                    <span className="font-mono text-emerald-400 text-base">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={clearCart}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setShowCheckoutModal(true);
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg border border-emerald-400/40"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. CHECKOUT MODAL (Safe Order Request / Pay on Collection) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Confirm Farm Order Request</span>
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrderSubmit} className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 font-mono">
                <div className="flex justify-between text-white/70">
                  <span>Order Items:</span>
                  <span className="text-white">{cart.length} Products</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 text-sm">
                  <span>Total Payable:</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-300">
                  <span>Farmer Loyalty Reward:</span>
                  <span>+35 KrishiMitra Credits on delivery</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Delivery / Collection Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-emerald-400"
                >
                  <option value="Pay on Delivery / Collection">Pay on Delivery / Collection at Farm Gate</option>
                  <option value="Pay at FPO Counter">Pay at FPO Counter on Pickup</option>
                  <option value="Direct Merchant UPI">Direct Merchant Official UPI</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Special Delivery Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before dispatch; leave at gate with Muniyappa"
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Safe Order Protocol: No bank credentials stored. Order is directly confirmed with the verified FPO provider.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg border border-emerald-400/40"
                >
                  Place Order Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PROVIDER CONTACT MODAL (CALL, WHATSAPP, DIRECTIONS, WEBSITE) */}
      {selectedProviderContact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Verified Provider Directory
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  {selectedProviderContact.providerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProviderContact(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div>
                  <span className="text-white/50 block text-[10px]">Address & Location</span>
                  <span className="font-semibold text-white">{selectedProviderContact.address}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px]">Working Hours</span>
                  <span className="font-medium text-emerald-300">{selectedProviderContact.workingHours}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px]">Official License / Registry No</span>
                  <span className="font-mono text-white/80">{selectedProviderContact.verifiedLicenseNo}</span>
                </div>
              </div>

              {/* Action Buttons: Call, Directions, WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${selectedProviderContact.contactPhone}`}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md border border-emerald-400/40"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Provider</span>
                </a>

                <a
                  href={`https://wa.me/${selectedProviderContact.contactPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedProviderContact.providerName)},%20I%20am%20inquiring%20about%20${encodeURIComponent(selectedProviderContact.name)}%20via%20KrishiMitra%20AI.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-500/40"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedProviderContact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/15"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Directions</span>
                </a>

                <button
                  onClick={() => {
                    addToCart(selectedProviderContact, 1);
                    setSelectedProviderContact(null);
                    showToast("Added to Farm Cart", `${selectedProviderContact.name} added to cart.`, "success");
                  }}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/15"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Order in App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PRODUCT DETAILS MODAL */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  {selectedProductDetails.category}
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  {selectedProductDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-white/80 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/10">
                {selectedProductDetails.description}
              </p>

              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Technical Specifications & Standards</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedProductDetails.specifications.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProductDetails.offerTerms && (
                <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                  <span className="font-bold block">Offer Terms:</span>
                  {selectedProductDetails.offerTerms.map((t, idx) => (
                    <p key={idx} className="text-[11px]">• {t}</p>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProductDetails, 1);
                    setSelectedProductDetails(null);
                    showToast("Added to Farm Cart", `${selectedProductDetails.name} added to cart.`, "success");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg border border-emerald-400/40"
                >
                  Add to Cart (₹{selectedProductDetails.offerPrice || selectedProductDetails.price})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
