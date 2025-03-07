/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || !file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
        }

        // 🔹 Set the upload folder inside your project
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

        return new Promise((resolve) => {
            const scriptPath = path.join(process.cwd(), "scripts", "ocr.py");

            if (!fs.existsSync(scriptPath)) {
                return resolve(NextResponse.json({ error: "OCR script not found" }, { status: 500 }));
            }

            console.log(`🔹 Running OCR script: ${scriptPath} on ${imagePath}`);

            const processes = spawn("python", [scriptPath], { stdio: "pipe" });

            // Initialize the OCR reader with desired languages (e.g., "en")
            processes.stdin.write(`init en\n`);

            processes.stdout.on("data", (data) => {
                const text = data.toString().trim();
                console.log("OCR Output:", text);
                if (text.includes("Reader initialized")) {
                    // Now we can read the text
                    processes.stdin.write(`read_text ${imagePath}\n`); // No quotes around the path
                } else {
                    // Directly parse and return the output from the OCR
                    try {
                        const parsed = JSON.parse(text);
                        // Ensure to kill the process after getting the result
                        processes.kill(); // Kill the process after use
                        return resolve(NextResponse.json(parsed, { status: 200 }));
                    } catch (e: any) {
                        console.error("JSON Parse Error:", text);
                        processes.kill(); // Kill the process on error
                        return resolve(NextResponse.json({ error: `Invalid JSON from OCR script: ${e.message}` }, { status: 500 }));
                    }
                }
            });

            processes.stderr.on("data", (data) => {
                const errorMessage = data.toString();
                // Ignore specific CUDA/MPS warning
                if (!errorMessage.includes("Neither CUDA nor MPS are available")) {
                    console.error("OCR Script Error:", errorMessage);
                    processes.kill(); // Kill the process on error
                    return resolve(NextResponse.json({ error: `OCR script failed: ${errorMessage}` }, { status: 500 }));
                }
            });

            processes.on("close", (code) => {
                console.log(`OCR process exited with code ${code}`);
                // Ensure the process is killed if it hasn't been already
                processes.kill();
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: `Internal server error: ${(error as Error).message}` }, { status: 500 });
    }
}
