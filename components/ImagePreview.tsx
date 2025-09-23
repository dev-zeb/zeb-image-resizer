"use client";
import React from "react";
import { ImageState } from "../types";

interface ImagePreviewProps {
  imageState: ImageState;
  options: { width: number; height: number };
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageState, options }) => {
  if (!imageState.originalUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🖼️</div>
        <p className="text-lg text-gray-600">Upload an image to get started</p>
      </div>
    );
  }

  if (imageState.isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Processing image...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Original Image</h3>
          <div className="relative">
            <img
              src={imageState.originalUrl}
              alt="Original"
              className="w-full h-auto max-h-80 object-contain rounded"
            />
            {imageState.originalDimensions && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {imageState.originalDimensions.width} ×{" "}
                {imageState.originalDimensions.height}
              </div>
            )}
          </div>
        </div>

        {/* Resized Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Resized Image</h3>
          <div className="relative">
            {imageState.resizedUrl ? (
              <img
                src={imageState.resizedUrl}
                alt="Resized"
                className="w-full h-auto max-h-80 object-contain rounded"
              />
            ) : (
              <div className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <p className="text-gray-500">
                  Resized preview will appear here
                </p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {options.width} × {options.height}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
