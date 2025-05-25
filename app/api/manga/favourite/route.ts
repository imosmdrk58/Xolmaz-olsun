/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://api.mangadex.org';
  const limit = 20;
  const maxResults = 10; // We only need top 10

  try {
    // Fetch manga ordered by follower count with all needed includes
    const response = await axios.get(`${baseUrl}/manga`, {
      params: {
        limit,
        offset: 0,
        includes: ['cover_art', 'author', 'artist', 'creator'],
        order: { followedCount: 'desc' },
      },
    });

    if (response.status !== 200) {
      console.error('Failed to fetch popular manga');
      return NextResponse.json(
        { error: 'Failed to fetch popular manga' },
        { status: response.status }
      );
    }

    // Process the batch
    const batchData = response.data.data || [];
    
    // Filter and process top manga with latest chapters
    const processedManga = batchData
      .filter((manga: any) => manga.attributes.latestUploadedChapter !== null)
      .slice(0, maxResults) // Take only top 10
      .map(processMangaItem);

    // If we have results, fetch their statistics in bulk
    if (processedManga.length > 0) {
      const mangaIds = processedManga.map((manga: { id: any; }) => manga.id);
      const statsResponse = await axios.get(`${baseUrl}/statistics/manga`, {
        params: { 'manga[]': mangaIds }
      });

      // Add ratings to each manga
      const mangaWithRatings = processedManga.map((manga: { id: string | number; }) => ({
        ...manga,
        rating: statsResponse.data.statistics?.[manga.id] || {}
      }));

      return NextResponse.json({ data: mangaWithRatings });
    }

    return NextResponse.json(
      { error: 'No popular manga with recent chapters found' },
      { status: 404 }
    );

  } catch (error: any) {
    const errorMessage = error?.response?.data?.errors?.[0]?.detail || 
                        error?.message || 
                        'An unknown error occurred';
    console.error('Error fetching popular manga:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch popular manga', details: errorMessage },
      { status: 500 }
    );
  }
}

// Reusing the same helper function from previous optimization
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