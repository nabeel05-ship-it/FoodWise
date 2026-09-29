import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/pushNotifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      title: body.title || "FoodWise Alert",
      body: body.body || body.message || "New notification",
      url: body.url || "/",
      tag: body.tag || `fw-${Date.now()}`,
      actions: body.actions,
    };

    const result = await sendPushToAll(payload);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Push send error:", error);
    return NextResponse.json({ error: "Failed to send push" }, { status: 500 });
  }
}
