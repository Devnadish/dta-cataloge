"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Import Axios instance
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AddFolderToGalleryForm = () => {
  const [galleryId, setGalleryId] = useState(""); // Gallery ID input
  const [title, setTitle] = useState(""); // Folder name (used as folderPath)
  const [description, setDescription] = useState(""); // Optional description
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create the folder in Cloudinary
      const cloudinaryResponse = await axiosInstance.post(
        "/cloudinary/folder",
        {
          folderName: title, // Use the title as the folder name
        }
      );

      const folderPath = cloudinaryResponse.data.folderName;

      // Step 2: Save the folder data to the database
      const databaseResponse = await axiosInstance.post("/galleries/folder", {
        galleryId, // Gallery ID from the input field
        folderPath, // Folder path from Cloudinary
        description, // Optional description
      });

      console.log("Folder added successfully:", databaseResponse.data);
      alert("Folder added successfully!");
      setGalleryId("");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to add folder to gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Folder to Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gallery ID Field */}
          <div>
            <label htmlFor="galleryId" className="block text-sm font-medium">
              Gallery ID
            </label>
            <Input
              id="galleryId"
              value={galleryId}
              onChange={(e) => setGalleryId(e.target.value)}
              placeholder="Enter gallery ID"
              required
            />
          </div>

          {/* Title (Folder Name) Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title (Subfolder Name)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter folder description"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Folder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFolderToGalleryForm;
