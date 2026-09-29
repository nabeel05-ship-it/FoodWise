import webPush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const privateKey = process.env.VAPID_PRIVATE_KEY || "";

if (publicKey && privateKey) {
  webPush.setVapidDetails("mailto:ops@foodwise.org", publicKey, privateKey);
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
    console.warn("VAPID keys not configured — skipping push");
    return { sent: 0, failed: 0 };
  }

  const { getDb } = await import("@/lib/mongodb");
  const db = await getDb();
  const subscriptions = await db.collection("pushSubscriptions").find({}).toArray();

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(
        sub.subscription as webPush.PushSubscription,
        JSON.stringify(payload)
      );
      sent++;
    } catch (err: unknown) {
      failed++;
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 410 || statusCode === 404) {
        await db.collection("pushSubscriptions").deleteOne({ _id: sub._id });
      }
    }
  }

  return { sent, failed };
}
