/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `BookName` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookName_title_key" ON "BookName"("title");
