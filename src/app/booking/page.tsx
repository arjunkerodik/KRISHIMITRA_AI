"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/machinery");
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white text-center space-y-4">
      <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-neutral-300">
        Redirecting to Farm Machinery & Equipment Booking Hub...
      </p>
    </div>
  );
}
