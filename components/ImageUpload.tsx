"use client";
import React, { useRef, useState } from "react";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      alert(error);
      return;
    }

    // If there's already an image, show confirmation
    if (currentImage) {
      setPendingFile(file);
      setShowConfirm(true);
    } else {
      onImageSelect(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const confirmReplace = () => {
    if (pendingFile) {
      onImageSelect(pendingFile);
    }
    setShowConfirm(false);
    setPendingFile(null);
  };

  const cancelReplace = () => {
    setShowConfirm(false);
    setPendingFile(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Replace Image?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You already have an image uploaded. Do you want to replace it?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelReplace}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplace}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-white dark:bg-gray-800"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports JPEG, PNG, WebP, GIF (Max 10MB)
          </p>
          {currentImage && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ {currentImage.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
