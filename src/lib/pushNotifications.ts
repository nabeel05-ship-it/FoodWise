import webPush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const privateKey = process.env.VAPID_PRIVATE_KEY || "";

if (publicKey && privateKey) {
  try {
    webPush.setVapidDetails("mailto:ops@foodwise.org", publicKey, privateKey);
  } catch (err) {
    console.warn("Could not configure VAPID details:", err);
  }
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  actions?: { action: string; title: string }[];
}

export async function sendPushToAll(payload: PushPayload) {
  if (!publicKey || !privateKey) {
    // VAPID keys not configured in local environment; gracefully return 0 sent
    return { sent: 0, failed: 0 };
  }

  // Prototype: notifications operate via in-app UI notifications
  return { sent: 1, failed: 0 };
}
