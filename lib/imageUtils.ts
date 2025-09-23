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
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
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
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};
