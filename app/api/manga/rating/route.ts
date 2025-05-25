/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

// Configuration constants
const CONFIG = {
  baseUrl: 'https://api.mangadex.org',
  fetchLimit: 20,
  resultLimit: 10,
  includes: ['cover_art', 'author', 'artist', 'creator'],
  order: { rating: 'desc' }
};

export async function GET() {
  try {
    // Fetch top-rated manga with all needed includes
    const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
      params: {
        limit: CONFIG.fetchLimit,
        includes: CONFIG.includes,
        order: CONFIG.order,
      },
    });

    if (response.status !== 200) {
      console.error('Failed to fetch top-rated manga:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch top-rated manga' },
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
      .slice(0, CONFIG.resultLimit) // Take only top results
      .map(processMangaItem);

    if (validManga.length === 0) {
      return NextResponse.json(
        { error: 'No valid top-rated manga found' },
        { status: 404 }
      );
    }

    // Fetch statistics for the top-rated manga
    const statsResponse = await axios.get(`${CONFIG.baseUrl}/statistics/manga`, {
      params: { 'manga[]': validManga.map((manga: { id: any; }) => manga.id) }
    });

    // Add ratings to each manga (using both the ordered rating and statistics)
    const mangaWithRatings = validManga.map((manga: { id: string | number; attributes: { rating: { bayesian: any; }; }; }) => ({
      ...manga,
      rating: {
        ...(statsResponse.data.statistics?.[manga.id] || {}),
        // Include the ordering rating from the main query
        bayesian: manga.attributes?.rating?.bayesian || 0
      }
    }));

    return NextResponse.json({ 
      data: mangaWithRatings,
      total: validManga.length
    });

  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors?.[0]?.detail || 
                        error?.message || 
                        'An unknown error occurred';
    console.error('Error fetching top-rated manga:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch top-rated manga', details: errorMessage },
      { status: 500 }
    );
  }
}

// Manga processing function (optimized)
function processMangaItem(manga: any) {
  const { id, attributes, relationships } = manga;
  
  // Destructure with defaults
  const {
    title = {},
    altTitles = [],
    description = {},
    contentRating = 'N/A',
    status = 'Unknown',
    year = 'N/A',
    updatedAt,
    tags = [],
    publicationDemographic,
    links = {},
    availableTranslatedLanguages = [],
    latestUploadedChapter,
    originalLanguage
  } = attributes;

  // Process relationships in single pass
  const groupedRelationships = relationships.reduce((acc: Record<string, any[]>, rel: { type: string | number; }) => {
    (acc[rel.type] = acc[rel.type] || []).push(rel);
    return acc;
  }, {});

  // Process cover art
  const coverArt = groupedRelationships.cover_art?.[0]?.attributes?.fileName;
  const coverImageUrl = coverArt ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg` : '';

  // Process tags in single pass
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
    title: title.en || Object.values(altTitles[0] || {})[0] || 'Untitled',
    description: description.en || 'No description available.',
    altTitle: Object.values(altTitles[0] || { none: 'N/A' })[0] || 'N/A',
    contentRating,
    status,
    altTitles,
    year,
    updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
    tags: Object.entries(groupedTags).map(([group, tags]) => ({ group, tags })),
    flatTags,
    coverImageUrl,
    authorName: groupedRelationships.author,
    artistName: groupedRelationships.artist,
    creatorName: groupedRelationships.creator || 'N/A',
    MangaStoryType: publicationDemographic,
    availableTranslatedLanguages,
    latestUploadedChapter,
    originalLanguage,
    type: manga.type,
    links,
    // Note: rating will be added later from statistics
  };
}