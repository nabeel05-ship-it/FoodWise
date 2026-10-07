import { NextResponse } from "next/server";
import { getAllData } from "@/lib/dataService";

// GET all prototype data
export async function GET() {
  try {
    const data = await getAllData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Data GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prototype data" },
      { status: 500 }
    );
  }
}
