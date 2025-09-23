"use client";
import React from "react";

interface DownloadButtonProps {
  resizedBlob: Blob | null;
  format: string;
  width: number;
  height: number;
  isLoading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  resizedBlob,
  format,
  width,
  height,
  isLoading,
}) => {
  const handleDownload = () => {
    if (!resizedBlob) return;

    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized-image-${width}x${height}.${format}`;
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
        Processing...
      </button>
    );
  }

  if (!resizedBlob) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
      >
        Download Resized Image
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      Download Resized Image ({width}×{height})
    </button>
  );
};

export default DownloadButton;
