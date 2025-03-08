/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    try {
        const { text, targetLang } = await req.json();
        if (!text || !targetLang) {
            return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
        }

        const url = `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Translation request failed" }, { status: response.status });
        }

        const data = await response.json();
        const translatedText = data[0].map((item: any) => item[0]).join("");

        return NextResponse.json({ translatedText }, { status: 200 });
    } catch (error) {
        console.error("Translation Error:", error);
        return NextResponse.json({ error: `Translation failed: ${(error as Error).message}` }, { status: 500 });
    }
}
