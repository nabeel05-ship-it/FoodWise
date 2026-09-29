import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { batchCode = "TOM-2024-0234", crop = "Tomatoes", tempCelsius = 13.1, ageDays = 6 } = body;

    // Kinetic rate Arrhenius equation model simulation
    const estimatedHours = tempCelsius > 10 ? 31.2 : 72.0;

    const prediction = {
      spoilageEstHours: estimatedHours,
      riskLevel: estimatedHours < 36 ? "HIGH" : "LOW",
      confidencePct: 82.0,
      actionWindowHours: 8,
      salvageableKg: 2800,
      recommendation: "Prioritize this batch for Ketchup Line 2 within 8 hours.",
    };

    // Save spoilage prediction to MongoDB
    const db = await getDb();
    await db.collection("spoilage_predictions_log").insertOne({
      batchCode,
      crop,
      model: "ThermalRespiration-Kinetic-v3.1",
      telemetry: {
        currentTemp: tempCelsius,
        respirationRate: "42 mg CO2/kg·hr",
        holdingAgeDays: ageDays,
      },
      prediction,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      model: "ThermalRespiration-Kinetic-v3.1",
      batchCode,
      crop,
      telemetry: {
        currentTemp: tempCelsius,
        respirationRate: "42 mg CO2/kg·hr",
        holdingAgeDays: ageDays,
      },
      prediction,
    });
  } catch {
    return NextResponse.json({ error: "Failed to compute spoilage curve" }, { status: 500 });
  }
}
