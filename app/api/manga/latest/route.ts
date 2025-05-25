/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';
  const limit = 50;
  const maxBatches = 3;
  const maxResults = 100;
  let allManga: any[] = [];

  try {
    // Prepare batch requests
    const batchRequests = Array.from({ length: maxBatches }, (_, i) => {
      return axios.get(`${baseUrl}/manga`, {
        params: {
          limit,
          offset: i * limit,
          includes: ['cover_art', 'author', 'artist', 'creator'],
          order: { updatedAt: 'desc' },
        },
      });
    });

    // Execute all requests in parallel
    const responses = await Promise.all(batchRequests);

    // Process responses
    for (const response of responses) {
      if (response.status === 200) {
        const batchData = response.data.data || [];

        // Filter and process manga in one pass
        const processedBatch = batchData
          .filter((manga: any) => (
            manga.attributes.latestUploadedChapter !== null &&
            manga.relationships?.some((rel: any) => rel.type === 'cover_art')
          ))
          .map(processMangaItem);

        allManga = [...allManga, ...processedBatch];

        // Early exit if we've reached our max results
        if (allManga.length >= maxResults) break;
      }
    }

    // Remove duplicates and limit results
    const uniqueManga = Array.from(
      new Map(allManga.map(manga => [manga.id, manga])).values()
    ).slice(0, maxResults);

    if (uniqueManga.length === 0) {
      return NextResponse.json(
        { error: 'No manga found matching the criteria' },
        { status: 404 }
      );
    }

    // Fetch statistics in bulk for the final results
    const mangaIds = uniqueManga.map(manga => manga.id);
    const statsResponse = await axios.get(`${baseUrl}/statistics/manga`, {
      params: { 'manga[]': mangaIds }
    });

    // Add ratings to each manga
    const mangaWithRatings = uniqueManga.map(manga => ({
      ...manga,
      rating: statsResponse.data.statistics?.[manga.id] || {}
    }));

    return NextResponse.json({
      data: mangaWithRatings,
      total: mangaWithRatings.length,
      limit: maxResults
    });

  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors?.[0]?.detail ||
      error?.message ||
      'An unknown error occurred';
    console.error('Error fetching manga list:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch manga list', details: errorMessage },
      { status: 500 }
    );
  }
}

// Helper function to process individual manga items
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
    acc[rel.type] = acc[rel.type] || [];
    acc[rel.type].push(rel);
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

  const groupedTagsArray = Object.entries(groupedTags).map(([group, tags]) => ({
    group,
    tags,
  }));

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
    tags: groupedTagsArray,
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
    // Rating will be added later in bulk
  };
}