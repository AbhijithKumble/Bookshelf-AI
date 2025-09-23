export interface BookName {
  id: number;
  title: string;
  author: string;
}

export interface BookData {
  bookId: number;
  title: string;
  author: string;
  additionalAuthors: string;
  myRating: number;
  status: string;
}
