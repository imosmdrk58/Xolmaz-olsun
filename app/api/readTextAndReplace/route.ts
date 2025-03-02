import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Resize and compress image using Sharp (max width: 1000px, JPEG format, 30% quality)
        const compressedBuffer = await sharp(buffer)
            .resize({ width: 1000, height: 1000, fit: sharp.fit.inside }) // Resize to max 1000px while maintaining aspect ratio
            .toFormat("png", { quality: 50 }) // Convert to JPEG, 30% quality
            .toBuffer();

        console.log(`Compressed buffer size: ${compressedBuffer.length} bytes`); // Log the size of the compressed buffer

        // Create a new FormData instance to send compressed image
        const compressedFormData = new FormData();
        compressedFormData.append("file", new Blob([compressedBuffer], { type: "image/jpeg" }), "compressed.jpg");
        compressedFormData.append("apikey", "K85186046688957"); // Add API key as a form field

        // Send compressed image to OCR.space API
        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: compressedFormData, // Send compressed image
        });

        const ocrResult = await ocrResponse.json();

        // Check for errors in the OCR response
        if (ocrResult.IsErroredOnProcessing) {
            return NextResponse.json({ error: ocrResult.ErrorMessage }, { status: 500 });
        }

        return NextResponse.json(ocrResult);
    } catch (error) {
        console.error("OCR API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
