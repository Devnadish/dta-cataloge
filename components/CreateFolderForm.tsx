"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Import Axios instance

const CreateFolderForm = () => {
  const [title, setTitle] = useState(""); // Folder title input
  const [description, setDescription] = useState(""); // Folder description input
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    setSuccessMessage(null); // Reset success message

    try {
      // Validate input
      if (!title || typeof title !== "string") {
        setError("Title is required and must be a valid string.");
        setLoading(false);
        return;
      }

      // Check for duplicate folder names in the database
      const duplicateCheckResponse = await axiosInstance.post(
        "/galleries/check-duplicate",
        {
          title,
        }
      );

      if (duplicateCheckResponse.data.exists) {
        setError("A folder with this title already exists.");
        setLoading(false);
        return;
      }

      // Create the folder in Cloudinary
      const cloudinaryResponse = await axiosInstance.post(
        "/cloudinary/folder",
        {
          folderName: title, // Use the title as the folder name
        }
      );

      console.log("Folder created successfully:", cloudinaryResponse.data);

      // Save the folder details to the database
      const dbResponse = await axiosInstance.post("/galleries/create", {
        title,
        description,
      });

      console.log("Folder added to database successfully:", dbResponse.data);

      setSuccessMessage(`Folder "${title}" created successfully!`);
      setTitle(""); // Clear the input fields
      setDescription("");
    } catch (err: any) {
      // Handle errors and display a user-friendly message
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
      console.error("Error creating folder:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Folder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter folder title"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter folder description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </form>
    </div>
  );
};

export default CreateFolderForm;
