import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    // Validate input
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    // TODO: Replace this dummy ownerId with the actual authenticated user's ID
    const ownerId = "652f8e3f9b1d9c0a1c8d4e2b"; // Replace with a valid ObjectId // Placeholder value

    // Create the gallery in the database
    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description,
        ownerId,
      },
    });

    return NextResponse.json(newGallery, { status: 201 });
  } catch (error) {
    console.error(
      "Error creating gallery:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        error: "Failed to create gallery",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
