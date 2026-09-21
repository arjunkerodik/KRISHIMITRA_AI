import React from "react";
import Link from "next/link";
import { Sprout, PhoneCall, ShieldCheck, HeartHandshake, FileText, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/75 backdrop-blur-xl text-neutral-200 border-t border-white/15 text-sm shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & National Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                KrishiMitra <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Smart Agriculture & Farmer Decision Support Platform engineered for Smart India Hackathon (SIH). Converting soil, weather, satellite NDVI, and APMC mandi market data into personalized, daily actionable decisions for every Indian farmer.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-brand-400">
                ICAR Guidelines Compliant
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-sky-400">
                PM-KISAN / PMFBY Integrated
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-amber-400">
                Agmarknet Live Sync
              </span>
            </div>
          </div>

          {/* Col 2: Decision Tools */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              AI Decision Tools
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/crops/recommendation" className="hover:text-brand-400 transition-colors">Crop Suitability AI</Link></li>
              <li><Link href="/disease/analyze" className="hover:text-brand-400 transition-colors">Leaf Disease Diagnostic</Link></li>
              <li><Link href="/irrigation" className="hover:text-brand-400 transition-colors">Smart Irrigation Planner</Link></li>
              <li><Link href="/market/recommendation" className="hover:text-brand-400 transition-colors">Where Should I Sell?</Link></li>
              <li><Link href="/satellite" className="hover:text-brand-400 transition-colors">Satellite & Drone NDVI</Link></li>
              <li><Link href="/assistant" className="hover:text-brand-400 transition-colors">Ask KrishiMitra Copilot</Link></li>
            </ul>
          </div>

          {/* Col 3: Govt & Finance */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Schemes & Finance
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/schemes" className="hover:text-brand-400 transition-colors">Find My Schemes</Link></li>
              <li><Link href="/insurance" className="hover:text-brand-400 transition-colors">PMFBY Insurance Assistant</Link></li>
              <li><Link href="/finance" className="hover:text-brand-400 transition-colors">Digital Farm Ledger</Link></li>
              <li><Link href="/carbon-water" className="hover:text-brand-400 transition-colors">Carbon & Water Credits</Link></li>
              <li><Link href="/marketplace" className="hover:text-brand-400 transition-colors">Direct Produce Market</Link></li>
              <li><Link href="/machinery" className="hover:text-brand-400 transition-colors">Machinery Rentals</Link></li>
            </ul>
          </div>

          {/* Col 4: Farmer Helplines & Support */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Farmer Emergency Helplines
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-800/80 border border-neutral-700">
                <div className="flex items-center gap-1.5 text-brand-400 font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Kisan Call Centre</span>
                </div>
                <p className="text-white font-mono text-sm mt-0.5">1800-180-1551</p>
                <p className="text-[10px] text-neutral-400">Toll-Free • 6 AM to 10 PM • All Indian Languages</p>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700">
                <div className="text-[11px] text-neutral-300 font-medium">PMFBY Toll Free</div>
                <p className="text-white font-mono text-xs">1800-200-5142</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 KrishiMitra AI. Built for Smart India Hackathon & Indian Agriculture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link href="/settings" className="hover:text-neutral-300">Terms of Service</Link>
            <Link href="/settings" className="hover:text-neutral-300">Data Portability</Link>
            <span className="flex items-center gap-1 text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SIH Ready
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
