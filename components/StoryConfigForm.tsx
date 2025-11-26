"use client";

import { useState } from "react";
import { ArtStyle, StoryConfig, Theme, Tone } from "@/lib/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioCard } from "./ui/radio-card";

const themeOptions: { value: Theme; label: string; description: string }[] = [
  { value: "animals", label: "Animals", description: "Gentle animal friends go on a cozy adventure." },
  { value: "dinosaurs", label: "Dinosaurs", description: "Friendly dinos explore and learn together." },
  { value: "space", label: "Space", description: "Soft, starry journeys above the clouds." },
  { value: "princesses", label: "Princesses", description: "Royal kindness with castles and tea parties." },
  { value: "silly_bedtime", label: "Silly bedtime stories", description: "Giggles and gentle bedtime goofs." },
  { value: "emotions", label: "Learning about emotions", description: "Naming feelings with calm support." },
  { value: "adventure_child", label: "Adventure starring your child", description: "Your child leads a kind adventure." }
];

const artStyleOptions: { value: ArtStyle; label: string; description: string }[] = [
  { value: "cute", label: "Cute children's book", description: "Bright, round, pastel illustration style." },
  { value: "watercolor", label: "Watercolor", description: "Dreamy washes and gentle brush strokes." },
  { value: "cartoon", label: "Cartoon", description: "Bold outlines, expressive faces, clean scenes." }
];

const toneOptions: { value: Tone; label: string }[] = [
  { value: "gentle", label: "Gentle" },
  { value: "silly", label: "Silly" },
  { value: "adventurous", label: "Adventurous" }
];

const defaultConfig: StoryConfig = {
  theme: "animals",
  style: "cute",
  tone: "gentle",
  totalPages: 8,
  childName: "",
  favorites: ["", "", ""],
  lessonOfTheDay: "",
  strictSafety: true
};

interface Props {
  onSubmit: (config: StoryConfig) => void;
  disabled?: boolean;
}

export function StoryConfigForm({ onSubmit, disabled }: Props) {
  const [config, setConfig] = useState<StoryConfig>(defaultConfig);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFavoriteChange = (index: number, value: string) => {
    const updated = [...config.favorites];
    updated[index] = value;
    setConfig((prev) => ({ ...prev, favorites: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFavorites = config.favorites.filter(Boolean).slice(0, 3);
    onSubmit({ ...config, favorites: trimmedFavorites });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border border-ink/10">
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-ink">Story setup</h2>
          <p className="text-ink/70">Pick a theme and art style, then add a few cozy details.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {themeOptions.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={config.theme === option.value}
              onSelect={(value) => setConfig((prev) => ({ ...prev, theme: value }))}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {artStyleOptions.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={config.style === option.value}
              onSelect={(value) => setConfig((prev) => ({ ...prev, style: value }))}
            />
          ))}
        </div>
      </Card>

      <Card className="border border-ink/10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="childName">Child&apos;s name</Label>
            <Input
              id="childName"
              placeholder="Sam, Amina, Riley..."
              value={config.childName ?? ""}
              onChange={(e) => setConfig((prev) => ({ ...prev, childName: e.target.value }))}
              disabled={disabled}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="totalPages">Number of pages (6-12)</Label>
            <input
              id="totalPages"
              type="range"
              min={6}
              max={12}
              value={config.totalPages}
              onChange={(e) => setConfig((prev) => ({ ...prev, totalPages: Number(e.target.value) }))}
              disabled={disabled}
              className="w-full accent-ink"
            />
            <p className="text-sm text-ink/70">Pages: {config.totalPages}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {config.favorites.map((fav, idx) => (
            <div key={idx} className="space-y-2">
              <Label>Thing {idx + 1} your child loves</Label>
              <Input
                value={fav}
                placeholder={["trains", "pancakes", "the color blue"][idx] || ""}
                onChange={(e) => handleFavoriteChange(idx, e.target.value)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="lesson">Lesson of the day (optional)</Label>
          <Input
            id="lesson"
            placeholder="Sharing, being brave about the dark, trying new foods..."
            value={config.lessonOfTheDay ?? ""}
            onChange={(e) => setConfig((prev) => ({ ...prev, lessonOfTheDay: e.target.value }))}
            disabled={disabled}
          />
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            onClick={() => setShowAdvanced((s) => !s)}
          >
            {showAdvanced ? "Hide advanced settings" : "Show advanced settings"}
          </button>
          {showAdvanced ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="flex gap-2">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, tone: tone.value }))}
                      className={`rounded-full px-3 py-2 text-sm ${
                        config.tone === tone.value
                          ? "bg-ink text-white"
                          : "bg-white text-ink border border-ink/10"
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Strict safety mode</Label>
                <Checkbox
                  checked={config.strictSafety}
                  onChange={(e) => setConfig((prev) => ({ ...prev, strictSafety: e.target.checked }))}
                  label="Extra gentle and safety-focused prompts"
                  disabled={disabled}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={disabled} loading={disabled}>
          Generate story
        </Button>
      </div>
    </form>
  );
}
