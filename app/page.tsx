'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Manga Reader</h1>
      <p className="text-lg mb-6">Discover and read your favorite manga in a seamless way.</p>
      <button
        onClick={() => router.push('/manga-list')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Start Reading
      </button>
    </div>
  );
}
