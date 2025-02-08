import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await db.gallery.findMany({
      include: {
        items: true,
      },
    });

    console.log("Fetched galleries:", galleries); // Log the fetched data

    return NextResponse.json(galleries, { status: 200 });
  } catch (error) {
    console.error("Error fetching galleries:", error);

    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
