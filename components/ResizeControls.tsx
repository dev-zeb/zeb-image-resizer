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
    const newOptions = { ...options, activePreset: undefined };

    if (options.maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      if (field === "width") {
        newOptions.width = Math.max(1, value);
        newOptions.height = Math.round(newOptions.width / ratio);
      } else {
        newOptions.height = Math.max(1, value);
        newOptions.width = Math.round(newOptions.height * ratio);
      }
    } else {
      newOptions[field] = Math.max(1, value);
    }

    onOptionsChange(newOptions);
  };

  const presetSizes = [
    {
      name: "instagram-post",
      label: "Instagram Post",
      width: 1080,
      height: 1080,
    },
    {
      name: "instagram-story",
      label: "Instagram Story",
      width: 1080,
      height: 1920,
    },
    {
      name: "facebook-cover",
      label: "Facebook Cover",
      width: 820,
      height: 312,
    },
    {
      name: "twitter-header",
      label: "Twitter Header",
      width: 1500,
      height: 500,
    },
    { name: "hd-16-9", label: "HD (16:9)", width: 1920, height: 1080 },
    { name: "square-1-1", label: "Square (1:1)", width: 1000, height: 1000 },
  ];

  const presetColors = [
    { name: "transparent", label: "Transparent", value: "transparent" },
    { name: "white", label: "White", value: "#ffffff" },
    { name: "black", label: "Black", value: "#000000" },
    { name: "gray", label: "Gray", value: "#808080" },
    { name: "custom", label: "Custom", value: "custom" },
  ];

  const applyPreset = (preset: (typeof presetSizes)[0]) => {
    onOptionsChange({
      ...options,
      width: preset.width,
      height: preset.height,
      maintainAspectRatio: false,
      activePreset: preset.name,
    });
  };

  const handleBackgroundColorChange = (color: string) => {
    onOptionsChange({
      ...options,
      backgroundColor: color,
      transparentBackground: color === "transparent",
    });
  };

  const handleTransparentChange = (transparent: boolean) => {
    onOptionsChange({
      ...options,
      transparentBackground: transparent,
      backgroundColor: transparent
        ? "transparent"
        : options.backgroundColor === "transparent"
        ? "#ffffff"
        : options.backgroundColor,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Resize Options
      </h3>

      {/* Preset Sizes */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Preset Sizes
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetSizes.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-2 text-sm border rounded transition-colors ${
                options.activePreset === preset.name
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Width (px)
          </label>
          <input
            type="number"
            min="1"
            max="5000"
            value={options.width}
            onChange={(e) =>
              handleDimensionChange("width", parseInt(e.target.value) || 1)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Height (px)
          </label>
          <input
            type="number"
            min="1"
            max="5000"
            value={options.height}
            onChange={(e) =>
              handleDimensionChange("height", parseInt(e.target.value) || 1)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Background Color Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Background Color
          </label>

          {/* Transparency Toggle */}
          <div className="mb-3">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={options.transparentBackground}
                onChange={(e) => handleTransparentChange(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Transparent Background
            </label>
          </div>

          {/* Color Presets */}
          {!options.transparentBackground && (
            <>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetColors
                  .filter((color) => color.name !== "transparent")
                  .map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleBackgroundColorChange(color.value)}
                      className={`h-8 rounded border-2 ${
                        options.backgroundColor === color.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
              </div>

              {/* Custom Color Picker */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Custom:
                </label>
                <input
                  type="color"
                  value={
                    options.backgroundColor === "transparent"
                      ? "#ffffff"
                      : options.backgroundColor
                  }
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="w-full h-8 cursor-pointer"
                />
                <input
                  type="text"
                  value={
                    options.backgroundColor === "transparent"
                      ? "#ffffff"
                      : options.backgroundColor
                  }
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  placeholder="#FFFFFF"
                  className="w-24 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Other Options */}
      <div className="space-y-4">
        <label className="flex items-center text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={options.maintainAspectRatio}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                maintainAspectRatio: e.target.checked,
                activePreset: undefined,
              })
            }
            className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          Maintain Aspect Ratio
          {originalDimensions && options.maintainAspectRatio && (
            <span className="ml-2 text-sm text-gray-500">
              ({originalDimensions.width}:{originalDimensions.height})
            </span>
          )}
        </label>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Quality: <span className="font-mono">{options.quality}%</span>
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
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Format
          </label>
          <select
            value={options.format}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                format: e.target.value as "jpeg" | "png" | "webp",
              })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {originalDimensions && (
        <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-900 rounded">
          Original: {originalDimensions.width} × {originalDimensions.height} px
        </div>
      )}
    </div>
  );
};

export default ResizeControls;
