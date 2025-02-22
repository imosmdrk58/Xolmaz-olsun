/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';
  const limit = 50; // Limit for each API call
  const maxBatches = 3; // Increased number of batches to get more manga
  let allManga: any[] = [];
  let offset = 0;

  try {
    // Fetch manga ordered by follower count
    for (let i = 0; i < maxBatches; i++) {
      const response = await axios.get(`${baseUrl}/manga`, {
        params: {
          limit,
          offset,
          includes: ['id', 'title', 'cover_art'],
          order: { updatedAt: 'desc'  }, 
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        
        // Filter out manga without chapters or covers
        const filteredData = data.filter((manga: any) => {
          const hasChapters = manga.attributes.latestUploadedChapter !== null;
          const hasCoverArt = manga.relationships?.some((rel: any) => rel.type === 'cover_art');
          return hasChapters && hasCoverArt;
        });

        allManga = allManga.concat(filteredData);
      } else {
        console.error(`Failed to fetch manga for batch offset: ${offset}`);
      }
      offset += limit;
    }

    // Remove duplicates (if any)
    const uniqueManga = Array.from(
      new Map(allManga.map((manga: any) => [manga.id, manga])).values()
    );

    // Add error handling for empty results
    if (uniqueManga.length === 0) {
      return NextResponse.json(
        { error: 'No manga found matching the criteria' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      data: uniqueManga,
      total: uniqueManga.length,
      offset,
      limit: limit * maxBatches
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors || error?.message || 'An unknown error occurred';
    console.error('Error fetching manga list:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch manga list', details: errorMessage },
      { status: 500 }
    );
  }
}