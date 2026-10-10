<div align="center">

# 🌱 FoodWise

## Food Waste Reduction and Food Donation Platform

**Connecting Surplus Food with Communities in Need.**

A technology-driven platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted.

<br>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AI Powered](https://img.shields.io/badge/AI-Groq-F55036)](https://groq.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com/)

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

Food waste and food insecurity are two interconnected challenges. Restaurants, hotels, banquet halls, and households often have surplus food, while NGOs and charitable organizations work to provide meals to people in need.

However, the lack of efficient coordination between food donors and recipient organizations can make timely food redistribution difficult.

**FoodWise is a web-based food donation platform designed to bridge this gap.**

It provides a centralized digital space where food donors can list their surplus food, NGOs can discover and claim available donations, and both parties can coordinate collection and delivery.

The platform aims to simplify food donation, improve coordination, support responsible food management, and help reduce avoidable food waste.

### 🎯 Our Mission

To make surplus food donation easier, faster, and more accessible by connecting food donors with NGOs through a centralized digital platform.

### 💡 Our Vision

A future where surplus food is recognized as an opportunity to support communities rather than becoming unnecessary waste.

---

## ✨ Key Features

### 🏠 1. Household Food Donations

Households can share surplus food with organizations that redistribute meals to communities in need.

Features include:
- Simple food donation forms.
- Food quantity and category information.
- Pickup deadline management.
- Dietary and handling information.
- Quick-donation options.

### 🏨 2. Restaurant and Hotel Donations

Restaurants, hotels, banquet halls, and institutional kitchens can list surplus food generated during their operations.

Features include:
- Structured surplus food listings.
- Bulk food quantity management.
- Food holding and storage information.
- Collection deadlines.
- Loading dock and pickup instructions.
- Dietary and allergen information.

The objective is to make surplus food available to recipient organizations through a structured donation workflow.

### 🤝 3. NGO Dashboard

NGOs can use a dedicated portal to manage food donation and collection activities.

Features include:
- View available food donations.
- Review donation details.
- Claim suitable donations.
- Coordinate pickups.
- Manage scheduled collections.
- Track donation status.
- Record completed deliveries.
- Report food quality concerns.

### 🧠 4. Smart Donation Matching

FoodWise includes a rule-based matching system that helps users evaluate available food donations.

Matching considerations include:
- Food quantity.
- Pickup urgency.
- Dietary compatibility.
- Collection requirements.

The matching system supports decision-making by helping NGOs identify potentially suitable donations. Matching scores do not guarantee food suitability or safety.

### ⏱️ 5. Donation Lifecycle Management

FoodWise supports structured donation status tracking throughout the redistribution process.

Typical states include:

- `AVAILABLE`
- `ACCEPTED`
- `PICKUP`
- `COMPLETED`
- `CANCELLED`
- `FLAGGED_FOR_REVIEW`

The application validates important status transitions to support a consistent donation workflow.

Database-level atomic operations are implemented to help prevent multiple NGOs from claiming the same available donation simultaneously when MongoDB-backed persistence is active.

### 🔐 6. Digital Handover Verification

FoodWise includes a four-digit digital OTP workflow to support the handover of donated food.

The process helps coordinate the transfer between the donor and the receiving organization.

The OTP supports handover verification but does not independently establish participant identity or certify food safety.

### 🥗 7. Food Quality Reporting

NGOs can report concerns identified during food collection or handling.

The reporting workflow supports:
- Food quality issue descriptions.
- Packaging and storage concerns.
- Severity information.
- Supporting evidence where available.
- Donation flagging and review workflows.

This feature supports transparency and accountability during redistribution.

### 🤖 8. Foodie AI Assistant

Foodie AI is an AI-powered assistant integrated using the Groq SDK.

It provides contextual guidance based on the user's role and the platform workflow.

It can assist with:
- Understanding platform features.
- Navigating donation workflows.
- Creating surplus food listings.
- Understanding NGO collection procedures.
- Interpreting donation statuses.
- Accessing operational guidance.

**Important:** Foodie AI does not certify food as safe to consume and does not replace qualified food safety professionals. Food quality concerns should be reported through the platform's designated reporting workflow.

### 🌐 9. Multilingual Support

FoodWise includes interface support for:

- English
- Hindi
- Kannada

The multilingual interface is designed to improve accessibility for users from different linguistic backgrounds.

### 📊 10. Impact Dashboard

The impact dashboard summarizes food redistribution activity using application records.

Supported metrics include:
- Food weight recorded as diverted.
- Estimated servings.
- Completed donation activities.
- Donor participation.
- Estimated environmental impact.

Impact figures depend on the available records and calculation assumptions. They should not be interpreted as independently audited environmental or social impact measurements.

### 📄 11. PDF Reports and Certificates

FoodWise includes PDF generation functionality for supported documents, such as:

- Donation records.
- Donation receipts.
- Certificates.
- Impact reports.

These documents help users maintain records of donation activities.

### 🔔 12. Notifications and User Settings

The platform includes:
- In-app notifications.
- Notification status management.
- Role-specific navigation.
- Profile and facility settings.
- Donation and pickup status updates.
- Browser push notification functionality when correctly configured.

### 💾 13. Database Integration

FoodWise includes a MongoDB integration layer for supported application data.

The application also contains an in-memory fallback for prototype scenarios where a database connection is unavailable.

For durable shared data, MongoDB must be correctly configured and the relevant application workflows must be using the database-backed persistence layer.

---

## 🔄 How FoodWise Works

The platform follows a structured food donation and redistribution workflow.

```text
       ┌─────────────────────────┐
       │       FOOD DONORS       │
       │                         │
       │ Households, Restaurants │
       │ Hotels and Kitchens     │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │  LIST SURPLUS FOOD      │
       │                         │
       │ Quantity, Details and   │
       │ Collection Deadline     │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │      NGO DASHBOARD      │
       │                         │
       │ Discover and Review     │
       │ Available Donations     │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │   CLAIM & COORDINATE    │
       │                         │
       │ Schedule Food Pickup    │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │   DIGITAL HANDOVER      │
       │                         │
       │ Four-Digit OTP Workflow │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │   DELIVERY COMPLETION   │
       │                         │
       │ Update Donation Status  │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │  IMPACT & REPORTING     │
       │                         │
       │ Track Records and       │
       │ Report Quality Issues   │
       └─────────────────────────┘
```

### The Workflow

1. A household, restaurant, or hotel lists surplus food.
2. The donation becomes available for NGO discovery.
3. An NGO reviews the listing and claims the donation.
4. Collection details and pickup arrangements are coordinated.
5. The handover workflow supports digital OTP verification.
6. The NGO records delivery completion.
7. The completed donation contributes to the applicable impact records.
8. Food quality concerns can be submitted through the reporting module.

---

## 🛠️ Technology Stack

FoodWise uses modern web technologies to deliver its user interface, application logic, database integration, and AI-assisted functionality.

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack React framework and API routes |
| React 19 | Interactive user interface |
| TypeScript | Type safety and maintainable code |
| Tailwind CSS v4 | Responsive styling |
| MongoDB Atlas | Cloud database and persistent storage |
| MongoDB Node.js Driver | Database connectivity and operations |
| Groq SDK | AI assistant integration |
| Motion | UI animations and transitions |
| Recharts | Data visualization |
| jsPDF | PDF document generation |
| Lucide React | Interface icons |
| Web Push | Browser push notification functionality |
| ESLint | Code quality checks |
| Vercel | Application deployment |

---

## 🏗️ Project Architecture

FoodWise separates its user interface, shared application state, business logic, and database access into organized modules.

```text
FoodWise/
│
├── public/
│   └── Static assets
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── complaints/
│   │   │   ├── donors/
│   │   │   ├── feedback/
│   │   │   ├── foodie-ai/
│   │   │   ├── health/
│   │   │   ├── notifications/
│   │   │   ├── pickups/
│   │   │   ├── push/
│   │   │   └── surplus/
│   │   │
│   │   ├── household/
│   │   ├── hotel/
│   │   ├── ngo/
│   │   ├── login/
│   │   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── ngo/
│   │   └── providers/
│   │
│   ├── context/
│   │   ├── AppContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── locales/
│   │
│   ├── lib/
│   │   ├── dataService.ts
│   │   ├── mongodb.ts
│   │   ├── mockData.ts
│   │   ├── smartMatching.ts
│   │   ├── pdfGenerator.ts
│   │   ├── pushNotifications.ts
│   │   └── types.ts
│   │
│   └── types/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

*This is a simplified overview. The actual directory structure may change as development continues.*

---

## 🚀 Getting Started

Follow the instructions below to run FoodWise on your local machine.

### Prerequisites

Ensure that you have installed:

- Node.js compatible with the project's Next.js version.
- npm.
- Git.
- A MongoDB Atlas account for database persistence.
- A Groq Cloud API key for Foodie AI.

A code editor such as Visual Studio Code or Antigravity is recommended.

### 1. Clone the Repository

```bash
git clone https://github.com/nabeel05-ship-it/FoodWise.git
```

### 2. Navigate to the Project

```bash
cd FoodWise
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Add the following configuration:

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

#### MongoDB Setup

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with appropriate permissions.
3. Configure network access for your development environment.
4. Copy your MongoDB connection string.
5. Set it as the value of `MONGODB_URI`.

Use the following format as a reference:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/foodwise?retryWrites=true&w=majority
```

Replace the placeholders with your actual database credentials.

#### Foodie AI Setup

1. Create or access your Groq Cloud account.
2. Generate an API key.
3. Add the key to `GROQ_API_KEY`.
4. Ensure that the configured model identifier is supported by your Groq account.

#### Push Notifications

Browser push functionality requires a valid VAPID public/private key pair when enabled.

Keep `VAPID_PRIVATE_KEY` secret. Never commit your actual environment values to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open:

**http://localhost:3000**

The application should now be accessible locally.

### 6. Run Quality Checks

Run ESLint:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

Resolve build errors before deploying the application.

---

## 🧪 Testing and Verification

Before sharing a deployment, verify the main application workflows.

### Recommended Checklist

- [ ] Household donation creation.
- [ ] Restaurant and hotel donation creation.
- [ ] NGO donation discovery.
- [ ] Donation claiming and status transitions.
- [ ] Pickup coordination.
- [ ] Digital handover OTP workflow.
- [ ] Delivery completion.
- [ ] Food quality issue reporting.
- [ ] Impact dashboard calculations.
- [ ] PDF generation.
- [ ] Language switching.
- [ ] Foodie AI functionality.
- [ ] Notifications.
- [ ] MongoDB persistence.
- [ ] Responsive layout.
- [ ] Production build.

### Application Health Check

The application includes a health-check endpoint.

When the local application is running, visit:

```text
http://localhost:3000/api/health
```

Review the response to check application health and database connectivity.

A successful health check does not, by itself, guarantee that every feature is working correctly.

---

## ☁️ Deployment

FoodWise can be deployed on [Vercel](https://vercel.com/).

### Deployment Steps

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Import the FoodWise repository.
4. Configure the required environment variables.
5. Verify MongoDB Atlas connectivity.
6. Deploy the application.
7. Inspect the deployment logs.
8. Test the main donation workflows on the deployed URL.

### Environment Variables

Configure the applicable variables in:

**Vercel → Project Settings → Environment Variables**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection |
| `MONGODB_DB_NAME` | Optional database name |
| `GROQ_API_KEY` | Foodie AI |
| `GROQ_MODEL` | AI model configuration |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Browser push subscriptions |
| `VAPID_PRIVATE_KEY` | Server-side push signing |

Use real provider credentials in the deployment settings, not in this README.

After deployment, verify the health endpoint:

```text
https://YOUR-DOMAIN.vercel.app/api/health
```

Replace `YOUR-DOMAIN` with your actual deployment domain.

---

## 🔐 Security and Limitations

FoodWise is a software prototype intended for demonstration, evaluation, and further development.

### Authentication

The current authentication approach uses client-side role/session state and local storage rather than a complete production-grade authentication system with cryptographically verified server sessions.

Additional server-side authentication and authorization controls are needed before the platform is used for sensitive real-world operations.

### Data Persistence

MongoDB-backed persistence requires a valid connection string and correct database configuration.

When the in-memory fallback is used, data may be lost when the server process restarts. Do not assume that all application data is persistent unless the relevant workflow has been verified against MongoDB.

### Food Safety

FoodWise facilitates coordination; it does not guarantee that donated food is safe to consume.

Donors and recipient organizations must follow applicable food safety, storage, transportation, and handling requirements.

### AI Limitations

Foodie AI provides informational assistance and may produce inaccurate responses. Its output should not be treated as professional food safety advice.

### Demonstration Data

Sample records, where present, are intended for demonstration. They should not be interpreted as verified real-world donation transactions.

### Production Readiness

Before production use, the application should undergo a security review, stronger authentication implementation, API authorization testing, privacy assessment, and end-to-end workflow verification.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Stronger authentication and secure session management.
- More comprehensive server-side access controls.
- Enhanced donation matching and recommendation capabilities.
- Improved food quality traceability.
- Expanded reporting and analytics.
- More reliable notification delivery.
- Accessibility improvements.
- Additional automated tests.
- Institutional kitchen and food service integrations.
- Improved monitoring, backups, and recovery procedures.

These are potential enhancements, not claims that the functionality is already implemented.

---

## 🌱 Expected Impact

FoodWise aims to support a more efficient and coordinated approach to surplus food redistribution.

By connecting food donors with NGOs, the platform seeks to:

- Reduce avoidable food waste.
- Improve the discoverability of available surplus food.
- Simplify donation and collection coordination.
- Support timely food redistribution.
- Improve visibility into donation activities.
- Encourage responsible food management.
- Support community organizations working to address food insecurity.

The actual impact depends on adoption, operational execution, food suitability, and successful completion of donation workflows.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Implement your changes.
4. Run the available lint and build checks.
5. Submit a pull request describing your changes.

Please avoid committing secrets, confidential information, or unrelated generated files.

---

## 👨‍💻 Project Information

| Field | Details |
|---|---|
| Project Name | FoodWise |
| Official Problem Statement Title | Food Waste Reduction and Food Donation Platform |
| Problem Statement | Develop a platform connecting restaurants, hotels, and households with NGOs to donate surplus food before it is wasted. |
| Domain | Food Waste Reduction and Food Donation |
| Application Type | Full-Stack Web Application |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Database | MongoDB |
| AI Integration | Groq |
| Deployment Platform | Vercel |

### Repository

[**FoodWise — GitHub Repository**](https://github.com/nabeel05-ship-it/FoodWise)

---

## 📄 License

No open-source license has been specified in this repository's README.

Unless a license is added, users should not assume that the project is available for unrestricted reuse, redistribution, or commercial use.

---

<div align="center">

## 🌱 FoodWise

**Reducing Food Waste. Connecting Donors. Supporting Communities.**

*A digital approach to making surplus food donation more accessible and coordinated.*

</div>
