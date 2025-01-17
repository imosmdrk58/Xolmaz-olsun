/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';
  const limit = 100; // Fetch a large number of mangas to randomize
  let allManga: any[] = [];

  try {
    // Fetch a large list of mangas
    const response = await axios.get(`${baseUrl}/manga`, {
      params: {
        limit,
        includes: ['id', 'title', 'cover_art'],
        order: { updatedAt: 'desc' }, // Ensure we get recent mangas
      },
    });

    if (response.status === 200) {
      const data = response.data.data.filter(
        (manga: any) => manga.attributes.latestUploadedChapter !== null
      );
      allManga = data;
    } else {
      console.error('Failed to fetch manga.');
    }

    // Shuffle the manga list for randomness
    const shuffledManga = allManga.sort(() => Math.random() - 0.5);

    // Select a smaller random subset
    const randomManga = shuffledManga.slice(0, 10);

    return NextResponse.json({ data: randomManga });
  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors || error?.message || 'An unknown error occurred';
    console.error('Error fetching manga list:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch manga list', details: errorMessage },
      { status: 500 }
    );
  }
}
