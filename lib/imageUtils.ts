export const validateImageFile = (file: File): string | null => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return "Please upload a valid image file (JPEG, PNG, WebP, GIF)";
  }

  if (file.size > maxSize) {
    return "Image size must be less than 10MB";
  }

  return null;
};

export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => {
    a = Math.round(a);
    b = Math.round(b);
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;

  // Round to common ratios for better readability
  const commonRatios: { [key: string]: [number, number] } = {
    "1:1": [1, 1],
    "3:2": [3, 2],
    "4:3": [4, 3],
    "16:9": [16, 9],
    "16:10": [16, 10],
    "21:9": [21, 9],
  };

  for (const [ratio, [w, h]] of Object.entries(commonRatios)) {
    const tolerance = 0.1;
    if (Math.abs(ratioWidth / ratioHeight - w / h) < tolerance) {
      return ratio;
    }
  }

  return `${Math.round(ratioWidth * 10) / 10}:${
    Math.round(ratioHeight * 10) / 10
  }`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: Math.round(img.width),
        height: Math.round(img.height),
      });
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.src = URL.createObjectURL(file);
  });
};
