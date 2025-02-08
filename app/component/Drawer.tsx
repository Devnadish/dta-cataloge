"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ShadCN ScrollArea
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import ShadCN Avatar
import {
  DownloadIcon,
  XIcon,
  InfoIcon,
  SendIcon,
  PlusIcon,
} from "lucide-react"; // Import icons
import { formatDistanceToNow } from "date-fns"; // Import date-fns for date formatting
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Import ShadCN Popover

// Mocked Backend Data
const mockComments = [
  {
    id: 1,
    text: "This is a great feature!",
    emoji: "👍",
    date: "2023-10-01T10:00:00Z", // Valid ISO date
    user: { name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
    reactions: ["👍", "❤️"], // Existing reactions
  },
  {
    id: 2,
    text: "I love this app!",
    emoji: "😍",
    date: "invalid-date", // Invalid date to simulate the error
    user: { name: "Jane Smith", image: "https://i.pravatar.cc/150?img=2" },
    reactions: [], // No reactions initially
  },
  {
    id: 3,
    text: "Nice work, keep it up!",
    emoji: "👏",
    date: null, // Missing date to simulate the error
    user: { name: "Alice Johnson", image: "https://i.pravatar.cc/150?img=3" },
    reactions: ["😂"], // Single reaction
  },
];

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: typeof mockComments; // Backend-provided comments
  onAddComment: (comment: string) => void;
}

export default function Drawer({
  isOpen,
  onClose,
  comments,
  onAddComment,
}: DrawerProps) {
  const [newComment, setNewComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [updatedComments, setUpdatedComments] = React.useState(comments); // Local state for comments

  // Define common emojis
  const commonEmojis = ["😊", "❤️", "👍", "😂", "🎉"];

  // Handle adding a new comment with validation
  const handleAddComment = () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (newComment.length > 200) {
      setError("Comment must be less than 200 characters.");
      return;
    }

    setError(null); // Clear any previous errors
    const newCommentObj = {
      id: Date.now(), // Generate a unique ID
      text: newComment,
      emoji: "", // No initial emoji
      date: new Date().toISOString(),
      user: { name: "Anonymous User", image: "https://i.pravatar.cc/150" },
      reactions: [], // No reactions initially
    };
    setUpdatedComments((prevComments) => [...prevComments, newCommentObj]); // Add new comment
    onAddComment(newComment); // Pass the new comment to the parent
    setNewComment(""); // Clear the input field
  };

  // Handle adding reactions
  const handleReaction = (commentId: number, emoji: string) => {
    setUpdatedComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: comment.reactions.includes(emoji)
                ? comment.reactions.filter((reaction) => reaction !== emoji) // Remove reaction
                : [...comment.reactions, emoji], // Add reaction
            }
          : comment
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }} // Start hidden above the container
          animate={{ y: 0 }} // Slide down into view
          exit={{ y: "-100%" }} // Slide back up when closing
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-x-0 top-0 h-[400px] bg-white z-50 rounded-b-lg shadow-lg overflow-hidden"
        >
          {/* Header with Input and Post Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a public comment..."
                className="w-full p-3 text-lg border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p> // Display error message
              )}
            </div>
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={handleAddComment}
            >
              <SendIcon size={24} /> {/* Replaced "Post" with an icon */}
            </button>
          </div>

          {/* Scrollable Comments Section */}
          <ScrollArea className="h-[calc(100%-128px)] p-4">
            {" "}
            {/* Adjust height for footer */}
            {!updatedComments ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index} // Ensure unique key for loading placeholders
                    className="h-6 bg-gray-200 rounded w-full"
                  ></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                {updatedComments.map((comment, index) => {
                  // Ensure the date is valid; use current date as fallback
                  const parsedDate = new Date(comment.date || Date.now());
                  const isValidDate = !isNaN(parsedDate.getTime());

                  return (
                    <li
                      key={comment.id || index}
                      className="flex gap-3 relative"
                    >
                      {" "}
                      {/* Added fallback key */}
                      {/* Avatar */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            comment.user?.image || "https://i.pravatar.cc/150"
                          } // Default image if missing
                          alt={comment.user?.name || "Anonymous"}
                        />
                        <AvatarFallback>
                          {comment.user?.name?.charAt(0) || "A"}{" "}
                          {/* Default fallback */}
                        </AvatarFallback>
                      </Avatar>
                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {comment.user?.name || "Anonymous User"}
                          </p>
                          <span className="text-xs text-gray-500">
                            {isValidDate
                              ? formatDistanceToNow(parsedDate, {
                                  addSuffix: true,
                                })
                              : "Invalid Date"}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                        {/* Reactions */}
                        <div className="mt-1 flex gap-2">
                          {comment.reactions.length > 0 && (
                            <span className="text-gray-700">
                              {comment.reactions.join(" ")}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Reaction Button with Popover */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-gray-500 hover:text-gray-700">
                            <PlusIcon size={16} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end" // Align the popover to the end of the trigger
                          className="w-auto max-w-[200px] p-2 bg-white shadow-lg rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Add Reaction
                            </span>
                            {/* Close Button */}
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the trigger button
                              }}
                            >
                              <XIcon size={16} />
                            </button>
                          </div>
                          {/* Emoji Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {commonEmojis.map((emoji, index) => (
                              <button
                                key={index}
                                className={`text-xl ${
                                  comment.reactions.includes(emoji)
                                    ? "text-blue-500"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() =>
                                  handleReaction(comment.id, emoji)
                                } // Add/remove reaction
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>

          {/* Sticky Footer with Shadow */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-md">
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              onClick={() => alert("Download clicked")}
            >
              <DownloadIcon size={20} />
              <span>Download</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <XIcon size={20} />
              <span>Close</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              onClick={() => alert("More Info clicked")}
            >
              <InfoIcon size={20} />
              <span>More Info</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
