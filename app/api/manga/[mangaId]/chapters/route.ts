/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';
import {allAvailableLanguages} from "../../../../constants/Flags"
const chaptersPerPage = 90;  // Adjust the number of chapters per request
const totalChaptersToFetch = 500; // Total chapters you want to fetch


export async function GET(req: Request, { params }: { params: { mangaId: string } }) {
    const { mangaId } = await params;
    let allChapters: any[] = [];

    const maxBatches = Math.ceil(totalChaptersToFetch / chaptersPerPage);

    try {
        console.log(`Fetching chapters for mangaId: ${mangaId}`);

        // Fetch chapters in batches for each available language

            for (let i = 0; i < maxBatches; i++) {
                const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}/feed`, {
                    params: {
                        translatedLanguage: allAvailableLanguages,
                        includes: ['manga', 'scanlation_group', 'user', 'cover_art', 'author', 'artist', 'tag'],
                        limit: chaptersPerPage,
                        offset: i * chaptersPerPage
                    }
                });

                const fetchedChapters = response.data.data;
                console.log(`Fetched ${fetchedChapters.length} chapters for language ${allAvailableLanguages}`);

                // Map the fetched data and format it
                const chapters = fetchedChapters.map((chapter: any) => ({
                    id: chapter.id,
                    title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'N/A'}`,
                    pageCount: chapter.attributes.pages || 'Unknown',
                    chapter: chapter.attributes.chapter || 'N/A',
                    translatedLanguage: chapter.attributes.translatedLanguage || 'Unknown Language',
                    publishAt: chapter.attributes.publishAt || 'Unknown Date',
                    readableAt: chapter.attributes.readableAt || 'Unknown Date',
                    externalUrl: chapter.attributes.externalUrl || 'No external URL',
                    url: `https://og.mangadex.org/og-image/chapter/${chapter.id}`,
                }));

                allChapters = [...allChapters, ...chapters];

                // If no chapters are returned, break the loop
                if (fetchedChapters.length === 0 || fetchedChapters.length < chaptersPerPage) {
                    console.log('No more chapters available for this language, stopping fetch.');
                    break;
                }
                // Ensure we only break if the number of chapters fetched exceeds the required total
                if (allChapters.length >= totalChaptersToFetch) {
                    break;
                }
            }


        const uniqueChapters = allChapters.reduce((acc, chapter) => {
            if (!acc.find((c: any) => c.id === chapter.id)) {
                acc.push(chapter);
            }
            return acc;
        }, []);
        console.log(`Total chapters fetched: ${uniqueChapters.length}`);

        // Slice the array to ensure we return the correct number of chapters
        return NextResponse.json({ chapters: uniqueChapters.slice(0, totalChaptersToFetch) });
    } catch (error: any) {
        console.error('Error fetching chapters:', error.response?.data || error.message || error);
        return NextResponse.json(
            { error: 'Failed to fetch chapters', details: error.response?.data || error.message },
            { status: 500 }
        );
    }
}
