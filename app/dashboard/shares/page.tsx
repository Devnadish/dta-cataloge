// app/dashboard/shares/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SharesPage() {
  const [shares, setShares] = useState<any[]>([]);
  const [shareType, setShareType] = useState("public");
  const [shareLink, setShareLink] = useState("");
  const [itemId, setItemId] = useState("");

  // Fetch shares
  useEffect(() => {
    const fetchShares = async () => {
      if (!itemId) return;
      const response = await axios.get(`/api/shares?itemId=${itemId}`);
      setShares(response.data);
    };
    fetchShares();
  }, [itemId]);

  // Add a share
  const handleAddShare = async () => {
    if (!shareType || !shareLink || !itemId) return;

    await axios.post("/api/shares", {
      shareType,
      shareLink,
      itemId,
      clientId: "user-id",
    }); // Replace 'user-id' with actual user ID
    setShares([...shares, { shareType, shareLink }]);
    setShareType("public");
    setShareLink("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shares</h1>

      {/* Add Share Form */}
      <div className="mb-6">
        <select
          value={shareType}
          onChange={(e) => setShareType(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="invite">Invite Only</option>
        </select>
        <input
          type="text"
          value={shareLink}
          onChange={(e) => setShareLink(e.target.value)}
          placeholder="Enter share link"
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
          onClick={handleAddShare}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Share
        </button>
      </div>

      {/* Share List */}
      <ul>
        {shares.map((share, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {share.shareType}: {share.shareLink}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
