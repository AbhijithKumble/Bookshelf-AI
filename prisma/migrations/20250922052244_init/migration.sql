-- CreateTable
CREATE TABLE "BookName" (
    "title" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BookData" (
    "uniqueId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "additionalAuthors" TEXT NOT NULL,
    "myRating" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BookData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE
);
