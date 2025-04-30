/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { mangaId: string } }) {
  const { mangaId } = await params;
  const baseUrl = 'https://api.mangadex.org';

  if (!mangaId) {
    return NextResponse.json(
      { error: 'Manga ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(`${baseUrl}/manga/${mangaId}`, {
      params: {
        includes: ['id', 'title', 'cover_art','author', 'artist'],
      },
    });

    if (response.status !== 200) {
      return NextResponse.json(
        { error: 'Failed to fetch manga' },
        { status: response.status }
      );
    }

    const manga = response.data.data;

    // Validate manga data
    if (!manga || response.data.result !== 'ok') {
      return NextResponse.json(
        { error: 'Invalid manga data' },
        { status: 500 }
      );
    }

    // Check for chapters, cover art, and family-friendly rating
    const hasChapters = manga.attributes.latestUploadedChapter !== null;
    const hasCoverArt = manga.relationships.some((rel: any) => rel.type === 'cover_art');
    const hasEnglishTitle = manga.attributes.title.en;

    if (!hasChapters || !hasCoverArt || !hasEnglishTitle) {
      return NextResponse.json(
        {
          error: 'Manga does not meet requirements (missing chapters, cover art, safe rating, or English title)',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: manga });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const errorMessage =
      error?.response?.data?.errors?.[0]?.detail || error?.message || 'An unknown error occurred';
    console.error(`Error fetching manga ${mangaId}:`, errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch manga', details: errorMessage },
      { status }
    );
  }
}
