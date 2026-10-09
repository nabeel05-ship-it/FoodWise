# Foodie AI Integration Documentation

## Architecture

Foodie AI is built as a small role-aware helper widget inside the FoodWise platform.

1. **Frontend Widget**: A single reusable React component (`src/components/common/FoodieAIWidget.tsx`) embedded globally via `src/app/layout.tsx`. It handles the UI, chat history state, suggested questions, and dynamic context (current user role and page path).
2. **Server-Side API**: A Next.js API route (`src/app/api/foodie-ai/route.ts`) acts as a secure proxy to the Groq API. It applies a strong, role-specific system prompt and keeps secrets completely server-side.
3. **LLM Backend**: Powered by Groq using the `groq-sdk` package.

## Environment Setup

To run Foodie AI locally, you **must** supply an API key from Groq. 

Create a `.env.local` file at the root of your project if it doesn't already exist and add:

```env
# REQUIRED: Your private Groq API key
GROQ_API_KEY=your-api-key-here

# OPTIONAL: The Groq model to use (defaults to 'openai/gpt-oss-20b')
GROQ_MODEL=openai/gpt-oss-20b
```

**Security Warning**: Never commit `.env.local` to GitHub. The API key must remain strictly server-side.

## Role-Aware Behavior
Foodie AI automatically extracts the logged-in user's role from the application's React Context (`userRole` inside `AppContext`). This context, alongside the active URL path (`pathname`), is securely sent to the backend.

The backend dynamically adjusts the system prompt depending on whether the user is a:
- **Household Donor**
- **Restaurant / Hotel / Banquet Donor**
- **NGO / Relief Partner**

This ensures answers remain localized to their workflows (e.g., small donations vs bulk banquets vs receiving food).

## Safety Restrictions
- Foodie AI does **not** modify application state (it cannot accept donations, reject them, or alter profile data).
- Foodie AI does **not** evaluate food safety based on descriptions or images. It specifically redirects users to the manual "Report Food Issue" functionality.
- AI-generated responses are clearly marked in the UI to set proper expectations.

## How to Test
1. Add your `GROQ_API_KEY` to `.env.local`.
2. Start the development server using `npm run dev`.
3. Log in as any role (e.g., Household or NGO).
4. Look for the floating "🍃 Foodie AI" button in the bottom right corner of authenticated pages.
5. Click it and test a role-specific question!
