import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookFlipReader } from "@/components/BookFlipReader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

async function getBook(id: string) {
  try {
    return await prisma.book.findUnique({
      where: { id },
      include: { pages: { orderBy: { pageNumber: "asc" } } }
    });
  } catch (error) {
    console.error("Failed to load book", error);
    return null;
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  const pages = book.pages.map((p) => ({
    id: p.id,
    bookId: p.bookId,
    pageNumber: p.pageNumber,
    text: p.text,
    imageUrl: p.imageUrl,
    imagePrompt: p.imagePrompt,
    createdAt: p.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Storybook</p>
          <h1 className="font-display text-3xl text-ink">{book.title}</h1>
          <p className="text-ink/70">
            A bedtime story for {book.childName || "your child"} | {book.totalPages} pages
          </p>
        </div>
        <Link href="/books">
          <Button variant="secondary">Back to all stories</Button>
        </Link>
      </div>

      <Card className="border border-ink/10">
        <p className="text-ink/70">Theme: {book.theme} | Style: {book.style} | Tone: {book.tone}</p>
      </Card>

      <BookFlipReader title={book.title} pages={pages} />
    </div>
  );
}
