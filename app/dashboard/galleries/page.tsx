// app/dashboard/galleries/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");

  // Fetch galleries
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries`
        );
        setGalleries(response.data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
    };
    fetchGalleries();
  }, []);

  // Add a new gallery
  const handleAddGallery = async () => {
    if (!newGalleryTitle) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries`, {
        title: newGalleryTitle,
      });
      setGalleries([
        ...galleries,
        { id: Date.now().toString(), title: newGalleryTitle },
      ]);
      setNewGalleryTitle("");
    } catch (error) {
      console.error("Error adding gallery:", error);
    }
  };

  // Delete a gallery
  const handleDeleteGallery = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries/${id}`
      );
      setGalleries(galleries.filter((gallery) => gallery.id !== id));
    } catch (error) {
      console.error("Error deleting gallery:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Galleries</h1>

      {/* Add Gallery Form */}
      <div className="mb-6">
        <input
          type="text"
          value={newGalleryTitle}
          onChange={(e) => setNewGalleryTitle(e.target.value)}
          placeholder="Enter gallery title"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddGallery}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Gallery
        </button>
      </div>

      {/* Gallery List */}
      <ul>
        {galleries.map((gallery) => (
          <li
            key={gallery.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{gallery.title}</span>
            <button
              onClick={() => handleDeleteGallery(gallery.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
