import { BookData } from "../types/books";

export function toBookData(row: any): BookData {
  return {
    bookId: Number(row["Book Id"]),
    title: row["Title"],
    author: row["Author"],
    additionalAuthors: row["Additional Authors"] || "",
    myRating: Number(row["My Rating"]),
    status: row["Exclusive Shelf"], // "read" | "to-read" | "currently-reading"
  };
}
