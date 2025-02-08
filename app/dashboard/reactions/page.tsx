// app/dashboard/reactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ReactionsPage() {
  const [reactions, setReactions] = useState<any[]>([]);
  const [emoji, setEmoji] = useState("");
  const [count, setCount] = useState(1);
  const [itemId, setItemId] = useState("");

  // Fetch reactions
  useEffect(() => {
    const fetchReactions = async () => {
      if (!itemId) return;
      const response = await axios.get(`/api/reactions?itemId=${itemId}`);
      setReactions(response.data);
    };
    fetchReactions();
  }, [itemId]);

  // Add a reaction
  const handleAddReaction = async () => {
    if (!emoji || !itemId) return;

    await axios.post("/api/reactions", {
      emoji,
      count,
      itemId,
      clientId: "user-id",
    }); // Replace 'user-id' with actual user ID
    setReactions([...reactions, { emoji, count }]);
    setEmoji("");
    setCount(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reactions</h1>

      {/* Add Reaction Form */}
      <div className="mb-6">
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Enter emoji (e.g., ❤️)"
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Enter count"
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Enter item ID"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddReaction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Reaction
        </button>
      </div>

      {/* Reaction List */}
      <ul>
        {reactions.map((reaction, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {reaction.emoji} x{reaction.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
