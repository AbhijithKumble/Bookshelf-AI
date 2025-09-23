/*
  Warnings:

  - The primary key for the `BookName` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bookId` to the `BookImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `BookName` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookImage" (
    "imgId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imgPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    CONSTRAINT "BookImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookImage_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookName" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookImage" ("createdAt", "imgId", "imgPath", "userId") SELECT "createdAt", "imgId", "imgPath", "userId" FROM "BookImage";
DROP TABLE "BookImage";
ALTER TABLE "new_BookImage" RENAME TO "BookImage";
CREATE TABLE "new_BookName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL
);
INSERT INTO "new_BookName" ("author", "title") SELECT "author", "title" FROM "BookName";
DROP TABLE "BookName";
ALTER TABLE "new_BookName" RENAME TO "BookName";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
