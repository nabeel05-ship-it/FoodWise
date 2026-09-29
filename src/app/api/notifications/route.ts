import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all notifications
export async function GET() {
  try {
    const db = await getDb();
    const notifications = await db.collection("notifications").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST a new notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const notification = {
      notifId: body.notifId || `notif-${Date.now()}`,
      title: body.title,
      message: body.message,
      time: body.time || "Just now",
      severity: body.severity || "info",
      category: body.category || "Kitchen",
      actionLabel: body.actionLabel,
      actionUrl: body.actionUrl,
      read: false,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    await db.collection("notifications").insertOne(notification);
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error("Notifications POST error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

// PATCH — mark notification as read or mark all as read
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    if (body.markAllRead) {
      await db.collection("notifications").updateMany({}, { $set: { read: true } });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (body.notifId) {
      await db.collection("notifications").updateOne(
        { notifId: body.notifId },
        { $set: { read: true } }
      );
      return NextResponse.json({ success: true, message: `Notification ${body.notifId} marked as read` });
    }

    return NextResponse.json({ error: "Provide notifId or markAllRead" }, { status: 400 });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
