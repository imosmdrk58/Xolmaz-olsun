/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request, { params }: { params: { mangaId: string } }) {
  const { mangaId } = await params;

  try {
    console.log(`Fetching chapters for mangaId: ${mangaId}`);
    const response = await axios.get('https://api.mangadex.org/chapter', {
      params: {
        manga: mangaId,
        translatedLanguage: ['en'],
        order: { chapter: 'asc' }, // Order by ascending chapter numbers
        limit: 100, // Fetch up to 100 chapters at once
      },
    });
    console.log(response.data);
    const chapters = response.data.data.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'N/A'}`,
      pageCount: chapter.attributes.pages || 'Unknown',
      chapter:chapter.attributes.chapter 
    }));

    return NextResponse.json({ chapters });
  } catch (error: any) {
    console.error('Error fetching chapters:', error.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
