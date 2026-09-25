"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { useApp } from "@/lib/store";
import { FarmerOrder } from "@/lib/services/marketplaceService";
import { WhatsAppBotSimulator } from "@/components/WhatsAppBotSimulator";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  ChevronRight,
  X,
  ExternalLink,
  Coins,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function OrdersPage() {
  const { orders, cancelOrder, showToast } = useApp();
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<FarmerOrder | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("Changed procurement plan / Already arranged input");

  const getStatusBadge = (status: FarmerOrder["status"]) => {
    switch (status) {
      case "PLACED":
        return {
          bg: "bg-sky-500/20 border-sky-400/35 text-sky-300",
          icon: Clock,
          label: "Order Request Placed",
        };
      case "CONFIRMED":
        return {
          bg: "bg-emerald-500/20 border-emerald-400/35 text-emerald-300",
          icon: CheckCircle2,
          label: "Confirmed by Provider",
        };
      case "PROCESSING":
        return {
          bg: "bg-amber-500/20 border-amber-400/35 text-amber-300",
          icon: Package,
          label: "Packaging & Verification",
        };
      case "DISPATCHED":
        return {
          bg: "bg-purple-500/20 border-purple-400/35 text-purple-300",
          icon: Truck,
          label: "In Transit to Farm",
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/25 border-emerald-400/50 text-emerald-200 font-bold",
          icon: CheckCircle2,
          label: "Delivered & Fulfilled",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-500/20 border-rose-400/35 text-rose-300",
          icon: XCircle,
          label: "Cancelled",
        };
    }
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;

    const success = cancelOrder(selectedOrderForCancel.id, cancelReason);
    if (success) {
      showToast(
        "Order Cancelled",
        `Order ${selectedOrderForCancel.id} was successfully cancelled. Associated pending reward points have been adjusted.`,
        "info"
      );
      setSelectedOrderForCancel(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Procurement & Delivery Ledger
              </span>
              <span className="text-xs text-white/70">
                Direct FPO Invoicing
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 flex items-center gap-2.5">
              <Package className="w-7 h-7 text-emerald-400" />
              <span>Farmer Orders & Delivery Tracking</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">
              Track the full lifecycle of your agricultural seed, fertilizer, machinery, and transport orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg border border-emerald-400/40"
            >
              + Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/15 p-12 text-center text-white space-y-3">
              <ShoppingBag className="w-10 h-10 text-white/30 mx-auto" />
              <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-white/60 max-w-md mx-auto">
                Explore the Farmer Marketplace to procure verified seeds, bio-fertilizers, or book machinery.
              </p>
              <Link
                href="/marketplace"
                className="inline-block px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
              >
                Go to Marketplace
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const statusCfg = getStatusBadge(order.status);
              const StatusIcon = statusCfg.icon;
              const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";

              return (
                <div
                  key={order.id}
                  className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-5 text-white"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {order.id}
                        </span>
                        <span className="text-xs text-white/50">• {order.orderDate}</span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Payment: <strong className="text-white">{order.paymentMethod}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusCfg.bg}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusCfg.label}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
                        +{order.creditsEarned} 🪙
                      </span>
                    </div>
                  </div>

                  {/* Multi-step Status Stepper Tracker */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { key: "PLACED", label: "1. Order Placed" },
                        { key: "CONFIRMED", label: "2. Confirmed" },
                        { key: "DISPATCHED", label: "3. Dispatched" },
                        { key: "COMPLETED", label: "4. Delivered" },
                      ].map((step, idx) => {
                        const states = ["PLACED", "CONFIRMED", "DISPATCHED", "COMPLETED"];
                        const currentIdx = states.indexOf(order.status === "PROCESSING" ? "CONFIRMED" : order.status);
                        const isDone = currentIdx >= idx && order.status !== "CANCELLED";
                        const isCurrent = currentIdx === idx && order.status !== "CANCELLED";

                        return (
                          <div key={step.key} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isDone
                                  ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                                  : isCurrent
                                  ? "bg-amber-400 animate-pulse"
                                  : "bg-white/15"
                              }`}
                            />
                            <span
                              className={`text-[10px] font-semibold block truncate ${
                                isDone ? "text-emerald-300" : isCurrent ? "text-amber-300 font-bold" : "text-white/40"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="divide-y divide-white/10 space-y-2">
                      {order.items.map((it, i) => (
                        <div key={i} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{it.productName}</span>
                            <span className="text-[11px] text-white/50 block">
                              Provider: {it.providerName} • Qty: {it.quantity} {it.unit}
                            </span>
                          </div>
                          <div className="text-right font-mono font-bold text-white">
                            ₹{(it.price * it.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white/50 text-[11px]">Delivery Destination:</span>
                        <p className="text-white/80 text-[11px] truncate max-w-sm">
                          {order.deliveryAddress}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-white/60 text-[10px] block uppercase font-bold">Total Order Value</span>
                        <span className="text-lg font-bold font-mono text-emerald-400">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-white/60">
                      {order.cancellationReason && (
                        <span className="text-rose-300">
                          Cancellation note: {order.cancellationReason}
                        </span>
                      )}
                      {order.notes && !order.cancellationReason && (
                        <span>Instructions: {order.notes}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          onClick={() => setSelectedOrderForCancel(order)}
                          className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}

                      <a
                        href={`tel:${order.farmerPhone}`}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Support / FPO</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Order-Status Bot */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
              WhatsApp &amp; SMS Bot
            </span>
            <span className="text-xs text-white/60">Track orders on basic phones too</span>
          </div>
          <WhatsAppBotSimulator />
        </div>

      </div>

      {/* Cancel Order Confirmation Modal */}
      {selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/25 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Cancel Order {selectedOrderForCancel.id}</span>
              </h3>
              <button
                onClick={() => setSelectedOrderForCancel(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <p className="text-white/80">
                Are you sure you want to cancel this order request?
              </p>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-medium focus:outline-none focus:border-rose-400"
                >
                  <option value="Changed procurement plan / Already arranged input">Changed procurement plan / Already arranged input</option>
                  <option value="Order placed by mistake">Order placed by mistake</option>
                  <option value="Found better price in nearby mandi">Found better price in nearby mandi</option>
                  <option value="Need different seed/fertilizer quantity">Need different seed/fertilizer quantity</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px]">
                Note: Cancelling the order will safely adjust any provisional KrishiMitra Credits associated with this transaction.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForCancel(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg border border-rose-400/40"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
