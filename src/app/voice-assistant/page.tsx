"use client";

import React from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { VoiceAssistantModal } from "@/components/VoiceAssistantModal";

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-screen flex bg-transparent">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center max-w-4xl mx-auto">
        <VoiceAssistantModal />
      </div>
    </div>
  );
}
