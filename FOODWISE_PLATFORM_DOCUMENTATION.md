# FoodWise — Community Project Documentation
> **“Making Every Meal Count”** — Food Waste Reduction and Food Donation Platform

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Related SDGs & Program Outcomes](#2-related-sdgs--program-outcomes)
3. [Platform Architecture & Tech Stack](#3-platform-architecture--tech-stack)
4. [User Roles & Access Control](#4-user-roles--access-control)
5. [Section-by-Section Feature Breakdown](#5-section-by-section-feature-breakdown)
   - [5.1 Household Experience](#51-household-experience)
   - [5.2 Restaurant Experience](#52-restaurant-experience)
   - [5.3 Hotel & Banquet Experience](#53-hotel--banquet-experience)
   - [5.4 NGO & Relief Organization Experience](#54-ngo--relief-organization-experience)
6. [Role-Specific Impact & SDG Alignment](#6-role-specific-impact--sdg-alignment)
7. [Settings & Notification Architecture](#7-settings--notification-architecture)
8. [Data Architecture & Local In-Memory Layer](#8-data-architecture--local-in-memory-layer)
9. [Professional Document & PDF Generation System](#9-professional-document--pdf-generation-system)

---

## 1. Executive Summary & Problem Statement

### The Problem Statement
> **"Develop a platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted."**

Across urban communities, vast amounts of perfectly edible food are discarded daily while vulnerable populations experience food insecurity:
- **Households** often cook extra meals during family gatherings, dinners, or celebrations with no simple way to share small batches.
- **Restaurants** generate daily surplus at lunch and dinner closing shifts that must be cleared quickly.
- **Hotels & Banquet Venues** produce substantial volumes of surplus meals from breakfast buffets, conference lunches, and wedding banquets.
- **Relief NGOs** struggle with a lack of real-time visibility into where surplus food is located, requiring inefficient manual calls.

### The FoodWise Ecosystem
```
RESTAURANTS   ──┐
HOTELS        ──┼──>  FOODWISE PLATFORM  ──>  NGOs / RELIEF HUBS  ──>  COMMUNITIES IN NEED
HOUSEHOLDS    ──┘
```

### The Core Operational Workflow
```
SURPLUS FOOD  ──>  DONATION LISTING  ──>  NGO DISCOVERY  ──>  REQUEST / ACCEPTANCE  ──>  PICKUP / HANDOVER (OTP)  ──>  COMPLETION & IMPACT
```

---

## 2. Related SDGs & Program Outcomes

* **SDG 2 — Zero Hunger (Target 2.1):** End hunger and ensure access by all vulnerable communities to safe, nutritious, and sufficient food all year round. FoodWise directs edible surplus from kitchens and residences directly to grassroots food banks and shelters.
* **SDG 12 — Responsible Consumption & Production (Target 12.3):** Halve per capita food waste at retail and consumer levels and reduce food losses along production and supply chains. FoodWise prevents safe edible food from degrading in municipal landfills.
* **PO 6 — The Engineer and Society:** Apply reasoning informed by contextual knowledge to assess societal, health, safety, and legal issues.
* **PO 12 — Life-long Learning / Sustainable Technology:** Recognize the need for, and have the ability to engage in independent and life-long learning in the broadest context of technological and environmental change.

---

## 3. Platform Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Serverless App Router, Hybrid Static & Dynamic Rendering |
| **Frontend Runtime**| React 19 | Client-side reactive components, stateful context |
| **Language** | TypeScript | Strict type safety, shared interfaces across frontend & API |
| **Styling** | TailwindCSS + Semantic CSS Tokens | Custom palette (`#072B1E`, `#164A31`, `#10B981`, `#F4F6FA`) |
| **Visuals & Charts** | Recharts (SVG) | Responsive area charts for verified redistribution growth |
| **Icons** | Lucide React | Domain icons (Utensils, Hotel, Home, Truck, Bell, ShieldCheck) |

---

## 4. User Roles & Access Control

FoodWise features four distinct, dedicated role experiences without any in-app demo switchers. Authentication routes users directly to their designated experience:

| Role | Target Donor / Actor | Portal Route Tree | Realistic Surplus Scale |
| :--- | :--- | :--- | :--- |
| **Household** | Families & residences | `/household/*` | 1.5 – 3 kg (~4 – 8 servings); 5 – 6 kg for gatherings |
| **Restaurant** | Commercial kitchens & eateries | `/restaurant/*` | 12 – 25 kg (~35 – 70 servings) |
| **Hotel** | Hotels, buffets & banquet caterers | `/hotel/*` | 25 – 55 kg (~75 – 160 servings) |
| **NGO** | Food banks, shelters & charities | `/ngo/*` | Aggregates all incoming donations |

---

## 5. Section-by-Section Feature Breakdown

### 5.1 Household Experience (`/household/*`)
* **Home / Dashboard (`/household/dashboard`):** Minimalist family portal ("Have extra food? Share it with people who need it") showing 4 simple metrics: Active Donations, Completed Rescues, Food Donated, and People Helped.
* **Donate Food (`/household/donate`):** 1-minute donation form with 1-click Quick Donate presets (`2.5kg Veg Pulao & Dal`, `15 Chapatis & Sabzi`, `5kg Family Gathering Surplus`) and an optional "Reason for Surplus" context dropdown.
* **My Donations (`/household/donations`):** Simple timeline tracking active vs completed donations.
* **Profile (`/household/profile`):** Resident name, contact person, phone number, and residential address.

### 5.2 Restaurant Experience (`/restaurant/*`)
* **Dashboard (`/restaurant/dashboard`):** Real-time commercial KPIs (Surplus Listed, Active Donations, Upcoming Pickups, Completed Rescues, People Served) and 1-click "Donate Again" re-listing.
* **Donate Food (`/restaurant/donate`):** Fast commercial form with a "Service Shift / Timing" selector (Lunch Service, Dinner Service, Daily Closing Time, Catering Excess).
* **My Donations (`/restaurant/donations`):** Manage active listings and pending NGO requests.
* **Pickups & Handover (`/restaurant/pickups`):** Pickup monitoring, driver name & vehicle tracking, and secure 4-digit handover OTP verification.
* **Profile (`/restaurant/profile`):** Restaurant name, FSSAI license, head chef, and kitchen dock instructions.

### 5.3 Hotel & Banquet Experience (`/hotel/*`)
* **Dashboard (`/hotel/dashboard`):** Large-volume meal surplus overview and scheduled banquet vehicle collections.
* **Donate Food (`/hotel/donate`):** Large-batch donation form with Meal Type (Breakfast, Lunch, Dinner, Buffet, Banquet, Packed Meals) and Surplus Source context (Buffet Service, Banquet Hall, Conference, Event, Hotel Main Kitchen).
* **My Donations (`/hotel/donations`):** Multi-event surplus history.
* **Pickups (`/hotel/pickups`):** Handover verification with driver details and OTP.
* **Profile (`/hotel/profile`):** Hotel property name, banquet operations manager, FSSAI registration, and loading bay entrance notes.

### 5.4 NGO & Relief Organization Experience (`/ngo/*`)
* **Dashboard (`/ngo/dashboard`):** Action-oriented relief dashboard with primary "+ Find Available Food" CTA, live claim queue, and urgent collection alerts.
* **Find Food (`/ngo/find`):** Real-time surplus feed with filters by Donor Type (Restaurant, Hotel, Household) and Diet (Vegetarian, Non-Vegetarian) displaying exact kg, approximate servings, proximity (km), and pickup deadline countdowns.
* **Requests (`/ngo/requests`):** Track submitted pickup requests awaiting donor approval.
* **Accepted Pickups (`/ngo/accepted`):** Assigned collection runs with driver details, collection route, and handover OTP codes.
* **Completed Logbook (`/ngo/completed`):** Verified relief distribution records with timestamped delivery receipts.
* **Profile (`/ngo/profile`):** NGO DARPAN registration, relief coordinator, phone, address, and coverage area.

---

## 6. Role-Specific Impact & SDG Alignment

The `/dashboard/impact` section connects each user's real actions to the UN Sustainable Development Goals without academic bloat:

### Household
* **Personal Metrics:** Food Donated (kg), Completed Donations, People Helped, Food Waste Prevented (kg).
* **SDG 2 Alignment:** "Your donations help redirect edible surplus food to people who need it, supporting SDG 2."
* **SDG 12 Alignment:** "By preventing edible food from becoming waste, your family donations support responsible consumption and contribute to SDG 12."

### Restaurant
* **Commercial Metrics:** Food Donated (kg), Completed Rescues, People Served, Commercial Waste Prevented (kg).
* **SDG 2 Alignment:** "Surplus meals from your restaurant are collected by verified NGOs to provide immediate, dignified food assistance to vulnerable communities, helping expand food access under SDG 2."
* **SDG 12 Alignment:** "Listing and redistributing edible surplus food before daily closing prevents avoidable commercial waste and supports responsible resource management under SDG 12."

### Hotel
* **Hospitality Metrics:** Food Donated (kg), Meals Redistributed, Completed Collections, Hospitality Waste Prevented (kg).
* **SDG 2 Alignment:** "Surplus food from hotel kitchens, buffets, banquets, and events is channeled directly into community food relief, converting hospitality surplus into nourishment under SDG 2."
* **SDG 12 Alignment:** "Responsible coordination and timely redistribution of large-scale buffet and event surplus prevents massive quantities of edible food from ending up in landfills, advancing SDG 12."

### NGO
* **Relief Metrics:** Food Received (kg), People Served, Completed Pickups, Active Donor Partners.
* **SDG 2 Alignment:** "Your organization converts surplus food donations into immediate meals for families, children, and individuals who need assistance, directly contributing to SDG 2."
* **SDG 12 Alignment:** "By ensuring that donated food is collected safely and distributed promptly, your organization plays a vital role in preventing edible food from being discarded, supporting SDG 12."

---

## 7. Settings & Notification Architecture

All artificial AI controls (confidence cutoffs, model modes, predictive sliders) and fake automation settings (automated matchmaking, Weibull decay alarms) have been removed.

The Settings section (`/settings` and `SettingsModal`) provides four genuine, role-aware configuration panels:
1. **Profile:** Role-specific names, primary contacts, and verified registration numbers (FSSAI or NGO DARPAN).
2. **Pickup Location & Notes:** Street address, city, service areas, and doorstep/loading bay instructions.
3. **Notification Preferences:** Real donation and pickup events only:
   - *Donors:* New NGO Requests, Volunteer Driver Assignments, Handover Reminders.
   - *NGOs:* New Surplus Available Nearby, Donor Request Acceptance, Pickup Reminders.
   - *System:* Gentle in-browser audio chime toggle.
4. **Security & Session:** Password updates and secure logout.

---

## 8. Data Architecture & Local In-Memory Layer

The platform prototype operates on a local, in-memory data service layer (`src/lib/dataService.ts` and `src/lib/mockData.ts`) with zero external database dependencies. External MongoDB Atlas integration is deferred until prototype finalization.

### Core Domain Entities
```
├── CommunityDonor          # Restaurant, Hotel, or Household donor profile
├── CommunityNgo            # Verified relief NGO and coverage areas
├── DonationItem            # Surplus food batch with kg, servings, shift/source context
└── NotificationAlert       # Real actionable alerts for donations and pickups
```

---

## 9. Professional Document & PDF Generation System

FoodWise implements a dedicated document generation suite (`src/lib/pdfGenerator.ts`) designed to produce print-ready, professional A4 documents tailored to civic and community food redistribution workflows.

### 9.1 Distinct Document Architectures
Rather than treating every export as a decorative certificate, FoodWise provides 4 specialized document layouts:

1. **Food Donation Certificate (`downloadFoodDonationCertificatePdf`):**
   - **Format:** A4 Landscape (297 × 210 mm)
   - **Purpose:** Formal, commemorative recognition presented to donors (households, restaurants, hotels) for surplus contributions.
   - **Hierarchy:** Restrained single dark-forest border (`#164A31`), centered FoodWise identity, prominent recipient name focal point, concise recognition statement, clean twin panels for Donation Specifics and Community Impact, unique certificate ID (`FW-CERT-2026-XXXXX`), date, and authorized representative signature block.
   - **Compliance:** Free of fake government seals or false regulatory claims; includes a neutral food safety advisory note.

2. **Food Donation Record / Receipt (`downloadDonationRecordPdf`):**
   - **Format:** A4 Portrait (210 × 297 mm)
   - **Purpose:** Transactional manifest and receipt for single completed or active donation handovers.
   - **Hierarchy:** Professional two-column header, unique transaction ID (`FW-DON-2026-XXXXX`), donor profile details, food batch specifics (category, quantity, servings, temperature condition), logistics & NGO recipient details, handover verification status (OTP verification timestamp), and formal sign-off line.

3. **Donation Impact Report (`downloadDonationImpactReportPdf`):**
   - **Format:** A4 Portrait (210 × 297 mm)
   - **Purpose:** Operational audit and governance summary for restaurants, hotels, and NGOs summarizing periodic food redistribution activity.
   - **Hierarchy:** Reporting period header, 4-card executive summary metric grid (Total Donated, Servings Shared, People Reached, Completed Donations), structured activity table with alternating row striping, factual SDG alignment sections (SDG 2 Zero Hunger & SDG 12 Responsible Consumption), and platform verification footer (`FW-REP-2026-XXXXX`).

4. **NGO Food Collection Record (`downloadNgoCollectionRecordPdf`):**
   - **Format:** A4 Portrait (210 × 297 mm)
   - **Purpose:** Operational collection receipt for relief NGO hubs, fleet drivers, and intake centers.
   - **Hierarchy:** Operational manifest layout tracking collecting organization, source donor location, batch quantity, handover OTP verification, destination community shelter, and field officer acknowledgment.

### 9.2 Compliance, Ethics & Content Standards
- **Zero Fake Regulatory Claims:** All misleading references to "100% FSSAI Compliance", "FSSAI Safe Food Share seals", or "Section 80G Tax Deductions" have been eliminated.
- **Informational Food Safety Guidance:** Standard neutral note: *"Food donors are encouraged to follow applicable food safety and hygiene practices."*
- **Accurate Real Data:** All documents render actual application metrics (kg, servings, beneficiaries, completed counts) without artificial scientific inflation (e.g. fabricated water conservation or speculative GHG equations).
- **Print & Typography Standards:** Adheres to strict A4 margins (12–15 mm), clear typographic hierarchy using Helvetica/Helvetica-Bold, deliberate white space, and brand colors (`#164A31`, `#072B1E`, `#10B981`).
- **Professional File Naming:** Sanitized, descriptive filenames formatted as `FoodWise_Certificate_[Name]_[ID].pdf`, `FoodWise_Donation_Record_[ID].pdf`, or `FoodWise_Impact_Report_[Period].pdf`.

---

## 10. Multilingual & Internationalization (i18n) Architecture

FoodWise features an enterprise-grade, application-wide internationalization (i18n) system providing native, natural translations across three primary regional languages:

1. **🇬🇧 English (`en`)** — Default international language
2. **🇮🇳 हिंदी / Hindi (`hi`)** — Full national language support
3. **🇮🇳 ಕನ್ನಡ / Kannada (`kn`)** — Native regional language support for Karnataka / Southern India

### 10.1 Core Architecture & How It Works

The multilingual system operates on a dual-layer architectural strategy:

1. **Reactive Context & Translation Hook (`useLang` / `t`):**
   - Implemented via `src/context/LanguageContext.tsx`.
   - Stores the active language state (`en | hi | kn`) and persists user preferences in `localStorage` (`fw_lang`).
   - Provides a `t(keyOrText)` helper that resolves translation keys against a centralized dictionary of 1,500+ terms covering every module, dashboard, metric, badge, and form.
   - Falls back gracefully to dynamic phrase translators when arbitrary text or runtime values are queried.

2. **Universal DOM Auto-Translator (`DomAutoTranslator`):**
   - Implemented in `src/context/domTranslator.ts`.
   - Uses `MutationObserver` and `TreeWalker` to dynamically translate rendered text nodes, `input.placeholder`, `textarea.placeholder`, and element `title` attributes.
   - Preserves English baseline strings via `WeakSet` and node attributes (`__fw_orig`, `data-fw-orig-placeholder`).
   - Ensures that switching languages cleanly restores the original English before translating into the target language, preventing mixed-language artifacts.

3. **Safe PDF Font & Unicode Normalization (`safePdfText`):**
   - Implemented in `src/lib/pdfGenerator.ts`.
   - Automatically sanitizes and reverse-translates Indian script terms (e.g., units like `ಕಿ.ಗ್ರಾಂ` / `कि.ग्रा.` to `kg`) so that exported PDFs render cleanly without corrupted characters or missing glyphs.

### 10.2 File Structure & Storage Locations

| File | Purpose |
|------|---------|
| [`src/context/LanguageContext.tsx`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/LanguageContext.tsx) | Centralized i18n context provider, `Language` type (`"en" \| "hi" \| "kn"`), base translations dictionary, and `useLang` hook |
| [`src/context/locales/kn.ts`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/locales/kn.ts) | Complete compiled Kannada translation dictionary covering 1,500+ keys |
| [`src/context/dictionary.ts`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/dictionary.ts) | Hindi phrase dictionary, dynamic pattern replacements, and reverse translation dictionary |
| [`src/context/kannadaDictionary.ts`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/kannadaDictionary.ts) | Kannada phrase dictionary, dynamic pattern replacements, and reverse translation dictionary |
| [`src/context/domTranslator.ts`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/domTranslator.ts) | Headless DOM tree-walker and mutation observer for dynamic client-side translation |
| [`src/components/common/LanguageToggle.tsx`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/components/common/LanguageToggle.tsx) | Interactive language switcher component supporting both compact and full variants |
| [`src/components/layout/Navbar.tsx`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/components/layout/Navbar.tsx) | Top navigation bar with integrated compact language switcher |

### 10.3 How to Add Future Translations

To add a new translation string:
1. Open [`src/context/LanguageContext.tsx`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/LanguageContext.tsx) and add the key with `en` and `hi` values under the `translations` object:
   ```ts
   "my_feature.title": { en: "Feature Title", hi: "सुविधा शीर्षक" }
   ```
2. Open [`src/context/locales/kn.ts`](file:///Users/nsa/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/CP_FoodWise/src/context/locales/kn.ts) and add the corresponding Kannada entry:
   ```ts
   "my_feature.title": "ವೈಶಿಷ್ಟ್ಯದ ಶೀರ್ಷಿಕೆ"
   ```
3. In components, access it with:
   ```tsx
   const { t } = useLang();
   return <h1>{t("my_feature.title")}</h1>;
   ```


