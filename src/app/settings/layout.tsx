"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useApp } from "@/context/AppContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole, activeDonor } = useApp();
  const sidebarType =
    userRole === "HOTEL" || activeDonor?.type === "Hotel"
      ? "hotel"
      : userRole === "HOUSEHOLD" || activeDonor?.type === "Household"
      ? "household"
      : userRole === "NGO"
      ? "ngo"
      : "restaurant";

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "#F4F6FA" }}>
      <Sidebar type={sidebarType} />
      <main id="main-content" className="flex-1 min-w-0">
        <div className="p-3.5 sm:p-6 lg:p-8 max-w-[1300px] mx-auto w-full pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
