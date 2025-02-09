"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react"; // Import trash icon from Lucide
import { toast } from "sonner"; // For toast notifications

export default function UploadForm() {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch galleries on component mount
  useEffect(() => {
    const fetchGalleries = async () => {
      const res = await fetch("/api/galleries");
      const data = await res.json();
      setGalleries(data);
    };
    fetchGalleries();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    // Define allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];

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

    // Append supported files to the state
    setFiles((prevFiles) => [...prevFiles, ...supportedFiles]);
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle upload confirmation
  const handleUpload = async () => {
    if (!selectedGallery || files.length === 0) return;

    setLoading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        await saveMediaToDatabase(selectedGallery, data.url);
      }
      toast.success("Upload successful!");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save media URL to the database
  const saveMediaToDatabase = async (galleryId: string, url: string) => {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ galleryId, mediaUrl: url }),
    });

    if (!res.ok) throw new Error("Failed to save media");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Upload Media</h2>

      {/* Gallery Selection */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Select Gallery:
        </label>
        <Select value={selectedGallery} onValueChange={setSelectedGallery}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a gallery" />
          </SelectTrigger>
          <SelectContent>
            {galleries.map((gallery: any) => (
              <SelectItem key={gallery.id} value={gallery.id}>
                {gallery.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Upload */}
      <div>
        <label className="block mb-2 text-sm font-medium">Upload Files:</label>
        <Input
          type="file"
          multiple
          accept="image/*, video/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Thumbnail Preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Upload */}
      <Button
        onClick={handleUpload}
        disabled={loading || !selectedGallery || files.length === 0}
        className="w-full"
      >
        {loading ? "Uploading..." : "Confirm Upload"}
      </Button>
    </div>
  );
}
