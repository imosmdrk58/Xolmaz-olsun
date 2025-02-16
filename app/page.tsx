'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 space-y-8">
      <h1 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">AI Manga Reader</h1>
      <p className="text-xl max-w-2xl text-gray-300 text-center leading-relaxed">
        Welcome to <span className="text-blue-500 font-semibold">AI_Manga_Reader</span> — your all-in-one platform for reading and translating manga pages effortlessly.
        Powered by <span className="text-blue-400">Next.js</span> for seamless performance, <span className="text-blue-400">MangaDex API</span> for an extensive manga collection,
        and <span className="text-blue-400">Gemini AI</span> for real-time manga page translation and AI-powered narration.
      </p>
      <p className="text-lg text-gray-400 max-w-2xl text-center">
        Explore thousands of manga titles, get instant translations, and let our AI read your favorite manga aloud while you sit back and enjoy.
      </p>
      <p className="text-md text-gray-500 max-w-xl text-center">
        Join our community of manga enthusiasts and elevate your manga reading experience with cutting-edge technology.
      </p>
      <button
        onClick={() => router.push('/manga-list')}
        className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl text-lg font-semibold"
      >
        Explore Manga Now
      </button>
    </div>
  );
}