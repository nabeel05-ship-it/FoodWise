import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "healthy",
    mode: "local_prototype",
    database: "in_memory_mock_layer",
    timestamp: new Date().toISOString(),
    message: "FoodWise prototype services running cleanly without external database dependencies.",
  });
}
