/*
  Warnings:

  - You are about to drop the column `bookId` on the `BookImage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BookName_title_key";

-- CreateTable
CREATE TABLE "BookImageBook" (
    "bookId" INTEGER NOT NULL,
    "bookImageId" INTEGER NOT NULL,

    PRIMARY KEY ("bookId", "bookImageId"),
    CONSTRAINT "BookImageBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookName" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookImageBook_bookImageId_fkey" FOREIGN KEY ("bookImageId") REFERENCES "BookImage" ("imgId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookImage" (
    "imgId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imgPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BookImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookImage" ("createdAt", "imgId", "imgPath", "userId") SELECT "createdAt", "imgId", "imgPath", "userId" FROM "BookImage";
DROP TABLE "BookImage";
ALTER TABLE "new_BookImage" RENAME TO "BookImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
