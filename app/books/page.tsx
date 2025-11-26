import Link from "next/link";
import { prisma } from "@/lib/db";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";

async function getBooks() {
  try {
    return await prisma.book.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to load books", error);
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Saved stories</p>
          <h1 className="font-display text-3xl text-ink">Your library</h1>
        </div>
        <Link href="/new">
          <Button variant="secondary">Start a new story</Button>
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="text-ink/70">
          No stories saved yet. Generate one and save it to see it here.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              theme={book.theme}
              style={book.style}
              totalPages={book.totalPages}
              createdAt={book.createdAt.toISOString()}
              tone={book.tone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
