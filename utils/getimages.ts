"use server";

import cloudinary from "./cloudinary";
import getBase64ImageUrl from "./generateBlurPlaceholder";
import type { ImageProps } from "./types";

export const GETIMAGES = async (): Promise<ImageProps[]> => {
  try {
    // Log the folder being accessed
    const folder = process.env.CLOUDINARY_FOLDER;
    console.log("CLOUDINARY_FOLDER:", folder);

    // Fetch images from Cloudinary
    const results = await cloudinary.v2.search
      .expression(`folder:${folder}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    console.log("Cloudinary results:", results);

    // Map the results to the ImageProps type
    const images: ImageProps[] = results.resources.map((result, index) => ({
      id: index,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    }));

    console.log("Processed images:", images);

    // Generate blur data URLs for each image
    // const blurImagePromises = images.map((image) => getBase64ImageUrl(image));
    // const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

    // Add blur data URLs to the images
    // images.forEach((image, index) => {
    //   image.blurDataUrl = imagesWithBlurDataUrls[index];
    // });

    console.log("Images with blur data URLs:", images);

    return images;
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    throw new Error("Failed to fetch images from Cloudinary.");
  }
};
