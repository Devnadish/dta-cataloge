import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import db from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // Generate a unique ID for the gallery
    const galleryId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const folderPath = `galleries/gallery-${galleryId}`;

    // Create the folder in Cloudinary
    await cloudinary.v2.api.create_folder(folderPath);

    // Fetch ownerId from environment variables
    const ownerId = process.env.GALLERY_OWNER_ID;
    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is missing in environment variables" },
        { status: 500 }
      );
    }

    // Save the gallery metadata in MongoDB
    const gallery = await db.gallery.create({
      data: {
        id: galleryId,
        title,
        description, // Include the description field
        ownerId, // Use the ownerId from .env
        folderPath,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}
