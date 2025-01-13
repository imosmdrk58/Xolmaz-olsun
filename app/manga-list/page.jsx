'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MangaCard from "../Components/MangaCard";
import AsideComponent from "../Components/AsideComponent";

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [processedMangas, setProcessedMangas] = useState([]);
  const [processedLatestMangas, setProcessedLatestMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();

  const clearAndSaveToLocalStorage = (key, data) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const fetchMangas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch main mangas
      const response = await fetch(`/api/manga?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch mangas');
      const data = await response.json();
      const newMangas = data.data || [];
      setMangas((prevMangas) => [...prevMangas, ...newMangas]);

      // Fetch latest mangas
      const additionalResponse = await fetch(`/api/manga/latest?page=${page}`);
      if (!additionalResponse.ok) throw new Error('Failed to fetch latest manga details');
      const additionalData = await additionalResponse.json();
      const newLatestMangas = additionalData.data || [];
      setLatestMangas((prevMangas) => [...prevMangas, ...newLatestMangas]);

      // Save fetched data to local storage
      clearAndSaveToLocalStorage('mangas', [...mangas, ...newMangas]);
      clearAndSaveToLocalStorage('latestMangas', [...latestMangas, ...newLatestMangas]);
    } catch (error) {
      setError(error.message || 'An unknown error occurred');
      console.error('Error fetching mangas:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMangaData = async (mangaList) => {
    return await Promise.all(
      mangaList.map(async (manga) => {
        const {
          id,
          attributes: { title, description, altTitles, contentRating, status, year, updatedAt, tags },
          relationships,
        } = manga;

        const coverArt = relationships.find((rel) => rel.type === 'cover_art');
        const coverImageUrl = coverArt ? `https://og.mangadex.org/og-image/manga/${id}` : '';

        const author = relationships.find((rel) => rel.type === 'author');
        const artist = relationships.find((rel) => rel.type === 'artist');
        const authorName = author?.attributes?.name || 'Unknown Author';
        const artistName = artist?.attributes?.name || 'Unknown Artist';

        let rating = 0;
        try {
          const ratingResponse = await fetch(`https://api.mangadex.org/statistics/manga/${id}`);
          if (ratingResponse.ok) {
            const ratingData = await ratingResponse.json();
            rating = ratingData.statistics[id] || 0;
          }
        } catch (err) {
          console.error(`Error fetching rating for manga ID ${id}:`, err);
        }

        return {
          id,
          title: title?.en || Object?.values(altTitles[0])[0] || 'Untitled',
          description: description?.en || 'No description available for this manga.',
          altTitle: Object.values(altTitles[0] ?? { none: "N/A" })[0] || 'N/A',
          contentRating: contentRating || 'N/A',
          status: status || 'Unknown',
          year: year || 'N/A',
          updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
          tags: tags.map((tag) => tag.attributes?.name?.en || 'Unknown Tag'),
          coverImageUrl,
          authorName,
          artistName,
          rating,
        };
      })
    );
  };

  useEffect(() => {
    const storedMangas = JSON.parse(localStorage.getItem('mangas') || '[]');
    const storedLatestMangas = JSON.parse(localStorage.getItem('latestMangas') || '[]');

    if (Array.isArray(storedMangas) && Array.isArray(storedLatestMangas)) {
      setMangas(storedMangas);
      setLatestMangas(storedLatestMangas);
    } else {
      fetchMangas();
    }
  }, [page]);

  useEffect(() => {
    (async () => {
      const processed = await processMangaData(mangas);
      setProcessedMangas(processed);

      const processedLatest = await processMangaData(latestMangas);
      setProcessedLatestMangas(processedLatest);
    })();
  }, [mangas, latestMangas]);

  const loadMoreMangas = () => setPage((prevPage) => prevPage + 1);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">Discover Mangas</h1>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="grid w-8/12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6">
          {processedLatestMangas.map((manga) => (
            <a
              key={manga.id}
              href={`http://localhost:3000/manga/${manga.id}/chapters`}
              className="group p-4 bg-gray-800 shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer hover:bg-gray-700"
            >
              <MangaCard id={manga.id} manga={manga} />
            </a>
          ))}
        </div>
        <div className='w-4/12'>
        <AsideComponent memoizedMangas={processedMangas} />
        </div>

      </div>
      {loading ? (
        <div className="text-center mt-6 text-indigo-400">Loading more mangas...</div>
      ) : (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreMangas}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
