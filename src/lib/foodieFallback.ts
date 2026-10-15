/**
 * Built-in Foodie AI answers used when the Groq model is unavailable (no API key,
 * network or quota errors). Answers describe only what FoodWise actually does.
 */

type Role = "HOTEL" | "HOUSEHOLD" | "NGO" | string | undefined;

interface Intent {
  keywords: RegExp;
  answer: (role: Role) => string;
}

const isNgo = (role: Role) => String(role).toUpperCase() === "NGO";

const INTENTS: Intent[] = [
  {
    keywords: /\b(otp|code|handover|hand over|pickup code|verify)\b/i,
    answer: (role) =>
      isNgo(role)
        ? "When you claim a donation, FoodWise issues a 4-digit handover code. It's shown on your Accepted Donations tab and the pickup hub.\n\n1. Share the code with your volunteer driver.\n2. At pickup, the volunteer shows the code to the donor, who enters it in their portal.\n3. Once it matches, the status moves to PICKUP and you can press **Mark Delivered** after the food reaches the shelter.\n\nThe code coordinates the handover; it doesn't verify identity or certify food safety."
        : "When an NGO claims your donation, its volunteer receives a 4-digit handover code.\n\n1. At pickup, ask the volunteer for the code.\n2. Enter it under **Enter the volunteer's 4-digit handover code** on your dashboard, Pickups page or the donation's details.\n3. If it matches, the food is marked as collected. The NGO then confirms delivery, which completes the donation.\n\nA wrong code is rejected, so only hand over food after it's verified.",
  },
  {
    keywords: /\b(claim|accept|request food|find food|live feed)\b/i,
    answer: () =>
      "NGOs claim food from **Find Food** (the live feed) or the dashboard:\n\n1. Review the listing's quantity, diet, deadline and match score.\n2. Press **Claim**, choose a volunteer driver and destination shelter, and confirm.\n3. FoodWise reserves the donation for your NGO (status ACCEPTED), issues a 4-digit handover code and notifies the donor.\n\nListings past their pickup deadline can't be claimed, and a donation can only be claimed by one NGO.",
  },
  {
    keywords: /\b(match|score|urgent|urgency|critical|priority|expire|expired|deadline)\b/i,
    answer: () =>
      "The live feed is ordered by urgency: **Critical** (under 2 hours to the pickup deadline), **Urgent** (up to 5 hours) and **Safe buffer** (more time). Expired listings can't be claimed.\n\nThe match score (50–99) is rule-based: a base of 75, plus points for an urgent pickup window, a batch size of 10–100 kg, cooked or shelf-stable food, vegetarian/vegan/Jain diets, and whether the pickup is inside your coverage area. It's guidance to help you decide, not a guarantee of suitability.",
  },
  {
    keywords: /\b(quality|spoil|spoiled|smell|contaminat|report|issue|complain|unsafe|bad food)\b/i,
    answer: () =>
      "If donated food looks unsafe, don't distribute it. Use **Food Issues → Report Food Issue**:\n\n1. Pick the issue type (e.g. spoiled food, damaged packaging, mismatch with the listing).\n2. Set severity (Low, Medium or High) and describe what you saw; add a photo if you can.\n3. Medium or High reports flag the donation for review (FLAGGED_FOR_REVIEW).\n\nReports then move through **Reported → Under review → Resolved** on the Food Issues page. FoodWise records concerns; it doesn't certify food safety.",
  },
  {
    keywords: /\b(rate|rating|points|tier|rank|leaderboard|feedback|platinum|gold|silver|bronze)\b/i,
    answer: () =>
      "NGOs rate donors on food quality, packaging, timeliness and quantity (1–5 stars each) from **Feedback & Rankings**. The average earns points: 85 for 4.5+, 70 for 4.0+, 55 for 3.5+, 40 for 3.0+, 25 for 2.0+, otherwise 10.\n\nPoints build donor tiers: **Silver** at 500, **Gold** at 2,000 and **Platinum** at 5,000.",
  },
  {
    keywords: /\b(impact|co2|co₂|carbon|emission|meals served|servings|certificate|pdf|report download|receipt)\b/i,
    answer: () =>
      "Your **Impact** page totals completed donations: food diverted (kg), estimated servings and estimated CO₂e avoided (about 2.5 kg per kg of food). These are estimates from FoodWise records, not audited figures.\n\nYou can download PDFs for donation records, impact reports and appreciation certificates from the Impact page and from each donation's details.",
  },
  {
    keywords: /\b(cancel|delete|withdraw|remove)\b/i,
    answer: () =>
      "Donors can cancel a listing while it's still open (AVAILABLE) or claimed but not yet collected (ACCEPTED). Open the donation's details (from your dashboard or **My Donations**) and choose **Cancel listing**, then confirm. Once the handover code has been verified, the donation can no longer be cancelled.",
  },
  {
    keywords: /\b(language|hindi|kannada|english|translate)\b/i,
    answer: () =>
      "FoodWise is available in English, हिंदी (Hindi) and ಕನ್ನಡ (Kannada). Use the language switch in the sidebar, the top header, the sign-in card or Settings. Your choice is remembered on this device.",
  },
  {
    keywords: /\b(notification|alert|push|notify)\b/i,
    answer: () =>
      "The bell opens your notifications: new listings, claims, verified handovers, deliveries and quality reports. You can mark them as read individually or all at once, and allow browser push notifications when FoodWise asks, where your browser supports them.",
  },
  {
    keywords: /\b(donate|donation|list|post|surplus|share food|leftover)\b/i,
    answer: (role) =>
      String(role).toUpperCase() === "HOUSEHOLD"
        ? "To share food from home, open **Donate Food**:\n\n1. Describe the dish, its weight (kg) and roughly how many people it serves.\n2. Choose the diet, any allergens and how it's stored.\n3. Set the pickup deadline and address, then publish.\n\nYour listing becomes AVAILABLE and nearby NGOs are notified. Track it under **My Donations**."
        : "To post surplus, open **Donate Food**:\n\n1. Add the food item, total weight (kg) and estimated servings.\n2. Choose diet, allergens, holding method (ambient, chilled, frozen or hot) and packaging.\n3. Set the pickup deadline, gate/dock location and instructions.\n4. Confirm the food-safety declaration and publish.\n\nThe listing goes live (AVAILABLE) and NGOs are notified. Presets on the form help you post common batches quickly.",
  },
];

export function getFallbackAnswer(lastUserMessage: string, role: Role): string {
  const intent = INTENTS.find((i) => i.keywords.test(lastUserMessage));
  if (intent) return intent.answer(role);

  if (/\b(hi|hello|hey|namaste|help)\b/i.test(lastUserMessage)) {
    return "Hi! I'm Foodie AI. I can help with posting surplus food, claiming donations, the 4-digit handover code, reporting food issues, donor ratings and your impact dashboard. What would you like to do?";
  }

  return "I can help with FoodWise tasks: posting surplus food, finding and claiming donations, the pickup handover code, reporting food quality issues, donor ratings and points, impact figures and PDF records, and switching languages. Could you tell me which of these you need?";
}
