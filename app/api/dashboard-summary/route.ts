import { NextResponse } from "next/server";
import db from "../../../lib/prisma";

// GET /api/dashboard-summary
export async function GET() {
  try {
    // Fetch summary data from the database
    const galleryCount = await db.gallery.count();
    const itemCount = await db.item.count();
    const userCount = await db.user.count();
    const commentCount = await db.comment.count();

    return NextResponse.json({
      galleryCount,
      itemCount,
      userCount,
      commentCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
