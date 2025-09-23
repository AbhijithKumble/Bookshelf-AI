import { getAuth } from "@clerk/nextjs/server";
import { writeFile } from "fs";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
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
      message: "Unauthorized access"
    });
  }

  const data = await req.formData();

  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({
      success: false,
      status: 400,
      message: "file upload failed"
    });
  }

  // Convert file → Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  //  Save file to backend
  const uploadDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadDir, file.name);
  writeFile(filePath, buffer, (err) => {
    // console.log(`file cannot be wriiten ${err}`)
  });

  // Parse CSV
  const csvText = buffer.toString("utf-8");
  const records = csv.parse(csvText, { columns: true, skip_empty_lines: true });
  const books: BookData[] = records.map(toBookData);

  const userPresent = await prisma.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  if (!userPresent) {
    await prisma.user.create({
      data: {
        clerkId: userId
      }
    });
  }

  await prisma.bookData.createMany({
    data: books.map((b) => ({
      bookId: b.bookId,
      title: b.title,
      author: b.author,
      additionalAuthors: b.additionalAuthors,
      myRating: b.myRating,
      status: b.status,
      userId: userId, // foreign key
    })),
  });

  return NextResponse.json({
    success: true,
    status: 200,
    message: "csv file upload successfull"
  })

}
