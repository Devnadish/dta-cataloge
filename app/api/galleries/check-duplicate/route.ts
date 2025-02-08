import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title } = await request.json();

    // Validate input
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if a gallery with the same title exists
    const existingGallery = await prisma.gallery.findFirst({
      where: { title },
    });

    return NextResponse.json({ exists: !!existingGallery }, { status: 200 });
  } catch (error) {
    console.error("Error checking for duplicate gallery:", error);
    return NextResponse.json(
      { error: "Failed to check for duplicate gallery", details: error },
      { status: 500 }
    );
  }
}
