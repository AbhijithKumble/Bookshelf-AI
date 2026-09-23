import { BookData } from "../types/books";

export function toBookData(row: unknown): BookData {
  const r = row as Record<string, string>;
  return {
    bookId: Number(r["Book Id"]),
    title: r["Title"],
    author: r["Author"],
    additionalAuthors: r["Additional Authors"] || "",
    myRating: Number(r["My Rating"]),
    status: r["Exclusive Shelf"], // "read" | "to-read" | "currently-reading"
  };
}
