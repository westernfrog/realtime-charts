const { NextResponse } = require("next/server");
const { connectToDatabase } = require("@/lib/dbConnect");
const { createData } = require("@/model/realtime");

export async function POST(request) {
  await connectToDatabase(); // Ensure database connection
  try {
    const body = await request.json(); // Parse request body
    const newData = await createData(body); // Create new data
    console.log(newData);

    return NextResponse.json(
      {
        status: "success",
        data: newData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
