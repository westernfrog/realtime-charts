import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { getData } from "@/model/realtime";

export async function GET() {
  await connectToDatabase();
  try {
    const data = await getData();
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
