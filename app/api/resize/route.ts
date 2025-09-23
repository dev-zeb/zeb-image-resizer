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

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imageBuffer = await image.arrayBuffer();

    let sharpInstance = sharp(Buffer.from(imageBuffer));

    // Resize the image
    sharpInstance = sharpInstance.resize(width, height, {
      fit: "fill",
      withoutEnlargement: false,
    });

    // Convert to specified format with quality
    switch (format) {
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case "png":
        sharpInstance = sharpInstance.png({ quality });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality });
        break;
      default:
        sharpInstance = sharpInstance.jpeg({ quality });
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
