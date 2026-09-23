import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { PrismaClient } from "@/generated/prisma";
import { getBookNamesFromLLM } from "@/utils/getBookNamesFromLLM";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Get file from formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Convert file → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Vercel Blob (persistent, CDN-backed storage)
    const timestamp = Date.now();
    const blobFileName = `user_${userId}-${timestamp}-${file.name}`;
    const blob = await put(blobFileName, buffer, {
      access: "public",
      contentType: file.type,
    });

    // Ensure user exists
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    // Get book names from LLM — pass buffer directly, no disk read needed
    const jsonArray = await getBookNamesFromLLM(buffer, file.type);

    // Create the image record with the blob URL
    const imageRecord = await prisma.bookImage.create({
      data: {
        imgPath: blob.url,
        userId: userId,
      },
    });

    // For each book, find or create book record, then link to image
    for (const book of jsonArray) {
      let bookRecord = await prisma.bookName.findFirst({
        where: {
          title: book.BookName,
          author: book.AuthorName,
        },
      });

      if (!bookRecord) {
        bookRecord = await prisma.bookName.create({
          data: {
            title: book.BookName,
            author: book.AuthorName,
          },
        });
      }

      // Link the image to the book via the join table
      await prisma.bookImageBook.create({
        data: {
          bookId: bookRecord.id,
          bookImageId: imageRecord.imgId,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Books and image saved successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
