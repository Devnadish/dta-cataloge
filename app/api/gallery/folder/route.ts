import { NextResponse } from "next/server";
import db from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { galleryId, folderPath, description } = await request.json();

    // Validate input
    if (!galleryId || typeof galleryId !== "string") {
      return NextResponse.json(
        { error: "Gallery ID is required and must be a string" },
        { status: 400 }
      );
    }
    if (!folderPath || typeof folderPath !== "string") {
      return NextResponse.json(
        { error: "Folder path is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if the gallery exists
    const existingGallery = await db.gallery.findUnique({
      where: { id: galleryId },
    });

    let updatedGallery;

    if (existingGallery) {
      // Update the existing gallery
      updatedGallery = await db.gallery.update({
        where: { id: galleryId },
        data: {
          folder: folderPath,
          description: description || existingGallery.description, // Optional update
        },
      });
    } else {
      // Create a new gallery
      updatedGallery = await db.gallery.create({
        data: {
          id: galleryId,
          title: "Untitled Gallery", // Default title
          description: description || "Untitled Gallery", // Default description
          folder: folderPath,
        },
      });
    }

    return NextResponse.json(updatedGallery, { status: 200 });
  } catch (error) {
    console.error("Error updating/creating gallery folder:", error);
    return NextResponse.json(
      { error: "Failed to update/create gallery folder", details: error },
      { status: 500 }
    );
  }
}
