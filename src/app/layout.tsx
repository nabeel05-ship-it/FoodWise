import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/providers/ClientProvider";

import NotificationDrawer from "@/components/common/NotificationDrawer";
import OnboardingModal from "@/components/common/OnboardingModal";
import ApiInspectorModal from "@/components/common/ApiInspectorModal";
import SettingsModal from "@/components/common/SettingsModal";
import PushNotificationPrompt from "@/components/common/PushNotificationPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodWise — Predict Less Waste. Feed More Lives.",
  description:
    "AI-powered Smart Food Waste Management and Redistribution Platform for Institutional Kitchens and Food Processing Factories.",
  keywords: [
    "food waste management",
    "AI demand prediction",
    "predictive spoilage",
    "NGO food redistribution",
    "smart kitchen",
    "FSSAI compliance",
    "Making every meal count",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#F4F6FA] text-[#111827] font-sans antialiased selection:bg-[#10B981]/20 selection:text-[#10B981]">
        <ClientProvider>
          {children}
          <NotificationDrawer />
          <OnboardingModal />
          <ApiInspectorModal />
          <SettingsModal />
          <PushNotificationPrompt />

        </ClientProvider>
      </body>
    </html>
  );
}
