'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null); // Track error state
  const router = useRouter();

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error before making request
        const response = await fetch(`/api/manga?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch mangas');
        const data = await response.json();
        console.log(data)
        setMangas([ ...(data.data || [])]);
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMangas();
  }, [page]);

  const loadMoreMangas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Discover Mangas</h1>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>} {/* Display error */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mangas.map((manga) => {
          const {
            id,
            attributes: {
              title,
              description,
              altTitles,
              contentRating,
              status,
              year,
              updatedAt,
              tags,
            },
            relationships,
          } = manga;
          console.log(manga)
          const coverArt = relationships.find((rel) => rel.type === 'cover_art');
          const coverImageUrl = coverArt
            ? `https://og.mangadex.org/og-image/manga/${id}`
            : '';

          const author = relationships.find((rel) => rel.type === 'author');
          const artist = relationships.find((rel) => rel.type === 'artist');
          const authorName = author?.attributes?.name || 'Unknown Author';
          const artistName = artist?.attributes?.name || 'Unknown Artist';

          return (
            <div
              key={id}
              className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/manga/${id}/chapters`)}
            >
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={coverImageUrl || '/placeholder.jpg'}
                  alt={title?.en || 'Unknown Title'}
                  width={500}
                  height={750}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-lg"
                  placeholder="blur"
                  blurDataURL="/placeholder.jpg" // Base64 or a static image path
                />
              </div>
              <h2 className="text-lg font-semibold truncate">{title?.en || 'Untitled'}</h2>
              <p className="text-sm text-gray-600 truncate">
                Alternative Title: {altTitles?.[0]?.ja || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 truncate">Author: {authorName}</p>
              <p className="text-sm text-gray-600 truncate">Artist: {artistName}</p>
              <p className="text-sm text-gray-600 truncate">Content Rating: {contentRating}</p>
              <p className="text-sm text-gray-600 truncate">Status: {status || 'Unknown'}</p>
              <p className="text-sm text-gray-600 truncate">Year: {year || 'N/A'}</p>
              <p className="text-sm text-gray-600 truncate">
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {description?.en ||
                  'No description available for this manga. Click to learn more.'}
              </p>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-200 rounded-full mr-2 mb-2"
                  >
                    {tag.attributes?.name?.en || 'Unknown Tag'}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center mt-6">Loading more mangas...</div>
      ) : (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreMangas}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
