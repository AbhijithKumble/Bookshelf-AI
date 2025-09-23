/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `BookData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookData_userId_bookId_key" ON "BookData"("userId", "bookId");
