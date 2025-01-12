/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';

  try {
    const mangaResponse = await axios.get(`${baseUrl}/manga`, {
      params: {
        limit: 10, // Fetch up to 10 manga for demonstration
        includes: ['author', 'artist'],
        order: { relevance: 'desc' },
      },
    });

    return NextResponse.json(mangaResponse.data); // Return the manga list
  } catch (error: any) {
    const errorMessage = error?.message || 'An unknown error occurred';
    console.error('Error fetching manga list:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch manga list', details: errorMessage });
  }
}
