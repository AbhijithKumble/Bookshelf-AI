// utils/getUserPreferenceBooks.ts
export type Book = {
  title: string;
  author: string;
  willRead?: boolean;
  why?: string;
  score?: number; // similarity score from Gemini
};

// Simple client-side in-memory cache to prevent duplicate calls across remounts
type CacheEntry = { ts: number; data: Book[] };
let cacheEntry: CacheEntry | null = null;
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function getUserPreferenceBooks(): Promise<Book[]> {
  try {
    // Serve from cache if fresh
    if (cacheEntry && Date.now() - cacheEntry.ts < CLIENT_CACHE_TTL_MS) {
      return cacheEntry.data;
    }

    const res = await fetch("/api/get-recommendation"); // your GET endpoint
    if (!res.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    const data = await res.json();
    // API returns { recommendations: [{ title, author, willRead?, why?, score? }], sourceImageId }
    const result: Book[] = data.recommendations || [];

    // Update cache
    cacheEntry = { ts: Date.now(), data: result };
    return result;
  } catch (_err) {
    // console.error("Error fetching user preference books:", _err);
    return [];
  }
}

