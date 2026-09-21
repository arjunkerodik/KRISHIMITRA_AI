/**
 * KrishiMitra Shared Farm In-Memory & Cache Store
 * Guarantees cross-route singleton state persistence across all Next.js API route bundles.
 */

// Use globalThis to survive Next.js module reloading in development
const globalStore = globalThis as unknown as {
  __KRISHI_FARMS__?: any[];
  __KRISHI_LOCATIONS__?: Record<string, any>;
  __KRISHI_BOUNDARIES__?: Record<string, any>;
  __KRISHI_SOIL__?: Record<string, any[]>;
  __KRISHI_WATER__?: Record<string, any>;
  __KRISHI_CROPS__?: Record<string, any[]>;
  __KRISHI_ACTIVITIES__?: Record<string, any[]>;
  __KRISHI_EXPENSES__?: Record<string, any[]>;
  __KRISHI_SALES__?: Record<string, any[]>;
  __KRISHI_PESTS__?: Record<string, any[]>;
  __KRISHI_STAGE_HISTORY__?: Record<string, any[]>;
};

if (!globalStore.__KRISHI_FARMS__) globalStore.__KRISHI_FARMS__ = [];
if (!globalStore.__KRISHI_LOCATIONS__) globalStore.__KRISHI_LOCATIONS__ = {};
if (!globalStore.__KRISHI_BOUNDARIES__) globalStore.__KRISHI_BOUNDARIES__ = {};
if (!globalStore.__KRISHI_SOIL__) globalStore.__KRISHI_SOIL__ = {};
if (!globalStore.__KRISHI_WATER__) globalStore.__KRISHI_WATER__ = {};
if (!globalStore.__KRISHI_CROPS__) globalStore.__KRISHI_CROPS__ = {};
if (!globalStore.__KRISHI_ACTIVITIES__) globalStore.__KRISHI_ACTIVITIES__ = {};
if (!globalStore.__KRISHI_EXPENSES__) globalStore.__KRISHI_EXPENSES__ = {};
if (!globalStore.__KRISHI_SALES__) globalStore.__KRISHI_SALES__ = {};
if (!globalStore.__KRISHI_PESTS__) globalStore.__KRISHI_PESTS__ = {};
if (!globalStore.__KRISHI_STAGE_HISTORY__) globalStore.__KRISHI_STAGE_HISTORY__ = {};

export const IN_MEMORY_FARMS = globalStore.__KRISHI_FARMS__;
export const IN_MEMORY_LOCATIONS = globalStore.__KRISHI_LOCATIONS__;
export const IN_MEMORY_BOUNDARIES = globalStore.__KRISHI_BOUNDARIES__;
export const IN_MEMORY_SOIL = globalStore.__KRISHI_SOIL__;
export const IN_MEMORY_WATER = globalStore.__KRISHI_WATER__;
export const IN_MEMORY_CROPS = globalStore.__KRISHI_CROPS__;
export const IN_MEMORY_ACTIVITIES = globalStore.__KRISHI_ACTIVITIES__;
export const IN_MEMORY_EXPENSES = globalStore.__KRISHI_EXPENSES__;
export const IN_MEMORY_SALES = globalStore.__KRISHI_SALES__;
export const IN_MEMORY_PESTS = globalStore.__KRISHI_PESTS__;
export const IN_MEMORY_STAGE_HISTORY = globalStore.__KRISHI_STAGE_HISTORY__;
