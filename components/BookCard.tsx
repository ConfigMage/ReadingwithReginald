import Link from "next/link";
import { Card } from "./ui/card";
import { formatDate } from "@/lib/utils";

interface BookCardProps {
  id: string;
  title: string;
  theme: string;
  style: string;
  totalPages: number;
  createdAt: string;
  tone?: string;
}

export function BookCard({ id, title, theme, style, totalPages, createdAt, tone }: BookCardProps) {
  return (
    <Link href={`/books/${id}`}>
      <Card className="border border-ink/10 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Story</p>
            <h3 className="font-display text-xl text-ink">{title}</h3>
            <p className="text-sm text-ink/70">
              Theme: {theme} | Style: {style} {tone ? `| Tone: ${tone}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-butter px-3 py-1 text-xs font-semibold text-ink/80">
            {totalPages} pages
          </span>
        </div>
        <p className="mt-4 text-sm text-ink/60">Created {formatDate(createdAt)}</p>
      </Card>
    </Link>
  );
}
