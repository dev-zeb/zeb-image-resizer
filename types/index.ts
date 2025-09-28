export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: "jpeg" | "png" | "webp";
  activePreset?: string;
  backgroundColor: string;
  transparentBackground: boolean;
}

export interface ImageState {
  originalFile: File | null;
  originalUrl: string;
  resizedUrl: string | null;
  resizedBlob: Blob | null;
  isLoading: boolean;
  error: string | null;
  originalDimensions?: {
    width: number;
    height: number;
  };
  originalFileName?: string;
}
