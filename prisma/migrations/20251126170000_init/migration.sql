-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "childName" TEXT,
    "favorites" JSONB NOT NULL,
    "lessonOfTheDay" TEXT,
    "totalPages" INTEGER NOT NULL,
    "characterSheet" JSONB NOT NULL,
    "outline" JSONB NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "bookId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePrompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Page_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_bookId_pageNumber_key" ON "Page"("bookId", "pageNumber");
