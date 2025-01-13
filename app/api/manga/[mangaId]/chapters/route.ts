/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

const chaptersPerPage = 100;  // Adjust the number of chapters per request
const totalChaptersToFetch = 500; // Total chapters you want to fetch

export async function GET(req: Request, { params }: { params: { mangaId: string } }) {
  const { mangaId } = await params;
  let allChapters: any[] = [];
  let offset = 0;
  const maxBatches = Math.ceil(totalChaptersToFetch / chaptersPerPage);

  try {
    console.log(`Fetching chapters for mangaId: ${mangaId}`);

    // Fetch chapters in batches
    for (let i = 0; i < maxBatches; i++) {
      const response = await axios.get('https://api.mangadex.org/chapter', {
        params: {
          manga: mangaId,
          translatedLanguage: ['en'],
          order: { chapter: 'desc' },
          limit: chaptersPerPage,
          offset: offset,
        },
      });

      console.log(`Fetched ${response.data.data.length} chapters for offset: ${offset}`);

      const chapters = response.data.data
        .filter((chapter: any) => chapter.attributes && chapter.attributes.pages) // Ensure valid chapters
        .map((chapter: any) => ({
          id: chapter.id,
          title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'N/A'}`,
          pageCount: chapter.attributes.pages || 'Unknown',
          chapter: chapter.attributes.chapter || 'N/A',
          url: `https://og.mangadex.org/og-image/chapter/${chapter.id}`,
        }));

      // Add fetched chapters to the allChapters array
      allChapters = allChapters.concat(chapters);

      // Increment the offset for the next batch
      offset += chaptersPerPage;

      // If we have reached the desired number of chapters, stop fetching
      if (allChapters.length >= totalChaptersToFetch) {
        break;
      }
    }

    console.log(`Total chapters fetched: ${allChapters.length}`);

    return NextResponse.json({ chapters: allChapters.slice(0, totalChaptersToFetch) });
  } catch (error: any) {
    console.error('Error fetching chapters:', error.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
