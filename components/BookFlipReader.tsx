"use client";
"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { BookPage } from "@/lib/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BookFlipReaderProps {
  title: string;
  pages: BookPage[];
}

export function BookFlipReader({ title, pages }: BookFlipReaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [title]);

  const current = pages[index];
  const total = pages.length;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));

  if (!current) {
    return <p className="text-ink/60">No pages yet.</p>;
  }

  return (
    <Card className="border border-ink/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Now reading</p>
          <h2 className="font-display text-2xl text-ink">{title}</h2>
        </div>
        <div className="rounded-full bg-butter px-4 py-2 text-sm font-semibold text-ink/80">
          Page {index + 1} of {total}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4 shadow-inner">
          <p className="text-lg leading-relaxed text-ink">{current.text}</p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sky/30">
          <img
            src={current.imageUrl}
            alt={`Page ${current.pageNumber} illustration`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={goPrev} disabled={index === 0}>
          Previous
        </Button>
        <Button variant="secondary" onClick={goNext} disabled={index === total - 1}>
          Next
        </Button>
      </div>
    </Card>
  );
}
