/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

// Configuration constants
const CONFIG = {
  baseUrl: 'https://api.mangadex.org',
  fetchLimit: 100, // Fetch more to get better randomization
  resultLimit: 10,
  includes: ['cover_art', 'author', 'artist', 'creator'],
};

export async function GET() {
  try {
    // Fetch manga with all needed includes
    const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
      params: {
        limit: CONFIG.fetchLimit,
        includes: CONFIG.includes,
      },
    });

    if (response.status !== 200) {
      console.error('Failed to fetch manga:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch manga list' },
        { status: response.status }
      );
    }

    // Process the response
    const mangaList = response.data.data || [];
    
    // Filter and process valid manga
    const validManga = mangaList
      .filter((manga: any) => (
        manga.attributes.latestUploadedChapter !== null &&
        manga.relationships?.some((rel: any) => rel.type === 'cover_art')
      ))
      .map(processMangaItem);

    if (validManga.length === 0) {
      return NextResponse.json(
        { error: 'No valid manga found' },
        { status: 404 }
      );
    }

    // Get random subset (more efficient than full shuffle)
    const randomManga = getRandomSubset(validManga, CONFIG.resultLimit);

    // Fetch statistics for just the random subset
    const statsResponse = await axios.get(`${CONFIG.baseUrl}/statistics/manga`, {
      params: { 'manga[]': randomManga.map(manga => manga.id) }
    });

    // Add ratings to each manga
    const mangaWithRatings = randomManga.map(manga => ({
      ...manga,
      rating: statsResponse.data.statistics?.[manga.id] || {}
    }));

    return NextResponse.json({ data: mangaWithRatings });

  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors?.[0]?.detail || 
                        error?.message || 
                        'An unknown error occurred';
    console.error('Error fetching random manga:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch random manga', details: errorMessage },
      { status: 500 }
    );
  }
}

// Efficient random subset selection without full shuffle
function getRandomSubset(array: any[], count: number) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0 && count > 0; i--, count--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(-count);
}

// Manga processing function (reused from previous optimizations)
function processMangaItem(manga: any) {
  const { id, attributes, relationships } = manga;
  const {
    title,
    altTitles = [],
    description,
    contentRating,
    status,
    year,
    updatedAt,
    tags = [],
    publicationDemographic,
    links,
    availableTranslatedLanguages,
    latestUploadedChapter,
    originalLanguage,
  } = attributes;

  // Process relationships
  const groupedRelationships = relationships.reduce((acc: Record<string, any[]>, rel: { type: string | number; }) => {
    (acc[rel.type] = acc[rel.type] || []).push(rel);
    return acc;
  }, {});

  // Process cover art
  const coverArt = groupedRelationships.cover_art?.[0]?.attributes?.fileName;
  const coverImageUrl = coverArt ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg` : '';

  // Process tags
   const { groupedTags, flatTags } = tags.reduce((acc: { groupedTags: { [x: string]: any[]; }; flatTags: any[]; }, tag: { attributes: { group: string; name: { en: string; }; }; }) => {
    const group = tag.attributes?.group || 'Unknown Group';
    const tagName = tag.attributes?.name?.en || 'Unknown Tag';
    acc.groupedTags[group] = acc.groupedTags[group] || [];
    acc.groupedTags[group].push(tagName);
    acc.flatTags.push(tagName);
    return acc;
  }, { groupedTags: {} as Record<string, string[]>, flatTags: [] as string[] });

  return {
    id,
    title: title?.en || Object.values(altTitles[0] || {})[0] || 'Untitled',
    description: description?.en || 'No description available.',
    altTitle: Object.values(altTitles[0] || { none: 'N/A' })[0] || 'N/A',
    contentRating: contentRating || 'N/A',
    status: status || 'Unknown',
    altTitles,
    year: year || 'N/A',
    updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
    tags: Object.entries(groupedTags).map(([group, tags]) => ({ group, tags })),
    flatTags,
    coverImageUrl,
    authorName: groupedRelationships.author,
    artistName: groupedRelationships.artist,
    creatorName: groupedRelationships.creator || 'N/A',
    MangaStoryType: publicationDemographic,
    availableTranslatedLanguages: availableTranslatedLanguages || [],
    latestUploadedChapter,
    originalLanguage,
    type: manga.type,
    links,
  };
}