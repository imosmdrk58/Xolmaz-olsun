/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request, { params }: { params: { chapterId: string } }) {
  const { chapterId } = await params;

  try {
    console.log('Fetching pages for chapterId:', chapterId);
    const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const pages = response.data.chapter.data.map(
      (page: string) => `${response.data.baseUrl}/data/${response.data.chapter.hash}/${page}`
    );

    return NextResponse.json({ images: pages });
  } catch (error: any) {
    console.error('Error fetching chapter pages:', error.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter pages', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
