/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
const EasyOCRWrapper = require("easyocr-js");

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || !file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const imagePath = path.join(uploadDir, "uploaded_image.jpg");

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(imagePath, buffer);
            console.log(`✅ Image saved: ${imagePath}`);
        } catch (writeError) {
            return NextResponse.json({ error: "Failed to write image file" }, { status: 500 });
        }

        try {
            const ocr = new EasyOCRWrapper({
                lang: "en",
                path: path.join("node_modules", "easyocr-js"),
            });
            await ocr.init("en");
            const result = await ocr.readText(imagePath);
            await ocr.close();

            return NextResponse.json({ text: result }, { status: 200 });
        } catch (error) {
            console.error("OCR Error:", error);
            return NextResponse.json({ error: `OCR processing failed: ${(error as Error).message}` }, { status: 500 });
        }
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: `Internal server error: ${(error as Error).message}` }, { status: 500 });
    }
}
