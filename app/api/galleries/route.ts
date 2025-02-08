import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all galleries from MongoDB
    const galleries = await db.gallery.findMany({
      include: {
        items: true, // Include the count of items in each gallery
      },
    });

    return NextResponse.json(galleries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
