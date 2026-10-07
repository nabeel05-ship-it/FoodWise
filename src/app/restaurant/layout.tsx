"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useApp } from "@/context/AppContext";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUserRole } = useApp();

  useEffect(() => {
    setUserRole("RESTAURANT");
  }, [setUserRole]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "#F4F6FA" }}>
      <Sidebar type="restaurant" />
      <main id="main-content" className="flex-1 min-w-0">
        <div className="p-3.5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
