"use client";
import Image from "next/image";
import React, { useState } from "react";
import Drawer from "./Drawer"; // Import the Drawer component

export default function ImageCard({ public_id, format }) {
  // Generate the main image URL
  const mainImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`;

  // State for love count, comment count, and drawer visibility
  const [loveCount, setLoveCount] = useState(10); // Dummy love count
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer visibility
  const [comments, setComments] = useState<string[]>([]); // Simulated backend data

  // Simulate fetching comments from the backend
  const fetchComments = () => {
    // Simulate a delay for fetching data
    setTimeout(() => {
      setComments([
        "This is a great photo!",
        "I love this image!",
        "Beautiful shot!",
      ]);
    }, 1000);
  };

  // Handle opening the drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
    if (!comments) fetchComments(); // Fetch comments if not already loaded
  };

  // Handle closing the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle adding a new comment
  const handleAddComment = (newComment) => {
    setComments((prev) => [...prev, newComment]); // Add the new comment
  };

  // Handle "Love" button click
  const handleLoveClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (!isLoggedIn) {
      alert("Please log in to love this image.");
      return;
    }
    setLoveCount((prev) => prev + 1);
  };

  return (
    <div className="relative drop-shadow-2xl rounded-lg overflow-hidden p-1 shadow-xl">
      {/* Image */}
      <Image
        alt="Next.js Conf photo"
        className="transform rounded-lg brightness-90 transition group-hover:scale-105 cursor-pointer"
        src={mainImageUrl} // Main image URL
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
              (max-width: 1280px) 50vw,
              (max-width: 1536px) 33vw,
              25vw"
        onClick={openDrawer} // Open drawer on image click
      />

      {/* Overlay Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
        {/* Comment Count */}
        <span className="text-white">{comments?.length || 0} Comments</span>
        {/* Love Button */}
        <button
          className="text-white bg-red-500 px-2 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click events
            handleLoveClick(e);
          }}
        >
          ❤️ {loveCount}
        </button>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
