"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CreateGalleryForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/galleries/create", { title, description });
      alert("Gallery created successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to create gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter gallery title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter gallery description"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Gallery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGalleryForm;
