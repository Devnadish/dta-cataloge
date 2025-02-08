import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import db from "@/lib/prisma";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    // Validate input
    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: "Title, description, and userId are required." },
        { status: 400 }
      );
    }

    // Fetch the user's plan and gallery count
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Get the plan limitation from environment variables
    let planLimit: number;

    if (process.env.DEFAULT_USER_PLAN === "3") {
      // Numeric plan limitation
      planLimit = parseInt(process.env.DEFAULT_USER_PLAN || "0", 10);
    } else {
      // Plan limitation based on user's subscription tier
      planLimit = parseInt(
        process.env[`${user.plan}_GALLERY_LIMIT`] || "0",
        10
      );
    }

    if (user.galleryCount >= planLimit) {
      return NextResponse.json(
        { error: "You have reached your gallery limit for this plan." },
        { status: 403 }
      );
    }

    // Generate a unique ID for the gallery
    const galleryId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const folderPath = `nadish/gallery-${galleryId}`;

    // Create the folder in Cloudinary
    await cloudinary.v2.api.create_folder(folderPath);

    // Save the gallery metadata in MongoDB
    const gallery = await db.gallery.create({
      data: {
        id: galleryId,
        title,
        description,
        ownerId: userId,
        isActive: true,
        folderPath,
      },
    });

    // Increment the user's gallery count
    await db.user.update({
      where: { id: userId },
      data: { galleryCount: { increment: 1 } },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery:", error);

    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}