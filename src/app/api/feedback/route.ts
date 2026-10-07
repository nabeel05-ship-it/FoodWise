import { NextResponse } from "next/server";
import { getFeedback, createFeedback } from "@/lib/dataService";

// GET all feedback entries
export async function GET() {
  try {
    const feedback = await getFeedback();
    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Feedback GET error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

// POST new feedback
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createFeedback(body);
    return NextResponse.json({
      success: true,
      data: result.feedback,
      pointsAwarded: result.pointsAwarded,
    });
  } catch (error) {
    console.error("Feedback POST error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
