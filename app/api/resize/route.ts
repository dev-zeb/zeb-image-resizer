import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const width = parseInt(formData.get("width") as string);
    const height = parseInt(formData.get("height") as string);
    const quality = parseInt(formData.get("quality") as string);
    const format = formData.get("format") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const transparentBackground =
      formData.get("transparentBackground") === "true";

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Clamp quality to valid range
    const clampedQuality = Math.max(1, Math.min(100, quality));

    const imageBuffer = await image.arrayBuffer();

    // Create a base image with the specified background
    let sharpInstance = sharp(Buffer.from(imageBuffer));

    // Handle background color
    if (
      backgroundColor &&
      backgroundColor !== "transparent" &&
      !transparentBackground
    ) {
      // Create a background image and composite the original image on top
      const backgroundImage = sharp({
        create: {
          width: width,
          height: height,
          channels: 3,
          background: backgroundColor,
        },
      });

      // Resize the original image to fit within the background
      const resizedImage = sharpInstance.resize(width, height, {
        fit: "contain",
        background: transparentBackground
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : backgroundColor,
      });

      sharpInstance = backgroundImage.composite([
        { input: await resizedImage.toBuffer() },
      ]);
    } else {
      // Regular resize with transparent or default background
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "fill",
        withoutEnlargement: false,
        background: transparentBackground
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : backgroundColor || "#ffffff",
      });
    }

    // Handle different formats
    if (format === "png") {
      // PNG uses compressionLevel (0-9) where 0 is no compression, 9 is max
      const compressionLevel = Math.floor((100 - clampedQuality) / 11.2);
      sharpInstance = sharpInstance.png({
        compressionLevel,
        quality: clampedQuality,
        force: true,
      });
    } else if (format === "webp") {
      sharpInstance = sharpInstance.webp({
        quality: clampedQuality,
        lossless: clampedQuality === 100,
      });
    } else {
      // Default to JPEG
      sharpInstance = sharpInstance.jpeg({
        quality: clampedQuality,
        force: true,
      });
    }

    const resizedBuffer = await sharpInstance.toBuffer();

    return new NextResponse(new Uint8Array(resizedBuffer), {
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="resized.${format}"`,
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
