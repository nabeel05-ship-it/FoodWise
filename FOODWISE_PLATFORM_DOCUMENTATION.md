# FoodWise — Complete Platform Documentation
> **“Making Every Meal Count”** — AI-Driven Circular Food Waste Management, Industrial Mass Balance & Community Hunger Relief Platform  
> *Live Deployed URL:* [https://food-wise-puce.vercel.app](https://food-wise-puce.vercel.app)

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Platform Architecture & Tech Stack](#2-platform-architecture--tech-stack)
3. [User Roles & Access Control](#3-user-roles--access-control)
4. [Section-by-Section Feature Breakdown](#4-section-by-section-feature-breakdown)
   - [4.1 Institutional Kitchen Mess Module](#41-institutional-kitchen-mess-module-iit-delhi-central-mess)
   - [4.2 Industrial Processing Plant Module](#42-industrial-processing-plant-module-mother-dairy-unit)
   - [4.3 NGO Relief & Community Distribution Network](#43-ngo-relief--community-distribution-network-robin-hood-army)
   - [4.4 Multi-Facility ESG & Carbon Impact Analytics](#44-multi-facility-esg--carbon-impact-analytics)
5. [Database Architecture & Collections (MongoDB Atlas)](#5-database-architecture--collections-mongodb-atlas)
6. [API Specification & Endpoints](#6-api-specification--endpoints)
7. [Security, Compliance & FSSAI Standards](#7-security-compliance--fssai-standards)
8. [Deployment & Infrastructure](#8-deployment--infrastructure)

---

## 1. Executive Summary & Problem Statement

### The Problem
India produces over **68 million tonnes of food waste annually**, while simultaneously ranking high on global hunger and malnutrition indices. The challenge is structural:
- **Commercial & Institutional Kitchens**: Suffer from inflexible batching, attendance uncertainty, and disconnected surplus redistribution channels.
- **Food Processing Factories**: Suffer from raw produce cold-chain perishability, lack of real-time mass-balance accounting, and un-valorized organic waste streams.
- **Relief NGOs**: Struggle with lack of real-time visibility into donor surplus, cold-chain safety validation, and inefficient multi-stop collection logistics.

### The FoodWise Solution
**FoodWise** is an integrated, end-to-end platform bridging the entire lifecycle of food:
1. **At the Kitchen**: Uses neural demand forecasting and IoT scale telemetry to reduce overproduction by over 70%.
2. **At the Factory**: Deploys predictive spoilage kinetics, vibration machine diagnostics, and circular byproduct recovery (biogas, starch, animal feed).
3. **At the Community Level**: Connects verified FSSAI surplus to relief NGOs via dynamic route optimization with strict thermal validation and OTP handshakes.

---

## 2. Platform Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FOODWISE CLIENT APPLICATION                     │
│               Next.js 16 (Turbopack) • React 19 • TypeScript           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / JSON API
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS SERVERLESS BACKEND                      │
│      Dynamic REST Routes • Telemetry Ingestion • Route Optimizer       │
└────────────┬───────────────────────┬──────────────────────────┬────────┘
             │                       │                          │
             ▼                       ▼                          ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────┐
│   MONGODB ATLAS CLUSTER │  │   AI FORECASTING ENGINE │  │ LOCALSTORAGE   │
│   17 Cloud Collections │  │   Deep Learning v4.2   │  │ 0ms UI Sync    │
│   Live Connection Pool │  │   Spoilage Arrhenius   │  │ Override Cache │
└────────────────────────┘  └────────────────────────┘  └────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.5 (Turbopack) | Serverless App Router, Hybrid Static & Dynamic Rendering |
| **Frontend Runtime**| React 19 | Client-side reactive components, stateful telemetry |
| **Language** | TypeScript | Strict type safety, shared interfaces across frontend & API |
| **Database** | MongoDB Atlas (Cloud) | Multi-tenant NoSQL document storage with connection pooling |
| **Charts & Visuals** | Recharts (SVG) | Responsive area charts, stacked bar charts, donut gauges |
| **Icons & Design** | Lucide React + TailwindCSS | Modern dark-glass sidebar, high-contrast semantic UI tokens |
| **Deployment** | Vercel Serverless Platform | Edge CDN, automatic CI/CD deployment from GitHub `main` |

---

## 3. User Roles & Access Control

FoodWise supports dedicated institutional role-based workflows:

| Role ID | Role Name | Associated Facility Profile | Dedicated Portal Route |
| :--- | :--- | :--- | :--- |
| `KITCHEN_MANAGER` | Institutional Mess Warden | IIT Delhi Central Mess (DL-KIT-001) | `/kitchen/dashboard` |
| `FACTORY_MANAGER` | Plant Operations Manager | Mother Dairy Processing Plant (DL-FAC-409) | `/factory/dashboard` |
| `NGO_PARTNER` | Relief Logistics Coordinator | Robin Hood Army — South Delhi (NGO-DL-04) | `/ngo/dashboard` |
| `LOGISTICS` | Cold-Chain Van Driver | FoodWise Fleet Vehicle #DL-1V-8492 | `/kitchen/routes` |
| `ADMIN` | FSSAI State Food Safety Officer | Delhi Food Commission Regulatory Cell | `/dashboard/impact` |

---

## 4. Section-by-Section Feature Breakdown

### 4.1 Institutional Kitchen Mess Module (IIT Delhi Central Mess)
- **4.1.1 Overview Dashboard (`/kitchen/dashboard`)**:
  - Live shift tracker (Breakfast, Lunch, Dinner).
  - Key Performance Indicators: Today's AI Prediction, Weekly Waste Prevented, Safe Redistribution Ratio.
  - Interactive Time Period filter ("Today", "This Week", "This Month") dynamically updating cards.
  - Meal distribution schedule table with automated calorie and protein tracking.
- **4.1.2 AI Demand Forecaster (`/kitchen/prediction`)**:
  - Deep Learning Demand Model v4.2 calculating daily meal targets dynamically based on day-of-week habits (Biryani Fridays, Light Sunday Buffets), weather factors, and hostel occupancy.
  - Granular meal breakdown table with last-week comparison and AI chef suggestions.
  - **Manager Manual Override**:
    - Allows mess staff to input local knowledge (e.g. campus fest, sports symposium).
    - **Dual Persistence Architecture**: Immediately saves to `localStorage` (0ms lag on refresh) and persists to MongoDB Atlas `manager_overrides` collection.
- **4.1.3 IoT Waste Scale Tracking (`/kitchen/waste`)**:
  - Telemetry from 3 industrial load-cell smart scales:
    - `WS-01`: Dining Hall Plate Scraps Bin (Dish Return Conveyor).
    - `WS-02`: Peeling & Preparation Scraps Scale (Kitchen Scullery).
    - `WS-03`: Unserved Buffet Counter Surplus Scale (Bain-Marie Holding).
  - Modal to log new manual scale readings directly into the database.
- **4.1.4 Surplus & NGO Matching (`/kitchen/surplus`)**:
  - Real-time catalog of eligible unserved food with preparation timestamp, core temperature (°C), hygienic packaging status, and safe consumption countdown timer.
  - Automatic FSSAI safety algorithm determining redistribution eligibility.
  - 1-click NGO pickup request dispatching volunteer vans with auto-generated verification OTP.
- **4.1.5 Dynamic Route Optimization (`/kitchen/routes`)**:
  - Multi-stop logistics planner calculating the shortest and safest delivery path for redistribution vans.
  - Factor inputs: Live traffic congestion, perishable shelf-life urgency, cold-chain holding limits.
  - Turn-by-turn waypoint navigation with driver dispatch controls.
- **4.1.6 Dedicated Kitchen Audit Reports (`/kitchen/reports`)**:
  - Prep Waste vs. Plate Waste comparison charts.
  - Categorical food waste composition (Rice, Breads, Dals, Perishables).
  - FSSAI Safe Temperature Compliance Log (&gt;65°C verified holding).
  - Export capabilities: Signed Warden Audit PDF and CSV records.

---

### 4.2 Industrial Processing Plant Module (Mother Dairy Unit)
- **4.2.1 Plant Overview (`/factory/dashboard`)**:
  - Shift-wise biomass intake monitor, daily processing volume, and real-time yield rate.
  - Urgent alerts widget displaying high-risk batches requiring immediate processing reroute.
- **4.2.2 Raw Material Intake (`/factory/intake`)**:
  - Digital weighbridge logs recording raw agricultural deliveries (Tomatoes, Potatoes, Mangoes).
  - Quality grading sensor array (Brix sugar index, firmness rating, moisture percentage).
  - Automatic classification into Grade A (Retail/Canning), Grade B (Puree/Sauce), or Grade C (Valorization).
- **4.2.3 Cold Storage Monitor (`/factory/storage`)**:
  - Real-time environmental monitoring across 4 specialized warehouse zones:
    - *Zone 1*: Pre-cooling chamber (4°C - 6°C).
    - *Zone 2*: Ripening control atmosphere (12°C, 90% RH, Ethylene regulated).
    - *Zone 3*: Bulk deep freeze storage (-18°C).
    - *Zone 4*: Buffer intake staging dock.
  - 24-hour temperature fluctuation charts with critical deviation alarms.
- **4.2.4 Predictive Spoilage Engine (`/factory/spoilage`)**:
  - Biochemical Arrhenius degradation model forecasting days-to-spoil for every inventory batch.
  - "Prioritize Batch" action rerouting at-risk produce to Front-of-Line processing units, saving up to 2,800 kg per batch.
- **4.2.5 Machine Health & Vibration Telemetry (`/factory/machines`)**:
  - Real-time IoT telemetry for continuous steam peelers, rotary slicers, and flash pasteurizers.
  - Vibration amplitude (mm/s), bearing temperature, and anomaly scoring.
  - 1-click technician dispatch issuing preventative work orders before mechanical breakdown occurs.
- **4.2.6 Circular Byproduct Recovery (`/factory/byproduct`)**:
  - Tracks industrial organic valorization streams:
    - *Tomato Pomace*: Processed into high-fiber cattle feed.
    - *Starch Effluent*: Centrifuged for industrial starch extraction.
    - *Solid Scrap*: Fed into anaerobic biogas digestor (generating clean kWh electricity).
- **4.2.7 Dedicated Factory Mass Balance Reports (`/factory/reports`)**:
  - Stage-by-stage mass balance accounting table (Inflow vs Outflow vs Scrap).
  - Weekly processing recovery yield (%) versus the 90% industry baseline.
  - Machine OEE index logs and CPCB industrial scrap export tools.

---

### 4.3 NGO Relief & Community Distribution Network (Robin Hood Army)
- **4.3.1 NGO Relief Portal (`/ngo/dashboard`)**:
  - Live feed of verified food donations ready for immediate pickup.
  - Safe-to-consume countdown clock and dietary classification tags (Vegetarian, High Protein, Cooked Rice).
  - 1-click "Claim Food" action locking the batch for volunteer dispatch.
- **4.3.2 Scheduled Pickups & Safe Routing (`/ngo/dashboard`)**:
  - Pickup transit scheduler displaying driver assignments, contact info, and route ETA.
  - Interactive pickup confirmation requiring 4-digit OTP handshake between donor and driver.
- **4.3.3 FSSAI Food Safety Complaint System (`/ngo/complaints`)**:
  - Formal whistle-blowing and quality grievance filing interface for NGOs.
  - Categories: Temperature abuse in transit, off-odour/spoilage, packaging breach, delayed dispatch.
  - Automated ticket generation, laboratory testing flagging, and donor compliance audits.
- **4.3.4 Donor Gamification & Points Leaderboard (`/ngo/feedback`)**:
  - Feedback rating mechanism scoring donor kitchens on food quality, packaging hygiene, quantity accuracy, and punctuality.
  - Automated loyalty points allocation advancing hotels through tiers (**Bronze &rarr; Silver &rarr; Gold &rarr; Platinum**).
  - Verified donor badges (e.g. "Cold Chain Certified", "Zero Waste Champion").
- **4.3.5 Dedicated NGO Impact Reports (`/ngo/reports`)**:
  - Distribution breakdown across shelter hubs (Okhla Slums, Nizamuddin Shelter, Yamuna Pushta).
  - Beneficiary demographic split (Children, Elderly, Working Adults).
  - Donor integrity transparency scorecard and 80G CSR impact certificates.

---

### 4.4 Multi-Facility ESG & Carbon Impact Analytics (`/dashboard/impact`)
- **Overarching Sustainability Metrics**:
  - Total Food Rescued: **34.2 Metric Tonnes** across 340 registered facilities.
  - Greenhouse Gas (GHG) Emissions Prevented: **85.5 Tonnes CO₂e**.
  - Water Footprint Saved: **12.4 Million Litres**.
  - Net ESG Sustainability Rating: **92.4 / 100** (Prime Tier).
- **Cross-Departmental Switcher**:
  - Quick-navigation pills enabling instant switching between Corporate ESG, Kitchen Audits, Factory Audits, and NGO Impact.

---

## 5. Database Architecture & Collections (MongoDB Atlas)

The platform is backed by a cloud MongoDB Atlas database (`foodwise`), structured into 17 high-performance collections:

```
Database: foodwise (MongoDB Atlas Cluster0)
├── institutions            # Registered kitchens, factories, and NGO partner profiles
├── demand_history          # Historical daily diner numbers, weather, and semester calendars
├── predictions             # AI forecasted meal requirements and confidence scores
├── manager_overrides       # Human mess warden target adjustments and justifications
├── waste_records           # Daily scale readings, prep waste, and plate scrap entries
├── meal_plans              # Weekly nutritious menu schedules and allergen data
├── kitchen_alerts          # Real-time IoT temperature and waste capacity thresholds
├── surplus_items           # Food batches eligible for redistribution with safety countdowns
├── ngo_profiles            # Verified food relief NGOs, volunteer fleets, and coverage zones
├── route_stops             # Geographic waypoints, traffic conditions, and logistics paths
├── factory_storage         # Cold-storage environmental telemetry (temp, humidity, ethylene)
├── spoilage_batches        # Agricultural inventory tracking, ripeness, and shelf-life
├── machines                # Factory industrial processing machinery telemetry and OEE
├── donor_hotels            # Commercial food donor profiles, streak counts, and tier points
├── donor_feedback          # NGO post-delivery ratings, comments, and safety evaluations
├── complaints              # FSSAI food quality grievances and investigation tickets
└── notifications           # Cross-role actionable system alerts and dispatch triggers
```

---

## 6. API Specification & Endpoints

| HTTP Method | Endpoint URL | Purpose / Action | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic endpoint checking MongoDB connection & collection counts | `200`, `500` |
| `GET` | `/api/data` | Hydrates the entire application state with 17 cloud collections | `200`, `500` |
| `GET` | `/api/overrides` | Retrieves the latest active manager manual demand override | `200`, `404` |
| `POST` | `/api/overrides` | Saves new manager override; deactivates previous entries | `200`, `400` |
| `DELETE`| `/api/overrides` | Clears active manager override, restoring autonomous AI forecasting | `200`, `500` |
| `GET` | `/api/surplus` | Fetches all current eligible and active surplus food batches | `200`, `500` |
| `PATCH`| `/api/surplus` | Updates matched NGO and dispatches redistribution transport | `200`, `400` |
| `GET` | `/api/notifications` | Retrieves user notifications sorted by latest timestamp | `200`, `500` |
| `PATCH`| `/api/notifications` | Marks individual notification or all notifications as read | `200`, `400` |
| `GET` | `/api/complaints` | Retrieves FSSAI quality grievances and regulatory audit logs | `200`, `500` |
| `POST` | `/api/complaints` | Files a new formal food safety complaint with severity level | `201`, `400` |
| `GET` | `/api/donors` | Retrieves donor hotel leaderboard, rankings, and tier points | `200`, `500` |
| `POST` | `/api/feedback` | Submits NGO quality review, updates donor rating and awards points | `200`, `400` |
| `PATCH`| `/api/machines` | Dispatches maintenance mechanic and updates machine health | `200`, `400` |
| `PATCH`| `/api/spoilage` | Prioritizes at-risk produce batch to Front of Line processing | `200`, `400` |

---

## 7. Security, Compliance & FSSAI Standards

1. **FSSAI Recovery Regulations (2019)**:
   - All surplus redistributions enforce mandatory core temperature logging (&gt;65°C for hot holding, &lt;5°C for refrigerated cold-chain).
   - Maximum 4-hour shelf-life expiry ceiling from preparation completion to final community consumption.
2. **Cryptographic OTP Handshake**:
   - Every food transfer requires a two-party OTP code exchanged between the mess warden and volunteer driver to guarantee zero diversion.
3. **Data Sanitization & Secret Protection**:
   - MongoDB Atlas credentials secured via serverless environment variables (`MONGODB_URI`).
   - `.gitignore` strictly protects `.env*` from being committed to public repositories.
4. **Resilient Dual Storage Architecture**:
   - Critical user inputs (such as Manager Overrides) utilize immediate `localStorage` caching alongside asynchronous database persistence, ensuring zero interface lag or data loss upon page reloads.

---

## 8. Deployment & Infrastructure

- **Live Production URL**: [https://food-wise-puce.vercel.app](https://food-wise-puce.vercel.app)
- **Source Code Repository**: [https://github.com/Sudhanshu-22-11/FoodWise.git](https://github.com/Sudhanshu-22-11/FoodWise.git)
- **Hosting Environment**: Vercel Serverless Edge Runtime (AWS / GCP Nodes in ap-south-1).
- **Database Engine**: MongoDB Atlas M0 Cluster (Node.js MongoDB Native Driver v6.14 with connection reuse and `autoSelectFamily: false`).
- **Build Pipeline**: Next.js 16 Turbopack production compilation generating 38 static and dynamic server-rendered routes with 0 lint or TypeScript errors.

---

*FoodWise (FoodSense AI) • “Making every meal count”*
