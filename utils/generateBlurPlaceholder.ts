import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import type { ImageProps } from "./types";

const cache = new Map<ImageProps, string>();

export default async function getBase64ImageUrl(
  image: ImageProps
): Promise<string> {
  // Check if the image is already cached
  let cachedUrl = cache.get(image);
  if (cachedUrl) {
    return cachedUrl;
  }

  try {
    // Validate environment variable
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name is not defined in environment variables."
      );
    }

    // Construct the Cloudinary URL
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`;
    console.log("Fetching image from URL:", imageUrl);

    // Fetch the image from Cloudinary
    const response = await fetch(imageUrl, { next: { revalidate: 0 } }); // Add `next` options for RSC compatibility
    if (!response.ok) {
      throw new Error(`Failed to fetch image. HTTP status: ${response.status}`);
    }

    // Convert the response to a buffer
    const buffer = await response.arrayBuffer();

    // Minify the image using imagemin
    const minifiedBuffer = await imagemin.buffer(new Uint8Array(buffer), {
      plugins: [imageminJpegtran()],
    });

    // Convert the minified image to a Base64 string
    const base64Url = `data:image/jpeg;base64,${Buffer.from(
      minifiedBuffer
    ).toString("base64")}`;

    // Cache the result for future use
    cache.set(image, base64Url);

    return base64Url;
  } catch (error) {
    console.error("Error in getBase64ImageUrl:", error);

    // Provide a fallback or rethrow the error
    throw new Error("Failed to generate Base64 image URL.");
  }
}
