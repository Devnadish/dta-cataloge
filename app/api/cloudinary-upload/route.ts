import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { title, folder } = await req.json();
    const uploadResponse = await cloudinary.v2.uploader.upload(
      "https://via.placeholder.com/150",
      {
        folder: folder,
        public_id: title,
        resource_type: "image",
      }
    );

    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { success: false, error: "Cloudinary upload failed" },
      { status: 500 }
    );
  }
}
