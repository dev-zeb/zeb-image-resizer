"use client";
import React from "react";
import { ResizeOptions } from "../types";

interface ResizeControlsProps {
  options: ResizeOptions;
  onOptionsChange: (options: ResizeOptions) => void;
  originalDimensions?: { width: number; height: number };
}

const ResizeControls: React.FC<ResizeControlsProps> = ({
  options,
  onOptionsChange,
  originalDimensions,
}) => {
  const handleDimensionChange = (field: "width" | "height", value: number) => {
    const newOptions = { ...options };

    if (options.maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      if (field === "width") {
        newOptions.width = value;
        newOptions.height = Math.round(value / ratio);
      } else {
        newOptions.height = value;
        newOptions.width = Math.round(value * ratio);
      }
    } else {
      newOptions[field] = value;
    }

    onOptionsChange(newOptions);
  };

  const presetSizes = [
    { name: "Instagram Post", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Cover", width: 820, height: 312 },
    { name: "Twitter Header", width: 1500, height: 500 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Resize Options</h3>

      {/* Preset Sizes */}
      <div>
        <label className="block text-sm font-medium mb-2">Preset Sizes</label>
        <div className="grid grid-cols-2 gap-2">
          {presetSizes.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                onOptionsChange({
                  ...options,
                  width: preset.width,
                  height: preset.height,
                  maintainAspectRatio: false,
                })
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Width (px)</label>
          <input
            type="number"
            min="1"
            max="5000"
            value={options.width}
            onChange={(e) =>
              handleDimensionChange("width", parseInt(e.target.value) || 1)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Height (px)</label>
          <input
            type="number"
            min="1"
            max="5000"
            value={options.height}
            onChange={(e) =>
              handleDimensionChange("height", parseInt(e.target.value) || 1)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.maintainAspectRatio}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                maintainAspectRatio: e.target.checked,
              })
            }
            className="mr-2"
          />
          Maintain Aspect Ratio
        </label>

        <div>
          <label className="block text-sm font-medium mb-2">
            Quality: {options.quality}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={options.quality}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                quality: parseInt(e.target.value),
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <select
            value={options.format}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                format: e.target.value as "jpeg" | "png" | "webp",
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {originalDimensions && (
        <div className="text-sm text-gray-600">
          Original: {originalDimensions.width} × {originalDimensions.height} px
        </div>
      )}
    </div>
  );
};

export default ResizeControls;
