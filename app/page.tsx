import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  "Create cozy bedtime stories for ages 3-5 in minutes.",
  "Gentle tone, simple sentences, and bright, friendly art.",
  "Save your favorites and read them like a flipbook."
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl bg-white/70 p-10 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="space-y-4 md:max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Bedtime Story Maker
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Spin a gentle bedtime adventure for your little one.
          </h1>
          <p className="text-lg text-ink/80">
            Guided prompts craft a main character, a cozy outline, playful pages, and matching
            illustrations. Perfect for winding down together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/new">
              <Button size="lg">
                Start a New Story <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/books">
              <Button variant="secondary" size="lg">
                View Saved Stories
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-3 text-sm text-ink/80">
          {highlights.map((item) => (
            <Card key={item} className="border border-ink/5">
              {item}
            </Card>
          ))}
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border border-ink/5">
          <h3 className="font-display text-xl text-ink">Kid-ready content</h3>
          <p className="text-ink/75">
            Safety rules block anything scary or intense. Stories always end calm and kind.
          </p>
        </Card>
        <Card className="border border-ink/5">
          <h3 className="font-display text-xl text-ink">Illustrations included</h3>
          <p className="text-ink/75">
            Each page comes with an OpenAI-generated image prompt and artwork to match.
          </p>
        </Card>
        <Card className="border border-ink/5">
          <h3 className="font-display text-xl text-ink">Save &amp; revisit</h3>
          <p className="text-ink/75">
            Store your books, read them as a flipbook, and keep favorites for bedtime routines.
          </p>
        </Card>
      </section>
    </div>
  );
}
