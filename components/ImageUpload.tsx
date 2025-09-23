"use client";
import React, { useRef } from "react";
import { validateImageFile } from "../lib/imageUtils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      alert(error);
      return;
    }

    onImageSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      alert(error);
      return;
    }

    onImageSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-lg font-semibold">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports JPEG, PNG, WebP, GIF (Max 10MB)
          </p>
          {currentImage && (
            <p className="text-sm text-green-600">
              Selected: {currentImage.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
