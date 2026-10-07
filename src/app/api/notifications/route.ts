import { NextResponse } from "next/server";
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/dataService";

// GET all notifications
export async function GET() {
  try {
    const notifications = await getNotifications();
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
    const notification = await createNotification(body);
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

    if (body.markAllRead) {
      await markAllNotificationsAsRead();
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (body.notifId) {
      await markNotificationAsRead(body.notifId);
      return NextResponse.json({ success: true, message: `Notification ${body.notifId} marked as read` });
    }

    return NextResponse.json({ error: "Provide notifId or markAllRead" }, { status: 400 });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
