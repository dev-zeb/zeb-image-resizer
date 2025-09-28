"use client";
import React from "react";

interface DownloadButtonProps {
  resizedBlob: Blob | null;
  format: string;
  width: number;
  height: number;
  isLoading: boolean;
  originalFileName?: string | null;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  resizedBlob,
  format,
  width,
  height,
  isLoading,
  originalFileName,
}) => {
  const handleDownload = () => {
    if (!resizedBlob) return;

    // Create a better filename
    let fileName = "resized-image";

    if (originalFileName) {
      // Remove the original extension and add the new dimensions and format
      const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
      fileName = `${nameWithoutExt}-${width}x${height}.${format}`;
    } else {
      fileName = `resized-image-${width}x${height}.${format}`;
    }

    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
      >
        ⏳ Processing...
      </button>
    );
  }

  if (!resizedBlob) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
      >
        📥 Download Resized Image
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      💾 Download {width}×{height}
      <span className="text-xs opacity-90">({format.toUpperCase()})</span>
    </button>
  );
};

export default DownloadButton;
