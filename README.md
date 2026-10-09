# FoodWise — Smart Surplus Food Reduction & Sustainable Redistribution Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-green)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20SDK-orange)](https://groq.com/)
[![SDG 2](https://img.shields.io/badge/SDG%202-Zero%20Hunger-red)](https://sdgs.un.org/goals/goal2)
[![SDG 12](https://img.shields.io/badge/SDG%2012-Responsible%20Consumption-darkgreen)](https://sdgs.un.org/goals/goal12)

---

## 1. Problem Statement (SIH 2026)

> **"AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem for Institutional Kitchens and Food Processing Units."**

The objective of FoodWise is to reduce edible food waste by seamlessly connecting surplus food sources — including restaurants, commercial kitchens, hotel buffets, banquet halls, institutional kitchens, and households — with authorized NGOs and relief partners who collect and redistribute fresh surplus food to communities in need.

### Core Program & Sustainable Development Objectives:
- **SDG 2 (Zero Hunger):** Channel wholesome edible surplus to relief shelters, food banks, and underserved communities.
- **SDG 12 (Responsible Consumption & Production):** Prevent commercial and institutional food waste from decomposing in landfills, lowering municipal methane emissions.

---

## 2. Platform Architecture & Portals

FoodWise is built as a unified, full-stack multi-portal sustainability platform:

| Portal | Audience | Key Capabilities |
| :--- | :--- | :--- |
| **Household Portal** (`/household`) | Families & residential donors | Quick home surplus posting, doorstep pickup scheduling, dietary categorization, and family impact ledger. |
| **Restaurant/Hotel/Banquets** (`/hotel`) | Commercial restaurants, hotels, & event caterers | High-volume buffet rescue, FSSAI holding logs, vehicle capacity recommendations, & ESG metrics. |
| **NGO & Relief Partner Hub** (`/ngo`) | Verified NGOs & relief fleets | Real-time surplus feed, deterministic smart matching, urgency countdown badges, claim lock, handover OTP verification, delivery confirmation, and quality issue tracking. |

---

## 3. Key High-Value Features

### Feature A — Operational Pickup & Logistics Hub
A text-based logistics interface replacing obsolete live map rendering. Features:
- Exact donor facility address, service gate, and loading dock instructions.
- Authorized contact person and click-to-call mobile integration.
- Temperature holding standards (Hot Holding `>60°C`, Refrigerated `<4°C`, Ambient).
- Digital 4-digit handover verification OTP to confirm custody transfer.
- One-click handover verification and delivery logging.

### Feature B — Smart Donation Matching
A transparent, deterministic matching engine (`src/lib/smartMatching.ts`) that scores donation suitability (0–100%) for NGOs based on:
- Batch quantity vs. NGO distribution capacity.
- Food category compatibility.
- Transit safety window and shelf-life buffer.
- Storage condition requirements.

### Feature C — Expiry & Urgency Management
Every donation evaluates live urgency against its safe consumption threshold:
- **CRITICAL (<2h remaining):** Highlighted with countdown warnings for immediate rescue.
- **URGENT (2–5h remaining):** Priority collection status.
- **STANDARD (>5h remaining):** Routine redistribution window.
- **EXPIRED:** Automatically locked from claims to prevent unsafe food distribution.

### Feature D — Real-Time Redistribution Impact Ledger
Calculates live metrics exclusively from persisted, verified donation records:
- **Food Diverted from Landfill:** Direct net weight (kg) of completed redistributions.
- **Wholesome Portions Provided:** Sum of recorded adult meal portions served.
- **Avoided GHG Emissions:** Benchmarked using UNEP / FAO Food Waste Index (~2.5 kg CO₂e avoided per 1 kg of food diverted).
- **Completion Rate:** Verified successful handovers over total registered donations.

### Feature E — Concurrency Protection (Atomic Claims)
To prevent race conditions when multiple NGOs attempt to claim the same donation simultaneously, FoodWise enforces atomic state transitions at the database level (`findOneAndUpdate({ id, status: "AVAILABLE" })`). Duplicate attempts immediately return `409 Conflict`.

### Feature F — Food Quality & Issue Reporting
Post-receipt quality feedback workflow allowing NGOs to file reports with severity ratings (`LOW`, `MEDIUM`, `HIGH`), issue categories (spoiled food, packaging breach, temperature violation), and photo evidence, automatically appending a flag and timeline event to the donation record.

### Feature G — Donation Traceability (Chain of Custody)
Every donation maintains an immutable audit trail of operational milestones:
`CREATED` → `ACCEPTED` → `SCHEDULED` → `COLLECTED` → `DELIVERED` (and `QUALITY_ISSUE_REPORTED` if flagged).

### Feature H — Foodie AI (Powered by Groq)
Server-side AI assistant configured to guide users on listing surplus food, calculating portions, understanding storage conditions, and navigating the platform without making claims about certifying food safety.

---

## 4. Tech Stack

- **Framework:** Next.js 16.3.5 (App Router with Turbopack)
- **Frontend:** React 19.2.8, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Charts:** Recharts
- **Database:** MongoDB 7.7 (Native `MongoClient` with server connection pooling and idempotent collection seeding)
- **AI Integration:** Groq SDK (`openai/gpt-oss-20b`)
- **PDF Generation:** jsPDF for donor impact certificates

---

## 5. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# [REQUIRED] MongoDB Connection String (Atlas or local instance)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodwise?retryWrites=true&w=majority

# [REQUIRED for Foodie AI] Groq Cloud API Key (https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# [OPTIONAL] Groq Model identifier (defaults to openai/gpt-oss-20b)
GROQ_MODEL=openai/gpt-oss-20b
```

> **Security Note:** All credentials are strictly accessed on the server side. No private API keys or database connection strings are exposed in client bundles.

---

## 6. Installation & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database verification:**
   ```bash
   npm run db:audit
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Quality Assurance & Verification Commands

- **Typecheck:**
  ```bash
  npx tsc --noEmit
  ```
- **Lint Check:**
  ```bash
  npm run lint -- --quiet
  ```
- **Production Build:**
  ```bash
  npm run build
  ```
- **End-to-End Operational Verification:**
  ```bash
  node scripts/test-e2e-workflow.mjs
  ```

---

## 8. Deployment Steps (Vercel)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the Vercel dashboard, click **Add New Project** and select the FoodWise repository.
3. In **Environment Variables**, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string (ensure IP Access List in Atlas allows `0.0.0.0/0` for Vercel serverless functions).
   - `GROQ_API_KEY` = your Groq API key.
   - `GROQ_MODEL` = `openai/gpt-oss-20b` (or `llama-3.3-70b-versatile`).
4. Click **Deploy**. Vercel will build and launch FoodWise with zero additional configuration.
