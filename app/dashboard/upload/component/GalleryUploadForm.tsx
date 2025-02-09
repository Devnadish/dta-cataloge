// app/dashboard/upload/component/GalleryUploadForm.tsx (Client Component)
"use client"; // Mark this file as a client component

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ImageIcon, VideoIcon, Trash2 } from "lucide-react"; // Import Lucide icons
import { toast } from "sonner"; // For toast notifications
import ThumbnailPreview from "./ThumbnailPreview";
import { Skeleton } from "@/components/ui/skeleton"; // Import skeleton loader
import { Button } from "@/components/ui/button"; // Import button component

interface Gallery {
  id: string;
  title: string;
}

// Define a custom type for files with a `preview` property
interface FileWithPreview extends File {
  preview?: string;
}

export default function GalleryUploadForm({
  galleries,
}: {
  galleries: Gallery[];
}) {
  const [selectedGallery, setSelectedGallery] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "video"
  ) => {
    const fileList = e.target.files;
    if (!fileList) return;

    // Define allowed file types based on the button clicked
    const allowedTypes =
      fileType === "image"
        ? ["image/jpeg", "image/png", "image/gif"]
        : ["video/mp4", "video/quicktime"];

    // Filter out unsupported files
    const supportedFiles = Array.from(fileList).filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (supportedFiles.length !== fileList.length) {
      const unsupportedFiles = Array.from(fileList).filter(
        (file) => !allowedTypes.includes(file.type)
      );
      toast.warning("Unsupported files were excluded", {
        description: `The following files are not supported: ${unsupportedFiles.map((file) => file.name).join(", ")}`,
      });
    }

    // Append supported files to the state with a `preview` property
    setFiles((prevFiles) => [
      ...prevFiles,
      ...supportedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Clear all images
  const clearImages = () => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => !file.type.startsWith("image/"))
    );
    toast.success("All images cleared.");
  };

  // Clear all videos
  const clearVideos = () => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => !file.type.startsWith("video/"))
    );
    toast.success("All videos cleared.");
  };

  return (
    <div>
      {/* Gallery Selection */}
      <div className="mb-4">
        <label>Select Gallery:</label>
        <Select
          value={selectedGallery}
          onValueChange={(value) => setSelectedGallery(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a gallery" />
          </SelectTrigger>
          <SelectContent>
            {galleries.map((gallery) => (
              <SelectItem key={gallery.id} value={gallery.id}>
                {gallery.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Upload Buttons */}
      <div className="flex gap-4 mb-4">
        {/* Image Upload Button */}
        <label
          htmlFor="image-upload"
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-colors ${
            !selectedGallery
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <ImageIcon size={16} className="mr-2" /> {/* Icon for images */}
          <Input
            id="image-upload"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            multiple
            onChange={(e) => handleFileChange(e, "image")}
            style={{ display: "none" }}
            disabled={!selectedGallery} // Disable if no gallery is selected
          />
        </label>

        {/* Video Upload Button */}
        <label
          htmlFor="video-upload"
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-colors ${
            !selectedGallery
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <VideoIcon size={16} className="mr-2" /> {/* Icon for videos */}
          <Input
            id="video-upload"
            type="file"
            accept="video/mp4, video/quicktime"
            multiple
            onChange={(e) => handleFileChange(e, "video")}
            style={{ display: "none" }}
            disabled={!selectedGallery} // Disable if no gallery is selected
          />
        </label>
      </div>

      {/* Informative Messages */}
      {!selectedGallery && (
        <p className="text-sm text-red-500 mb-4">
          Please select an album before uploading images or videos.
        </p>
      )}

      {/* Thumbnail Preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {files.map((file, index) => (
            <ThumbnailPreview
              key={index}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}

      {/* Clear Buttons */}
      {files.length > 0 && (
        <div className="flex gap-4 mb-4">
          {files.some((file) => file.type.startsWith("image/")) && (
            <Button onClick={clearImages} variant="destructive">
              <Trash2 size={16} className="mr-2" /> Clear All Images
            </Button>
          )}
          {files.some((file) => file.type.startsWith("video/")) && (
            <Button onClick={clearVideos} variant="destructive">
              <Trash2 size={16} className="mr-2" /> Clear All Videos
            </Button>
          )}
        </div>
      )}

      {/* Confirm Upload */}
      <Button
        onClick={() => {}}
        disabled={!selectedGallery || files.length === 0}
        className="w-full"
      >
        Confirm Upload
      </Button>
    </div>
  );
}
