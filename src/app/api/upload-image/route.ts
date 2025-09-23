import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { PrismaClient } from "@/generated/prisma";
import { getBookNamesFromLLM } from "@/utils/getBookNamesFromLLM";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    //Check if user is authenticated
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    //Get file from formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    //Convert file → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    //Generate unique file name
    const timestamp = Date.now();
    const fileName = `${userId}-${timestamp}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    //Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    //Ensure user exists
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    //Get book names from LLM
    const jsonArray = await getBookNamesFromLLM(filePath);

    //Create the image once
    const imageRecord = await prisma.bookImage.create({
      data: {
        imgPath: `/uploads/${fileName}`,
        userId: userId,
      },
    });

    //For each book, create/find book, then link image
    for (const book of jsonArray) {
      //Use findFirst instead of upsert if title is not unique
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

      //Link the image to the book via the join table
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

