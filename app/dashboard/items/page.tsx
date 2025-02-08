// app/dashboard/items/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function ItemsPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryId, setGalleryId] = useState("");

  // Handle image upload
  const handleUploadImage = async () => {
    if (!imageFile || !galleryId) return;

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post("/api/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { publicId, mediaUrl } = response.data;

    await axios.post("/api/items", {
      title: imageFile.name,
      mediaUrl,
      publicId,
      galleryId,
    });

    alert("Image uploaded successfully!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Items</h1>

      {/* Upload Image Form */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <input
          type="text"
          value={galleryId}
          onChange={(e) => setGalleryId(e.target.value)}
          placeholder="Enter gallery ID"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleUploadImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}
