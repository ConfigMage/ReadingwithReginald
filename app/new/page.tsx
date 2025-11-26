"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoryConfigForm } from "@/components/StoryConfigForm";
import { GenerationProgress, GenerationStep } from "@/components/GenerationProgress";
import { BookFlipReader } from "@/components/BookFlipReader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GeneratedPage, OutlinePage, CharacterSheet, StoryConfig } from "@/lib/types";

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export default function NewStoryPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: "character", label: "Creating your main character", state: "pending" },
    { id: "outline", label: "Planning the adventure", state: "pending" },
    { id: "pages", label: "Writing pages & drawing pictures", state: "pending" }
  ]);

  const [characterSheetRaw, setCharacterSheetRaw] = useState<string>("");
  const [character, setCharacter] = useState<CharacterSheet | null>(null);
  const [outline, setOutline] = useState<OutlinePage[]>([]);
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [currentConfig, setCurrentConfig] = useState<StoryConfig | null>(null);
  const [savedBookId, setSavedBookId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateStep = (id: string, state: GenerationStep["state"], detail?: string) => {
    setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, state, detail } : step)));
  };

  const handleGenerate = async (config: StoryConfig) => {
    setGenerating(true);
    setError(null);
    setSavedBookId(null);
    setPages([]);
    setOutline([]);
    setTitle("");
    setCurrentConfig(config);
    setSteps((prev) => prev.map((s) => ({ ...s, state: "pending", detail: undefined })));

    try {
      updateStep("character", "active");
      const characterRes = await postJSON<{ characterSheet: string; character: CharacterSheet }>(
        "/api/generate/character",
        config
      );
      setCharacterSheetRaw(characterRes.characterSheet);
      setCharacter(characterRes.character);
      updateStep("character", "done");

      updateStep("outline", "active");
      const outlineRes = await postJSON<{ outline: OutlinePage[]; title: string }>(
        "/api/generate/outline",
        { ...config, characterSheet: characterRes.characterSheet }
      );
      setOutline(outlineRes.outline);
      setTitle(outlineRes.title);
      updateStep("outline", "done");

      updateStep("pages", "active", "Writing pages...");

      const generatedPages: GeneratedPage[] = [];
      for (const entry of outlineRes.outline) {
        updateStep("pages", "active", `Writing page ${entry.pageNumber} of ${config.totalPages}`);

        const pageData = await postJSON<GeneratedPage>("/api/generate/page", {
          ...config,
          pageNumber: entry.pageNumber,
          outline: outlineRes.outline,
          outlineEntry: entry,
          characterSheet: characterRes.characterSheet
        });

        updateStep("pages", "active", `Drawing page ${entry.pageNumber} of ${config.totalPages}`);

        const imageRes = await postJSON<{ imageUrl: string }>("/api/generate/image", {
          imagePrompt: pageData.imagePrompt,
          artStyle: config.style,
          characterSheet: characterRes.character || characterRes.characterSheet
        });

        generatedPages.push({ ...pageData, imageUrl: imageRes.imageUrl });
        setPages([...generatedPages]);
      }

      updateStep("pages", "done", "All pages generated");
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Something went wrong. Please try again.");
      setSteps((prev) => prev.map((s) => (s.state === "active" ? { ...s, state: "error" } : s)));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentConfig || !pages.length) return;
    setSaving(true);
    setError(null);
    try {
      const res = await postJSON<{ bookId: string }>("/api/books", {
        title: title || "Bedtime Story",
        theme: currentConfig.theme,
        style: currentConfig.style,
        totalPages: currentConfig.totalPages,
        childName: currentConfig.childName,
        favorites: currentConfig.favorites,
        lessonOfTheDay: currentConfig.lessonOfTheDay,
        tone: currentConfig.tone,
        characterSheet: characterSheetRaw,
        outline,
        pages
      });
      setSavedBookId(res.bookId);
      router.push(`/books/${res.bookId}`);
    } catch (err) {
      setError((err as Error).message || "Failed to save story.");
    } finally {
      setSaving(false);
    }
  };

  const generationComplete = steps.every((s) => s.state === "done");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-ink/50">New story</p>
        <h1 className="font-display text-3xl text-ink">Build a cozy bedtime book</h1>
        <p className="text-ink/70">
          Configure the theme, art style, and a few details. We will create a character, plan the
          adventure, write each page, and illustrate it.
        </p>
      </div>

      <StoryConfigForm onSubmit={handleGenerate} disabled={generating} />

      <GenerationProgress steps={steps} />

      {error ? (
        <Card className="border border-red-200 bg-red-50 text-red-700">
          <p>{error}</p>
        </Card>
      ) : null}

      {generationComplete && pages.length ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Preview</p>
              <h2 className="font-display text-2xl text-ink">{title}</h2>
              <p className="text-ink/70">
                Tap through your story below. If you like it, save it to your library.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSave} disabled={saving}>
                Save story
              </Button>
              {savedBookId ? (
                <Button onClick={() => router.push(`/books/${savedBookId}`)}>Read saved book</Button>
              ) : null}
            </div>
          </div>
          <BookFlipReader
            title={title || "Your bedtime story"}
            pages={pages.map((p) => ({
              id: `${p.pageNumber}`,
              bookId: "preview",
              pageNumber: p.pageNumber,
              text: p.text,
              imageUrl: p.imageUrl || "",
              imagePrompt: p.imagePrompt,
              createdAt: new Date().toISOString()
            }))}
          />
        </div>
      ) : null}
    </div>
  );
}
