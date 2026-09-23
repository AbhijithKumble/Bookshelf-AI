import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import * as csv from "csv-parse/sync";
import { toBookData } from "@/utils/csvtobookinterface";
import { BookData } from "@/types/books";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: "Unauthorized access",
    });
  }

  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({
      success: false,
      status: 400,
      message: "file upload failed",
    });
  }

  // Convert file → Buffer (in-memory only — no filesystem write needed)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Parse CSV
  const csvText = buffer.toString("utf-8");
  const records = csv.parse(csvText, { columns: true, skip_empty_lines: true });
  const books: BookData[] = records.map(toBookData);

  // Ensure user exists
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId },
  });

  // Delete existing book data for this user before inserting fresh data
  // so re-uploading a new CSV always reflects the latest Goodreads export
  await prisma.bookData.deleteMany({
    where: { userId },
  });

  await prisma.bookData.createMany({
    data: books.map((b) => ({
      bookId: b.bookId,
      title: b.title,
      author: b.author,
      additionalAuthors: b.additionalAuthors,
      myRating: b.myRating,
      status: b.status,
      userId: userId,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({
    success: true,
    status: 200,
    message: "csv file upload successful",
  });
}
