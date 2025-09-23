import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { GoogleGenAI, Type } from "@google/genai";

const prisma = new PrismaClient();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple in-memory cache per user, keyed by userId
type RecommendationPayload = { recommendations: any[]; sourceImageId: number | null };
type CacheEntry = { ts: number; imageId: number | null; historySig: string; data: RecommendationPayload };
const recommendationCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get ONLY the most recently uploaded image for this user
    const latestImage = await prisma.bookImage.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { books: { include: { book: true } } },
    });

    // (cache check moved below after we compute historySig)

    const booksFromLatestImage = (latestImage?.books || []).map((b) => ({
      title: b.book.title,
      author: b.book.author,
    }));

    // Get user's Goodreads CSV data that we stored
    const userBooksData = await prisma.bookData.findMany({
      where: { userId },
      select: {
        title: true,
        author: true,
        myRating: true,
        status: true,
      },
    });

    // Derive a short profile for context
    const readOrRatedTitles = userBooksData
      .filter((b) => (b.status || "").toLowerCase() === "read" || (b.myRating ?? 0) > 0)
      .map((b) => `${b.title} by ${b.author} (rating: ${b.myRating ?? 0})`);

    // Simple history signature to invalidate cache when Goodreads data changes materially
    const historySig = `${userBooksData.length}`;

    // Try cache: reuse when latest image is unchanged, history unchanged, and entry is fresh
    const cacheKey = userId;
    const cached = recommendationCache.get(cacheKey);
    if (
      cached &&
      cached.imageId === (latestImage?.imgId ?? null) &&
      cached.historySig === historySig &&
      Date.now() - cached.ts < CACHE_TTL_MS
    ) {
      return NextResponse.json(cached.data);
    }

    // Build Gemini contents
    const prompt = `You are a book recommendation expert. Given the user's Goodreads history and the books detected in the user's latest uploaded bookshelf image, evaluate interest for each detected book.`;

    const contents = [
      { text: prompt },
      {
        text: `User Goodreads snapshot (title, author, rating, status):\n${readOrRatedTitles.slice(0, 300).join("\n") || "none"}`,
      },
      {
        text: `User Goodreads structured history JSON (use exact titles from here for matching):\n${JSON.stringify(
          userBooksData
            .slice(0, 300)
            .map((b) => ({ title: b.title, author: b.author, rating: b.myRating ?? 0, status: (b.status || '').toLowerCase() })),
        )}`,
      },
      {
        text: `Books detected from the latest image (evaluate ONLY these):\n${booksFromLatestImage
          .map((b) => `${b.title} by ${b.author}`)
          .join("\n") || "none"}`,
      },
      {
        text:
          "For EACH detected book, return JSON array with objects: { title, author, willRead (boolean), why (string <= 280 chars), score (0-1 float) }.\n- The 'why' MUST explicitly reference 1-2 specific books from the user's previously read or highly rated history using exact titles from the provided history JSON.\n- If the candidate already appears in the user's history with status 'read' or rating > 0, set willRead=false and explain it's already read (include rating if present).\n- Base similarity on author overlap, genre, themes, style/tone, pacing, audience, or subject matter.\n- If no strong match exists, briefly say so and base on general preferences observed.\n- Evaluate ONLY the books from the latest image.\n- Respond ONLY with JSON.",
      },
    ];

    const aiResponse = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              willRead: { type: Type.BOOLEAN },
              why: { type: Type.STRING },
              score: { type: Type.NUMBER },
            },
          },
        },
      },
    });

    const recommendations = JSON.parse(aiResponse.text || "[]");
    // console.log(recommendations);
    const payload: RecommendationPayload = {
      recommendations,
      sourceImageId: latestImage?.imgId || null,
    };

    // Store in cache
    recommendationCache.set(cacheKey, {
      ts: Date.now(),
      imageId: latestImage?.imgId ?? null,
      historySig,
      data: payload,
    });

    return NextResponse.json(payload);
  } catch (err: any) {
    // console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

