import { NextResponse } from "next/server";

// Temporary in-memory subscription store for local prototyping
const subscriptionsSet = new Set<string>();

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    subscriptionsSet.add(JSON.stringify(subscription));
    return NextResponse.json({ success: true, message: "Subscription registered locally" });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    for (const sub of subscriptionsSet) {
      if (sub.includes(endpoint)) {
        subscriptionsSet.delete(sub);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 });
  }
}
