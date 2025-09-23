"use client";

import { useEffect, useState } from "react";
import { getUserPreferenceBooks, Book } from "@/utils/getRecommendationFromLLM";
import toast from "react-hot-toast";

export default function SimilarBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = (globalThis as any).__rec_fetching_ref__ || { current: false };
  ;(globalThis as any).__rec_fetching_ref__ = isFetchingRef;

  useEffect(() => {
    async function fetchBooks() {
      if (isFetchingRef.current) return; // prevent duplicate trigger (e.g., StrictMode)
      isFetchingRef.current = true;
      try {
        setError(null);
        setLoading(true);
        const recommended = await getUserPreferenceBooks();
        setBooks(recommended);
      } catch (e: any) {
        const msg = e?.message || "Failed to fetch recommendations";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 border rounded-xl">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!books.length) {
    return (
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No recommendations available</h2>
            <p className="text-gray-600">
              Upload an image and your Goodreads CSV to see personalized suggestions.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Recommendations</h2>
          <p className="text-gray-600 mt-2">Grounded in your reading history and latest image</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {books.map((book, index) => (
              <div key={index} className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {typeof book.score === "number" && (
                      <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {Math.round(book.score * 100)}%
                      </span>
                    )}
                    {typeof book.willRead === "boolean" && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${book.willRead ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {book.willRead ? "Will Read" : "Unlikely"}
                      </span>
                    )}
                  </div>
                </div>
                {book.why && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {book.why}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

