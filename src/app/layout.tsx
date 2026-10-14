import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/providers/ClientProvider";

import NotificationDrawer from "@/components/common/NotificationDrawer";
import SettingsModal from "@/components/common/SettingsModal";
import PushNotificationPrompt from "@/components/common/PushNotificationPrompt";
import FoodieAIWidget from "@/components/common/FoodieAIWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodWise — Food Waste Reduction and Food Donation Platform",
  description:
    "Connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted. Supporting SDG 2 (Zero Hunger) & SDG 12 (Responsible Consumption).",
  keywords: [
    "food waste reduction",
    "surplus food donation",
    "NGO food redistribution",
    "restaurant food donation",
    "hotel banquet donation",
    "zero hunger SDG 2",
    "responsible consumption SDG 12",
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
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#F5F7F6] text-[#111827] font-sans antialiased">
        <ClientProvider>
          {children}
          <NotificationDrawer />
          <SettingsModal />
          <PushNotificationPrompt />
          <FoodieAIWidget />
        </ClientProvider>
      </body>
    </html>
  );
}
