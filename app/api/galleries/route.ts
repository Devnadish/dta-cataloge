import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await db.gallery.findMany();
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, cloudinaryFolder } = await req.json();

    const newGallery = await db.gallery.create({
      data: {
        title,
        cloudinaryFolder,
      },
    });

    return NextResponse.json({ gallery: newGallery });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}
