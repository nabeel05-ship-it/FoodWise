<div align="center">
  <img src="./public/logo.png" alt="FoodWise Logo" width="250"/>
</div>
<div align="center">

# FoodWise

### Food Waste Reduction and Food Donation Platform

**Connecting Surplus Food with Communities in Need.**

A web-based platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted.

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_FoodWise-16A34A?style=for-the-badge&logo=vercel&logoColor=white)](https://food-wise-henna.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br>

## 🚀 [Explore the Live Application](https://food-wise-henna.vercel.app)

**Reducing Food Waste • Enabling Food Donations • Supporting Communities**

</div>

---

## 📌 Official Problem Statement

### Title
**Food Waste Reduction and Food Donation Platform**

### Description
> Develop a platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted.

---

## 🌍 About FoodWise

Food waste and food insecurity are interconnected challenges. Restaurants, hotels, institutional kitchens, and households often have surplus food, while NGOs and charitable organizations work to provide meals to people in need.

However, the lack of effective coordination between food donors and recipient organizations can make timely food redistribution difficult.

**FoodWise bridges this gap through a centralized digital food donation platform.**

It enables food donors to list surplus food, allows NGOs to discover and claim available donations, and provides tools to coordinate collection, track donation progress, and record completed deliveries.

By bringing donors and recipient organizations together, FoodWise aims to make food donation more accessible, organized, and transparent.

### 🎯 Our Mission

To simplify surplus food donation by connecting food donors with NGOs through a centralized, technology-driven platform.

### 💡 Our Vision

A future where surplus food becomes an opportunity to nourish communities rather than unnecessary waste.

---

## 🌐 Live Deployment

FoodWise is deployed on **Vercel** and can be accessed online.

### 🔗 Live Application

**https://food-wise-henna.vercel.app**

Explore the platform to discover its interface, donation workflows, and NGO coordination features.

> **Note:** The availability of individual features depends on the current deployment configuration. Please do not enter sensitive personal information into a demonstration application.

---

## ✨ Key Features

### 🏠 1. Household Food Donations

Households can list surplus food for potential redistribution through participating NGOs.

Features include:
- Food donation forms.
- Food quantity and category information.
- Pickup deadlines.
- Dietary and handling details.
- Donation status tracking.

### 🏨 2. Restaurant and Hotel Donations

Restaurants, hotels, banquet halls, and institutional kitchens can list surplus food generated during their operations.

Features include:
- Structured surplus food listings.
- Food quantity management.
- Collection deadlines.
- Food storage and handling information.
- Dietary and allergen details.
- Pickup instructions.

The platform provides a centralized way for commercial food donors to make available surplus food visible to recipient organizations.

### 🤝 3. NGO Dashboard

NGOs have a dedicated interface for managing food collection and redistribution activities.

Features include:
- Browse available donations.
- Review food details and collection requirements.
- Claim suitable donations.
- Coordinate scheduled pickups.
- Track donation status.
- Record completed deliveries.
- Review relevant notifications.
- Report food quality concerns.

### 🧠 4. Smart Donation Matching

FoodWise includes a rule-based matching system to help NGOs assess available food donations.

Matching considerations include:
- Food quantity.
- Pickup urgency.
- Dietary compatibility.
- Collection requirements.

Matching results are intended to assist users in evaluating donations. They do not guarantee food suitability or safety.

### ⏱️ 5. Donation Lifecycle Management

FoodWise supports structured donation status tracking.

Typical donation states include:

- `AVAILABLE`
- `ACCEPTED`
- `PICKUP`
- `COMPLETED`
- `CANCELLED`
- `FLAGGED_FOR_REVIEW`

The application validates important status transitions to help maintain a consistent donation workflow:

- `AVAILABLE → ACCEPTED` when an NGO claims a listing that hasn't passed its pickup deadline.
- `ACCEPTED → PICKUP` only when the donor enters the volunteer's matching handover code.
- `PICKUP → COMPLETED` when the NGO confirms delivery to beneficiaries.
- `AVAILABLE` or `ACCEPTED → CANCELLED` when the donor withdraws a listing.
- `FLAGGED_FOR_REVIEW` when a Medium or High severity quality issue is reported.

Other jumps (for example `AVAILABLE → COMPLETED`) are rejected by the API, and the interface rolls back any change the server rejects. Each step is recorded on the donation's timeline (`ACCEPTED`, `COLLECTED`, `DELIVERED`, `CANCELLED`).

When MongoDB-backed persistence is active, database operations help prevent multiple NGOs from claiming the same available donation simultaneously.

### 🔐 6. Digital Handover Verification

FoodWise includes a four-digit OTP workflow to support the handover of donated food:

1. When an NGO claims a donation, FoodWise issues a one-time 4-digit code to the NGO and its volunteer driver, and notifies the donor that the volunteer will present a code.
2. At pickup, the volunteer shows the code and the donor enters it on their dashboard, Pickups page or the donation's details. A wrong code is rejected.
3. A matching code marks the food as collected (`PICKUP`); the NGO can then confirm delivery, which completes the donation.

The OTP supports the handover workflow but does not independently verify participant identity or certify food safety.

### 🥗 7. Food Quality Reporting

NGOs can report food quality concerns encountered during collection or handling.

The reporting workflow supports:
- Incident descriptions.
- Food quality and packaging concerns.
- Severity information.
- Supporting evidence where available.
- Review and follow-up workflows: reports move from **Reported → Under review → Resolved** on the NGO Food Issues page, with optional review notes.

This feature helps improve visibility into issues that arise during food redistribution.

### 🤖 8. Foodie AI Assistant

Foodie AI is an AI-powered assistant integrated using the Groq SDK.

It provides contextual guidance to help users understand and navigate the platform.

Potential use cases include:
- Understanding donation workflows.
- Creating food donation listings.
- Navigating NGO operations.
- Understanding donation statuses.
- Accessing platform-related guidance.

If no `GROQ_API_KEY` is configured, or the model is unreachable, Foodie AI answers from a built-in guide to FoodWise features, so the assistant keeps working.

Foodie AI is intended to support platform usage. It does not certify food as safe to consume and does not replace qualified food safety professionals.

### 🌐 9. Multilingual Interface

FoodWise includes interface support for:

- English
- Hindi
- Kannada

Switch languages from the sidebar, the public page header, the sign-in card or Settings. The choice is remembered on the device. User-entered content (names, addresses, dish names) is shown as entered.

The multilingual interface aims to make the platform more accessible to users from different linguistic backgrounds.

### 📊 10. Impact Dashboard

The impact dashboard summarizes redistribution activity using application records.

Supported metrics include:
- Food weight recorded as diverted.
- Estimated servings.
- Completed donation activities.
- Donor participation.
- Estimated environmental impact.

Impact figures depend on available records and calculation assumptions. They are not independently audited impact measurements.

### 📄 11. PDF Reports and Certificates

FoodWise includes PDF generation functionality for supported documents, such as:
- Donation records.
- Receipts.
- Certificates.
- Impact reports.

These documents help users maintain records of donation activities.

### 🔔 12. Notifications and Settings

The platform includes:
- In-app notifications.
- Notification read/unread management.
- Role-specific navigation.
- Profile and facility settings.
- Donation and pickup status updates.
- Browser push notification functionality when correctly configured.

### 💾 13. MongoDB Data Persistence

FoodWise integrates MongoDB through the official MongoDB Node.js driver.

The database layer supports persistence for application data, including donations, pickups, notifications, complaints, and related records.

A MongoDB connection must be correctly configured for durable database-backed operation. In-memory fallback data should not be assumed to persist across server restarts.

---

## 🔄 How FoodWise Works

FoodWise follows a structured food donation and redistribution workflow.

```text
┌──────────────────────────────┐
│          FOOD DONORS         │
│                              │
│  Households • Restaurants    │
│       Hotels • Kitchens      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      LIST SURPLUS FOOD       │
│                              │
│  Quantity • Food Details     │
│  Handling • Pickup Deadline  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        NGO DASHBOARD         │
│                              │
│  Discover and Review Food    │
│        Donations             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      CLAIM & COORDINATE      │
│                              │
│    Arrange Food Collection   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     DIGITAL HANDOVER         │
│                              │
│     Four-Digit OTP Flow      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     DELIVERY COMPLETION      │
│                              │
│    Update Donation Status    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      IMPACT & REPORTING      │
│                              │
│  Track Records and Report    │
│       Quality Issues         │
└──────────────────────────────┘
```

### Workflow Overview

1. A household, restaurant, or hotel lists surplus food.
2. The donation becomes available for NGO discovery.
3. An NGO reviews and claims a suitable donation.
4. Pickup arrangements are coordinated.
5. At pickup, the donor enters the volunteer's 4-digit handover code; a matching code releases the food.
6. The receiving organization records delivery completion.
7. The completed record contributes to applicable impact metrics.
8. Food quality concerns can be reported through the platform.

---

## 🛠️ Technology Stack

| Technology | Version / Spec | Purpose & Architectural Role |
|---|---|---|
| **Next.js** | `^16.3.5` | App Router full-stack framework, Turbopack, and serverless API route handlers |
| **React** | `19.2.8` | Component-based UI library with Server and Client Components |
| **TypeScript** | `^5` | Strict static typing across data contracts, API payloads, and state models |
| **Tailwind CSS** | `^4` | Utility-first responsive styling and theme tokens |
| **MongoDB Node Driver** | `^7.7.0` | Official client with connection pooling and atomic operations |
| **MongoDB Atlas** | Cloud Multi-Region | Persistent document database for donations, pickups, notifications, and logs |
| **Groq SDK** | `^1.6.0` | Low-latency inference client for the conversational Foodie AI assistant |
| **Motion / Framer Motion** | `^14.0.0` / `^13.4.0` | Micro-interactions, smooth layout animations, and status transition indicators |
| **Recharts** | `^3.10.1` | Analytical charts for diverted waste, meal equivalents, and ESG impact |
| **jsPDF** | `^4.2.1` | Client-side vector PDF generation for donation receipts, handover certificates, and reports |
| **Web Push** | `^3.6.7` | Voluntary browser push notifications using standard VAPID authentication |
| **Lenis** | `^1.3.26` | Smooth page momentum scrolling |
| **Lucide React** | `^1.47.0` | Accessible and uniform vector iconography |
| **ESLint** | `^9` | Code style enforcement and static analysis |
| **Vercel** | Edge Network | Automated deployment, global CDN, and serverless compute |

---

## 🏗️ System Architecture

FoodWise is architected as a modular, full-stack Next.js web application with decoupled presentation portals, isolated serverless API route handlers, centralized data services, and resilient dual-mode persistence.

### System Architecture Flow Diagram

```mermaid
flowchart TD
    %% 1. Client Presentation Layer
    subgraph ClientLayer["1. Client Presentation Layer (Next.js 16 / React 19)"]
        direction TB
        subgraph Portals["Role-Specific Web Portals"]
            Household["🏠 Household Donors<br/><code>/household/*</code>"]
            Commercial["🏨 Hotels & Kitchens<br/><code>/hotel/*</code> & <code>/kitchen/*</code>"]
            NGO["🤝 Relief NGOs<br/><code>/ngo/*</code>"]
            Public["🌐 Public & Settings<br/><code>/</code>, <code>/login</code>, <code>/settings</code>"]
        end
        subgraph StateUI["Client State & UI Utilities"]
            AppContext["AppContext<br/>(Role Session, State Hydration)"]
            LangContext["LanguageContext<br/>(i18n: EN / HI / KN)"]
            FoodieWidget["Foodie AI Assistant<br/>(Floating LLM Widget)"]
            PDFGen["PDF Engine (jsPDF)<br/>(Receipts & Certificates)"]
        end
        Portals --> StateUI
    end

    %% 2. API Routes Layer
    subgraph APILayer["2. Serverless API Route Handlers (Next.js App Router)"]
        direction TB
        APIData["<code>/api/data</code><br/>State Bootstrap & Sync"]
        APISurplus["<code>/api/surplus</code><br/>Listings & Atomic Claims"]
        APIPickups["<code>/api/pickups</code><br/>Coordination & OTP Handover"]
        APINotif["<code>/api/notifications</code><br/>Alerts & Read Status"]
        APIComplaints["<code>/api/complaints</code> & <code>/api/feedback</code><br/>Quality Flags & Ratings"]
        APIAI["<code>/api/foodie-ai</code><br/>Groq LLM Proxy"]
        APIPush["<code>/api/push</code><br/>Web Push Subscriptions"]
        APIHealth["<code>/api/health</code><br/>System Liveness & DB Probe"]
    end

    %% 3. Application Logic & Service Layer
    subgraph Services["3. Application Logic & Service Layer (src/lib)"]
        direction TB
        DataService["dataService.ts<br/>(Data Abstraction & Atomic Ops)"]
        SmartMatch["smartMatching.ts<br/>(Locality & Urgency Matching)"]
        OTPLogic["OTP Handover State Machine<br/>(4-Digit Secure Verification)"]
        PushNotif["pushNotifications.ts<br/>(VAPID Web Push Delivery)"]
    end

    %% 4. Persistence & External Services
    subgraph PersistenceLayer["4. Persistence & External Services"]
        direction TB
        subgraph DBEngine["Data Persistence Engine"]
            MongoConn["mongodb.ts<br/>(Connection Pooling & Caching)"]
            MongoAtlas[("MongoDB Atlas Cloud<br/>Collections: donations, pickups,<br/>notifications, complaints, donors")]
            MemFallback[("In-Memory Fallback Cache<br/>(mockData.ts for Local Dev)")]
        end
        subgraph ExternalAPIs["External Cloud Integrations"]
            GroqCloud["Groq Cloud LLM API<br/>(openai/gpt-oss-20b)"]
            WebPushGateway["Browser Web Push Service<br/>(VAPID Protocol)"]
        end
    end

    %% Inter-layer relationships
    StateUI -->|HTTPS JSON Requests| APILayer
    APISurplus --> DataService
    APIPickups --> DataService
    APIData --> DataService
    APINotif --> DataService
    APIComplaints --> DataService
    APISurplus -.-> SmartMatch
    APIPickups -.-> OTPLogic
    APIPush --> PushNotif
    APIAI -->|Groq SDK| GroqCloud
    PushNotif -->|web-push| WebPushGateway
    DataService --> MongoConn
    MongoConn -->|Primary Cloud DB| MongoAtlas
    MongoConn -.->|Fallback if URI Unset| MemFallback
    APIHealth --> MongoConn
```

### Architectural Component Breakdown & Data Flow

1. **Client Presentation & State Layer (`src/app/`, `src/context/`)**:
   - **Role-Segmented Portals:** Tailored routing and workflows for Household Donors (`/household`), Commercial Kitchens & Hotels (`/hotel`, `/kitchen`), and Relief NGOs (`/ngo`).
   - **Centralized Client State:** `AppContext` manages active role switching, session caching via `localStorage`, and asynchronous synchronization with the backend API.
   - **Trilingual Localization:** `LanguageContext` provides instantaneous, zero-overhead switching between English, Hindi, and Kannada.
   - **Interactive Assistants:** The floating `FoodieAIWidget` provides role-tailored donation guidance and operational tips.

2. **Serverless API Layer (`src/app/api/`)**:
   - 10 modular Next.js route handlers process incoming HTTP requests and return typed JSON responses.
   - Handles route validation, input sanitization, and maps frontend actions to underlying service methods without exposing direct database handles to the client.

3. **Application Logic & Service Layer (`src/lib/`)**:
   - **`dataService.ts`:** Centralized business logic and data abstraction layer governing status transitions, timeline logging, and database operations.
   - **Atomic Concurrency Protection (`claimDonationAtomic`):** When multiple NGOs attempt to claim the same donation concurrently, `dataService` uses atomic conditional database queries (`findOneAndUpdate` checking `{ id, status: "AVAILABLE" }`). Only the first request succeeds; any conflicting attempt receives an HTTP 409 Conflict error.
   - **Deterministic Smart Matching (`smartMatching.ts`):** Calculates donation urgency scores based on perishable shelf-life windows and ranks partner proximity using geographic locality heuristics, without external map dependencies or live location tracking.
   - **Handover State Machine:** Enforces rigid linear progression (`AVAILABLE` → `ACCEPTED` → `COMPLETED`), preventing uncoordinated transitions and requiring 4-digit digital OTP verification at physical handover.

4. **Persistence & Resilience Layer (`src/lib/mongodb.ts`, `src/lib/mockData.ts`)**:
   - **MongoDB Atlas Integration:** Connects via the official MongoDB driver with global connection caching (`global._mongoClientPromise`) optimized for serverless function re-use.
   - **Automatic Local Fallback:** If `MONGODB_URI` is unconfigured during local development or offline evaluation, `dataService.ts` seamlessly runs on an in-memory dataset seeded from `mockData.ts`, ensuring zero setup friction.
   - **Third-Party Integrations:** Connects to Groq Cloud for LLM chat completion and standard Web Push servers for push notifications.

---

### 📁 Repository Directory Structure

```text
FoodWise/
│
├── public/                       # Static assets, branding, and service workers
│   ├── logo.png                  # FoodWise platform branding
│   ├── login-illustration.png    # Portal illustration asset
│   ├── fssai-logo.png            # Compliance reference badge
│   └── sw.js                     # Web Push service worker
│
├── scripts/                      # Automated test and operational scripts
│   ├── test-e2e-workflow.mjs     # SIH 2026 E2E operational verification suite
│   ├── seed-bengaluru.mjs        # Comprehensive Bengaluru seed dataset
│   └── audit-db.mjs              # MongoDB collection integrity auditor
│
├── src/
│   ├── app/                      # Next.js 16 App Router pages & API routes
│   │   ├── api/                  # 10 Serverless REST API route handlers
│   │   │   ├── complaints/       # Food quality incidents & reviews
│   │   │   ├── data/             # Initial state bootstrap & bulk sync
│   │   │   ├── donors/           # Registered food donors directory
│   │   │   ├── feedback/         # Partner ratings & feedback
│   │   │   ├── foodie-ai/        # Groq Cloud LLM proxy endpoint
│   │   │   ├── health/           # System liveness & MongoDB probe
│   │   │   ├── notifications/    # In-app alerts CRUD
│   │   │   ├── pickups/          # Scheduled pickups & OTP completion
│   │   │   ├── push/             # Web push subscription & testing
│   │   │   └── surplus/          # Surplus food listings & atomic claims
│   │   │
│   │   ├── household/            # Household donor portal (donate, track, impact)
│   │   ├── hotel/                # Commercial donor portal (surplus, pickups, impact)
│   │   ├── kitchen/              # Institutional kitchen portal (rankings, reports)
│   │   ├── ngo/                  # Relief NGO operations portal (claim, coordinate, verify)
│   │   ├── dashboard/            # Overview analytics layout
│   │   ├── login/                # Role-based credential/demo switcher
│   │   ├── settings/             # User preferences & notification toggles
│   │   ├── about/                # Platform background & mission
│   │   ├── contact/              # Support & inquiry channels
│   │   ├── privacy-policy/       # Data privacy guidelines
│   │   ├── terms/                # Platform terms of service
│   │   ├── layout.tsx            # Root layout with providers & Lenis scroll
│   │   └── page.tsx              # Public interactive landing page
│   │
│   ├── components/               # Modular UI components
│   │   ├── common/               # Badges, modals, cards, and buttons
│   │   ├── layout/               # Header, Footer, and RoleNav navigation
│   │   ├── ngo/                  # NGO-specific claim cards and pickup views
│   │   ├── providers/            # Client providers (Language, App, Lenis)
│   │   └── settings/             # Profile & notification configuration forms
│   │
│   ├── context/                  # Global React Context providers
│   │   ├── AppContext.tsx        # Central application state & localStorage sync
│   │   └── LanguageContext.tsx   # Trilingual translations (EN, HI, KN)
│   │
│   ├── lib/                      # Core business logic and integrations
│   │   ├── dataService.ts        # Data layer with atomic operations & collections
│   │   ├── mongodb.ts            # Serverless MongoDB connection pooler
│   │   ├── mockData.ts           # Demo seed data & in-memory fallback
│   │   ├── smartMatching.ts      # Locality distance & urgency algorithms
│   │   ├── pdfGenerator.ts       # Client-side jsPDF document builder
│   │   ├── pdfAssets.ts          # Embedded vector and base64 assets for PDF
│   │   ├── pushNotifications.ts  # Web-push helper utilities
│   │   ├── motion.ts             # Reusable Motion animation variants
│   │   └── types.ts              # Canonical TypeScript domain interfaces
│   │
│   └── types/                    # Ambient type definitions
│
├── .env.example                  # Safe environment variable template
├── .gitignore                    # Git ignore specifications
├── package.json                  # Dependencies, metadata, and npm scripts
├── package-lock.json             # Locked dependency tree
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Complete project documentation
```

## 🚀 Getting Started

Follow these steps to run FoodWise locally.

### Prerequisites

Install the following:

- Node.js compatible with the project's Next.js requirements.
- npm.
- Git.
- A MongoDB Atlas account for database persistence.
- A Groq Cloud API key for Foodie AI.

A code editor such as Visual Studio Code or Antigravity is recommended.

### 1. Clone the Repository

```bash
git clone https://github.com/nabeel05-ship-it/FoodWise.git
```

### 2. Navigate to the Project Directory

```bash
cd FoodWise
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

Add the following variables:

```env
# MongoDB
MONGODB_URI=
MONGODB_DB_NAME=foodwise

# Groq AI
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b

# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

#### MongoDB Configuration

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with appropriate permissions.
3. Configure network access.
4. Obtain the MongoDB Node.js driver connection string.
5. Set the connection string as the value of `MONGODB_URI`.

Example format:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/foodwise?retryWrites=true&w=majority
```

Replace the placeholders with your actual Atlas connection details.

#### Foodie AI Configuration

1. Access your Groq Cloud account.
2. Generate an API key.
3. Set it as `GROQ_API_KEY`.
4. Ensure `GROQ_MODEL` uses a model identifier supported by your account.

#### Push Notification Configuration

Browser push functionality requires a valid VAPID public/private key pair when enabled.

Keep the private key secret. Never commit `.env.local` or actual environment values to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open the application at:

**http://localhost:3000**

### 6. Run Automated Tests and Verification

FoodWise includes an end-to-end operational verification script (`scripts/test-e2e-workflow.mjs`):

```bash
npm run test
```

This automated suite validates:
1. Complete elimination of prohibited external live map dependencies.
2. Positive and boundary input validation (shelf-life, quantities, dietary metadata).
3. Concurrency protection and atomic claim operations under race conditions.
4. Rigid donation status lifecycle state machine (`AVAILABLE` → `ACCEPTED` → `COMPLETED`).
5. Safe rejection of invalid status transitions (e.g. attempting to jump straight to `COMPLETED`).
6. Food quality reporting and review-flagging workflows.

### 7. Seed Demonstration Data (Optional)

To seed a comprehensive Bengaluru donor and NGO distribution into MongoDB:

```bash
npm run db:seed
```

To audit database collection document counts and connection status:

```bash
npm run db:audit
```

### 8. Run Code Quality Checks & Production Build

Run static analysis:

```bash
npm run lint
```

Compile and validate the production bundle:

```bash
npm run build
```

---

## 🧪 Testing and Verification

Before deploying or submitting, verify the platform using both automated test scripts and manual checks.

### Automated Test Suite

```bash
# Execute the full E2E workflow and codebase constraint test suite
npm run test

# Also exercise the live API lifecycle (claim, wrong/right handover code, delivery)
# against a running local or staging server — never production
FOODWISE_BASE_URL=http://localhost:3000 npm run test
```

### Manual Verification Checklist

- [ ] Run `npm run test` and confirm all suites pass.
- [ ] Create a household donation (`/household/donate`).
- [ ] Create a restaurant or hotel donation (`/hotel/donate`).
- [ ] View available donations from the NGO dashboard (`/ngo/dashboard`).
- [ ] Claim an available donation and observe atomic claim lock.
- [ ] As the donor, enter a wrong handover code (rejected), then the volunteer's code (food marked collected).
- [ ] As the NGO, confirm delivery and verify the donation is completed.
- [ ] Submit a food quality issue report (`/ngo/complaints` or `/ngo/food-issues`).
- [ ] Verify notification count and toast triggers.
- [ ] Verify real impact calculations on the impact dashboard (`/ngo/impact`, `/hotel/impact`).
- [ ] Test PDF generation for donation receipts and certificates.
- [ ] Switch languages across English, Hindi, and Kannada.
- [ ] Test conversational guidance with Foodie AI (with or without a configured Groq key).
- [ ] Verify MongoDB persistence across page refreshes and server restarts.
- [ ] Run `npm run lint` with 0 errors.
- [ ] Run `npm run build` with 0 production build errors.

### Health Check

FoodWise includes a health-check endpoint.

When running locally, visit:

```text
http://localhost:3000/api/health
```

For the deployed application, visit:

**https://food-wise-henna.vercel.app/api/health**

Review the response to check application health and MongoDB connectivity.

A successful health check does not guarantee that every user workflow works correctly.

---

## ☁️ Deployment

FoodWise is deployed on **Vercel**.

### 🌐 Live URL

**https://food-wise-henna.vercel.app**

### Deployment Configuration

To deploy your own instance:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Verify MongoDB Atlas connectivity.
5. Deploy the application.
6. Review build and runtime logs.
7. Test the main donation workflows on the deployed URL.

### Required Environment Variables

Configure applicable variables under:

**Vercel → Project Settings → Environment Variables**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Optional database name override |
| `GROQ_API_KEY` | Foodie AI authentication |
| `GROQ_MODEL` | Optional AI model override |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Browser push subscriptions |
| `VAPID_PRIVATE_KEY` | Server-side push signing |

Use actual provider credentials in deployment settings. Never add secrets to this README.

MongoDB Atlas network access must also permit the deployed application to connect to the database.

---

## 🔐 Security and Limitations

FoodWise is a software prototype intended for demonstration, evaluation, and continued development.

### Authentication and Authorization

The current authentication/session approach uses client-side role state and local storage rather than a complete production-grade authentication system with cryptographically verified server sessions.

Additional server-side authentication and authorization controls are necessary before using the platform for sensitive real-world operations.

### Data Persistence

MongoDB-backed persistence requires a valid connection string and correct configuration.

If the application uses its in-memory fallback, data may be lost when the server process restarts. Shared application data should be verified against MongoDB before relying on its persistence.

### Food Safety

FoodWise facilitates donation coordination but does not guarantee that donated food is safe to consume.

Donors and recipient organizations must follow applicable food safety, storage, transportation, and handling requirements.

### AI Limitations

Foodie AI may produce inaccurate responses. Its output should not be treated as professional food safety advice.

### Production Readiness

Before production use, the application should undergo a security review, stronger authentication implementation, API authorization testing, privacy assessment, and end-to-end workflow verification.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Secure authentication and session management.
- More comprehensive server-side authorization.
- Enhanced donation matching and recommendations.
- Improved food quality traceability.
- Advanced reporting and analytics.
- More reliable notification delivery.
- Accessibility improvements.
- Expanded automated testing.
- Integrations with institutional kitchens and food service systems.
- Improved monitoring, backup, and recovery procedures.

These are potential enhancements and are not claims of already implemented functionality.

---

## 🌱 Expected Impact

FoodWise aims to support a more efficient and coordinated approach to surplus food redistribution.

The platform seeks to:

- Reduce avoidable food waste.
- Improve the visibility of available surplus food.
- Simplify donation and collection coordination.
- Support timely food redistribution.
- Improve transparency in donation workflows.
- Encourage responsible food management.
- Support NGOs working to address food insecurity.

Actual impact depends on user adoption, operational execution, food suitability, and successful completion of donation workflows.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the available lint and build checks.
5. Submit a pull request with a clear description of your changes.

Please avoid committing secrets, confidential information, or unrelated generated files.

---

## 👨‍💻 Project Information

| Field | Details |
|---|---|
| Project Name | FoodWise |
| Official Problem Statement | Food Waste Reduction and Food Donation Platform |
| Problem Description | Develop a platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted. |
| Domain | Food Waste Reduction and Food Donation |
| Application Type | Full-Stack Web Application |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Database | MongoDB |
| AI Integration | Groq |
| Deployment | Vercel |

### 🔗 Important Links

- **Live Application:** https://food-wise-henna.vercel.app
- **GitHub Repository:** https://github.com/nabeel05-ship-it/FoodWise
- **MongoDB Atlas:** https://www.mongodb.com/atlas
- **Groq Cloud:** https://console.groq.com/
- **Vercel:** https://vercel.com/

---

## 📄 License

No open-source license has been specified in this README.

Unless a license is added to the repository, users should not assume that the project is available for unrestricted reuse, redistribution, or commercial use.

---

<div align="center">

## 🌱 FoodWise

### Less Waste. More Nourishment. Stronger Communities.

**Connecting surplus food with the organizations working to get it to people in need.**

[**Visit FoodWise →**](https://food-wise-henna.vercel.app)

</div>
