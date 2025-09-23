export interface GoodreadsBook {
  BookId: number;
  Title: string;
  Author: string;
  AuthorLF: string;              // "Author l-f" (last, first format)
  AdditionalAuthors?: string;    // optional since often blank
  ISBN?: string;                 // string because of leading "=" in export
  ISBN13?: string;
  MyRating: number;              // user’s rating (0 if not rated)
  AverageRating: number;         // global Goodreads average rating
  Publisher?: string;
  Binding?: string;              // e.g., Hardcover, Paperback
  NumberOfPages?: number;
  YearPublished?: number;
  OriginalPublicationYear?: number;
  DateRead?: string;             // YYYY/MM/DD
  DateAdded: string;             // YYYY/MM/DD
  Bookshelves?: string;          // comma-separated list
  BookshelvesWithPositions?: string;
  ExclusiveShelf: string;        // "read" | "to-read" | "currently-reading"
  MyReview?: string;
  Spoiler?: string;
  PrivateNotes?: string;
  ReadCount?: number;
  OwnedCopies?: number;
}

