"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppProvider>
        <ScrollToTop />
        {children}
      </AppProvider>
    </LanguageProvider>
  );
}

