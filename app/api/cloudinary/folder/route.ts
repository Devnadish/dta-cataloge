import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { folderName } = await request.json();

    // Validate input
    if (!folderName || typeof folderName !== "string") {
      return NextResponse.json(
        { error: "Folder name is required and must be a string" },
        { status: 400 }
      );
    }

    // Load the CLOUDINARY_FOLDER from environment variables
    const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;

    if (!CLOUDINARY_FOLDER) {
      return NextResponse.json(
        {
          error:
            "CLOUDINARY_FOLDER is not defined in the environment variables",
        },
        { status: 500 }
      );
    }

    // Prepend the CLOUDINARY_FOLDER to the folderName
    const fullFolderPath = `${CLOUDINARY_FOLDER}/${folderName}`;

    // Encode the folder path to handle special characters
    const encodedFolderPath = fullFolderPath;
    // const encodedFolderPath = encodeURIComponent(fullFolderPath);

    // Create the folder in Cloudinary
    try {
      await cloudinary.api.create_folder(encodedFolderPath);
    } catch (cloudinaryError: any) {
      if (
        cloudinaryError.http_code === 400 &&
        cloudinaryError.message.includes("already exists")
      ) {
        console.log("Folder already exists in Cloudinary.");
      } else {
        throw cloudinaryError; // Re-throw other errors
      }
    }

    return NextResponse.json(
      { message: "Folder created successfully", folderPath: fullFolderPath },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating folder in Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to create folder in Cloudinary", details: error },
      { status: 500 }
    );
  }
}
