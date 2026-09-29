import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { institutionId = "IITD-MESS-01", date = "2026-09-22", factors = [] } = body;

    // Simulate AI Demand Prediction Engine with factors
    const baseMeals = 850;
    let adjustedMeals = baseMeals;

    if (factors.includes("exam_week")) adjustedMeals += 98; // +12%
    if (factors.includes("rain_forecast")) adjustedMeals -= 42; // -5%

    const forecast = {
      totalMeals: adjustedMeals,
      confidencePct: 87.4,
      breakdown: [
        { meal: "Breakfast", predicted: Math.round(adjustedMeals * 0.22), suggestion: "Buffer +15" },
        { meal: "Lunch", predicted: Math.round(adjustedMeals * 0.44), suggestion: "Target 863" },
        { meal: "Dinner", predicted: Math.round(adjustedMeals * 0.34), suggestion: "Target 720" },
      ],
      weights: {
        calendarWeekday: 0.38,
        hostelExamSchedule: 0.32,
        ambientWeather: 0.18,
        historicalLag7Day: 0.12,
      },
    };

    // Save prediction to MongoDB
    const db = await getDb();
    await db.collection("predictions_log").insertOne({
      institutionId,
      date,
      factors,
      model: "NeuralProphet-MessDemand-v4.2",
      forecast,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      model: "NeuralProphet-MessDemand-v4.2",
      institutionId,
      date,
      forecast,
    });
  } catch {
    return NextResponse.json({ error: "Failed to compute demand forecast" }, { status: 500 });
  }
}

// GET — retrieve prediction history
export async function GET() {
  try {
    const db = await getDb();
    const predictions = await db.collection("predictions").find({}).toArray();
    const history = await db.collection("demand_history").find({}).toArray();
    return NextResponse.json({ success: true, predictions, history });
  } catch {
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 });
  }
}
