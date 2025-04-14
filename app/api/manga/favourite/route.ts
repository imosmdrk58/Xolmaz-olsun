/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';
  const limit = 20; // Limit for each API call
  const maxBatches = 1; // Additional batches for add-ons
  let allManga: any[] = [];
  let offset = 0;

  try {
    // Fetch manga ordered by follower count
    for (let i = 0; i < maxBatches; i++) {
      const response = await axios.get(`${baseUrl}/manga`, {
        params: {
          limit,
          offset,
          includes: ['id', 'title', 'cover_art','author', 'artist'],
          order: { followedCount: 'desc' }, // Order by follower count
        },
      });

      if (response.status === 200) {
        const data = response.data.data.filter(
          (manga: any) => manga.attributes.latestUploadedChapter !== null
        );
        allManga = allManga.concat(data);
      } else {
        console.error(`Failed to fetch manga for batch offset: ${offset}`);
      }
      offset += limit;
    }

    // Remove duplicates (if any)
    const uniqueManga = Array.from(
      new Map(allManga.slice(0, 10).map((manga: any) => [manga.id, manga])).values()
    );
    

    return NextResponse.json({ data: uniqueManga });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors || error?.message || 'An unknown error occurred';
    console.error('Error fetching manga list:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch manga list', details: errorMessage },
      { status: 500 }
    );
  }
}
