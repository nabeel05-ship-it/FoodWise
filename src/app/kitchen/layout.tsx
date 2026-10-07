"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userRole, activeDonor } = useApp();

  useEffect(() => {
    if (userRole === "HOTEL" || activeDonor?.type === "Hotel") {
      router.replace("/hotel/dashboard");
    } else if (userRole === "HOUSEHOLD" || activeDonor?.type === "Household") {
      router.replace("/household/dashboard");
    } else if (userRole === "NGO") {
      router.replace("/ngo/dashboard");
    } else {
      router.replace("/restaurant/dashboard");
    }
  }, [userRole, activeDonor, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
      <div className="text-center space-y-2">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-medium">Redirecting to your portal...</p>
      </div>
    </div>
  );
}

