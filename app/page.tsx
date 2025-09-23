"use client";
import React, { useState, useCallback } from "react";
import ImageUpload from "../components/ImageUpload";
import ImagePreview from "../components/ImagePreview";
import ResizeControls from "../components/ResizeControls";
import DownloadButton from "../components/DownloadButton";
import { ImageState, ResizeOptions } from "../types";
import { getImageDimensions } from "../lib/imageUtils";

export default function Home() {
  const [imageState, setImageState] = useState<ImageState>({
    originalFile: null,
    originalUrl: "",
    resizedUrl: null,
    resizedBlob: null,
    isLoading: false,
    error: null,
  });

  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 85,
    format: "jpeg",
  });

  const handleImageSelect = useCallback(async (file: File) => {
    const originalUrl = URL.createObjectURL(file);
    const originalDimensions = await getImageDimensions(file);

    setImageState({
      originalFile: file,
      originalUrl,
      resizedUrl: null,
      resizedBlob: null,
      isLoading: false,
      error: null,
      originalDimensions,
    });

    // Set initial dimensions based on original image
    setResizeOptions((prev) => ({
      ...prev,
      width: originalDimensions.width,
      height: originalDimensions.height,
    }));
  }, []);

  const handleResize = useCallback(async () => {
    if (!imageState.originalFile) return;

    setImageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("image", imageState.originalFile);
      formData.append("width", resizeOptions.width.toString());
      formData.append("height", resizeOptions.height.toString());
      formData.append("quality", resizeOptions.quality.toString());
      formData.append("format", resizeOptions.format);

      const response = await fetch("/api/resize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to resize image");
      }

      const blob = await response.blob();
      const resizedUrl = URL.createObjectURL(blob);

      setImageState((prev) => ({
        ...prev,
        resizedUrl,
        resizedBlob: blob,
        isLoading: false,
      }));
    } catch (error) {
      console.log("[sufi] Error: ", error);
      setImageState((prev) => ({
        ...prev,
        error: "Failed to resize image",
        isLoading: false,
      }));
    }
  }, [imageState.originalFile, resizeOptions]);

  // Auto-resize when options change (with debounce)
  React.useEffect(() => {
    if (!imageState.originalFile) return;

    const timeoutId = setTimeout(() => {
      handleResize();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [resizeOptions, imageState.originalFile, handleResize]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Zeb Image Resizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Resize your images with custom dimensions and aspect ratios
          </p>
        </div>

        {/* Image Upload */}
        <ImageUpload
          onImageSelect={handleImageSelect}
          currentImage={imageState.originalFile}
        />

        {imageState.originalFile && (
          <>
            {/* Controls and Preview */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Resize Controls */}
              <div className="lg:col-span-1">
                <ResizeControls
                  options={resizeOptions}
                  onOptionsChange={setResizeOptions}
                  originalDimensions={imageState.originalDimensions}
                />
              </div>

              {/* Image Preview */}
              <div className="lg:col-span-2">
                <ImagePreview imageState={imageState} options={resizeOptions} />
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <DownloadButton
                resizedBlob={imageState.resizedBlob}
                format={resizeOptions.format}
                width={resizeOptions.width}
                height={resizeOptions.height}
                isLoading={imageState.isLoading}
              />
            </div>
          </>
        )}

        {imageState.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {imageState.error}
          </div>
        )}
      </div>
    </div>
  );
}
