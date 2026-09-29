import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET all feedback entries
export async function GET() {
  try {
    const db = await getDb();
    const feedback = await db.collection("donor_feedback").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Feedback GET error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

// POST new feedback + update hotel points
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const { hotelId, foodQuality, packaging, timeliness, quantity, comment } = body;

    // Calculate points
    const avg = (foodQuality + packaging + timeliness + quantity) / 4;
    let points = 10;
    if (avg >= 4.5) points = 85;
    else if (avg >= 4.0) points = 70;
    else if (avg >= 3.5) points = 55;
    else if (avg >= 3.0) points = 40;
    else if (avg >= 2.0) points = 25;

    const hotel = await db.collection("donor_hotels").findOne({ hotelId });
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Save feedback
    const feedbackEntry = {
      feedbackId: `fb-${Date.now()}`,
      hotelId,
      hotelName: hotel.name,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      foodQuality,
      packaging,
      timeliness,
      quantity,
      overallRating: Math.round(avg * 10) / 10,
      comment,
      pointsAwarded: points,
      createdAt: new Date(),
    };
    await db.collection("donor_feedback").insertOne(feedbackEntry);

    // Update hotel
    const newTotalRatings = (hotel.totalRatings || 0) + 1;
    const newAvgRating = Math.round(((hotel.avgRating * hotel.totalRatings + avg) / newTotalRatings) * 10) / 10;

    await db.collection("donor_hotels").updateOne(
      { hotelId },
      {
        $set: {
          totalPoints: (hotel.totalPoints || 0) + points,
          totalRatings: newTotalRatings,
          avgRating: newAvgRating,
          lastDonation: "Just now",
        },
      }
    );

    // Create notification
    await db.collection("notifications").insertOne({
      notifId: `notif-${Date.now()}`,
      title: `+${points} Points Awarded to ${hotel.name}`,
      message: `NGO feedback submitted: ${avg.toFixed(1)}/5 avg rating. ${points} points added to donor leaderboard.`,
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: feedbackEntry, pointsAwarded: points });
  } catch (error) {
    console.error("Feedback POST error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
