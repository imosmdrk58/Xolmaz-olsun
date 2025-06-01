/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';

let browserPromise: Promise<Browser> | null = null;

// Initialize browser singleton
async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
            timeout: 60000,
        });
    }
    return browserPromise;
}

// Cleanup browser on process exit
process.on('SIGINT', async () => {
    if (browserPromise) {
        const browser = await browserPromise;
        await browser.close();
        browserPromise = null;
    }
    process.exit();
});

export async function GET() {
    const forumUrl = 'https://forums.mangadex.org/whats-new/latest-activity';
    const maxComments = 10;
    const maxRetries = 2;

    let browser;
    let page;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            browser = await getBrowser();
            page = await browser.newPage();

            await page.setUserAgent(
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
            );
            await page.setExtraHTTPHeaders({
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                dnt: '1',
                'if-modified-since': 'Sun, 01 Jun 2025 10:23:30 GMT',
                priority: 'u=0, i',
                referer: 'https://forums.mangadex.org/',
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'upgrade-insecure-requests': '1',
            });

            await page.setRequestInterception(true);
            page.on('request', (request: { resourceType: () => any; abort: () => void; continue: () => void; }) => {
                const resourceType = request.resourceType();
                if (['image', 'stylesheet', 'font', 'media', 'script', 'xhr', 'fetch'].includes(resourceType)) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            const response = await page.goto(forumUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 15000,
            });

            if (!response || response.status() !== 200) {
                throw new Error(`Failed to load page: ${response ? response.status() : 'No response'}`);
            }

            await page.waitForSelector('.block-row.block-row--separated', { timeout: 5000 }).catch(() => {
                console.warn('Selector not found, proceeding with available content');
            });

            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const comments = [];

            const elements = $('.block-row.block-row--separated').toArray();
            for (const element of elements) {
                if (comments.length >= maxComments) break;

                const $element = $(element);

                const username = $element.find('.username').text().trim();
                if (!username) continue;

                let avatarUrl = $element.find('.avatar img').attr('src');
                if (avatarUrl && avatarUrl.startsWith('/')) {
                    avatarUrl = `https://forums.mangadex.org${avatarUrl}`;
                }

                const titleElement = $element.find('.contentRow-title a[href*="/threads/"]').text().trim();
                const { mangaTitle, volumeNo, chapterNo, chapterTitle } = cleanMangaTitle(titleElement);

                const reactionType = $element.find('.reaction-text').text().trim() || 'Like';
                const commentContent = $element.find('.contentRow-snippet').text().trim();
                if (!commentContent && !titleElement) continue;

                const timeAgo = $element.find('time.u-dt').text().trim() || 'A moment ago';
                const threadUrl = $element.find('a[href*="/threads/"]').attr('href') || '#';
                const repliedTO = $element.find('a[href*="/posts/"]').text();
                const postUrl = $element.find('a[href*="/posts/"]').attr('href') || '#';

                const fullThreadUrl = threadUrl.startsWith('/') ? `https://forums.mangadex.org${threadUrl}` : threadUrl;
                if (mangaTitle === "Unknown Manga Title") continue;

                comments.push({
                    id: `comment_${comments.length + 1}`,
                    username,
                    avatarUrl: avatarUrl || `https://forums.mangadex.org/community/avatars/s/0/${Math.floor(Math.random() * 100)}.jpg?1673176662`,
                    mangaTitle,
                    volumeNo,
                    chapterNo,
                    chapterTitle,
                    repliedTO,
                    postUrl,
                    reactionType,
                    commentContent,
                    timeAgo,
                    threadUrl: fullThreadUrl,
                });
            }

            await page.close();

            if (comments.length === 0) {
                throw new Error('No comments found in the HTML');
            }

            return NextResponse.json({
                data: comments.slice(0, maxComments),
                total: comments.length,
                timestamp: new Date().toISOString(),
                source: 'MangaDex Forums Latest Activity',
            });
        } catch (error: any) {
            attempt++;
            if (page) await page.close();
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt >= maxRetries) {
                console.error('Error scraping forum comments:', error.message);
                return NextResponse.json(
                    {
                        data: [],
                        total: 0,
                        timestamp: new Date().toISOString(),
                        source: 'MangaDex Forums Latest Activity',
                        error: `Failed to scrape data after ${maxRetries} attempts: ${error.message}`,
                    },
                    { status: error.response?.status || 500 }
                );
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    return NextResponse.json(
        {
            data: [],
            total: 0,
            timestamp: new Date().toISOString(),
            source: 'MangaDex Forums Latest Activity',
            error: 'Unexpected error: retries exhausted',
        },
        { status: 500 }
    );
}

// Helper function to clean and parse manga title
function cleanMangaTitle(title: string) {
    let mangaTitle = "Unknown Manga Title";
    let volumeNo = "";
    let chapterNo = "";
    let chapterTitle = "";

    if (!title || title.trim() === "") {
        return { mangaTitle, volumeNo, chapterNo, chapterTitle };
    }

    // Handle titles with or without "Vol."
    // Pattern 1: "Manga Title - Vol. X Ch. Y - Chapter Title"
    // Pattern 2: "Manga Title - Ch. Y - Chapter Title"
    const regexWithVol = /^(.*?)\s*-\s*Vol\.?\s*(\d+)?\s*Ch\.?\s*([\d.]+)\s*(?:-\s*(.*))?$/i;
    const regexWithoutVol = /^(.*?)\s*-\s*Ch\.?\s*([\d.]+)\s*(?:-\s*(.*))?$/i;

    let match = title.trim().match(regexWithVol);
    if (match) {
        mangaTitle = match[1]?.trim() || "Unknown Manga Title";
        volumeNo = match[2] || "";
        chapterNo = match[3] || "";
        chapterTitle = match[4]?.trim() || "";
    } else {
        match = title.trim().match(regexWithoutVol);
        if (match) {
            mangaTitle = match[1]?.trim() || "Unknown Manga Title";
            volumeNo = "";
            chapterNo = match[2] || "";
            chapterTitle = match[3]?.trim() || "";
        } else {
            mangaTitle = title.trim();
        }
    }

    return { mangaTitle, volumeNo, chapterNo, chapterTitle };
}