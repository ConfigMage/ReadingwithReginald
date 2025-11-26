import fs from "fs";
import path from "path";
import { ArtStyle, CharacterSheet, OutlinePage, StoryConfig } from "./types";

const promptCache = new Map<string, string>();

function readPromptFile(filename: string) {
  if (promptCache.has(filename)) return promptCache.get(filename)!;
  const fullPath = path.join(process.cwd(), "prompts", filename);
  const content = fs.readFileSync(fullPath, "utf8");
  promptCache.set(filename, content);
  return content;
}

export function getStorySystemPrompt() {
  return readPromptFile("story_system_prompt.md");
}

export function getImageSystemPrompt() {
  return readPromptFile("image_system_prompt.md");
}

function replacePlaceholders(template: string, values: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");
}

function favoritesList(favorites: string[]) {
  if (!favorites.length) return "none provided";
  return favorites.filter(Boolean).join(", ");
}

export function buildCharacterPrompt(config: StoryConfig) {
  const template = readPromptFile("character_sheet_prompt_template.md");
  return replacePlaceholders(template, {
    theme: config.theme,
    childName: config.childName || "the child",
    favoritesList: favoritesList(config.favorites),
    lessonOfTheDay: config.lessonOfTheDay || "a gentle bedtime lesson",
    tone: config.tone,
    artStyle: config.style
  });
}

export function buildOutlinePrompt({
  config,
  characterSheet
}: {
  config: StoryConfig;
  characterSheet: string;
}) {
  const template = readPromptFile("outline_prompt_template.md");
  return replacePlaceholders(template, {
    characterSheet,
    theme: config.theme,
    childName: config.childName || "the child",
    favoritesList: favoritesList(config.favorites),
    lessonOfTheDay: config.lessonOfTheDay || "a gentle bedtime lesson",
    tone: config.tone,
    totalPages: String(config.totalPages)
  });
}

export function buildPagePrompt({
  config,
  characterSheet,
  outline,
  pageNumber,
  outlineEntry
}: {
  config: StoryConfig;
  characterSheet: string;
  outline: OutlinePage[];
  pageNumber: number;
  outlineEntry: OutlinePage;
}) {
  const template = readPromptFile("page_prompt_template.md");
  const outlineJson = JSON.stringify(outline, null, 2);
  return replacePlaceholders(template, {
    characterSheet,
    outlineJson,
    pageNumber: String(pageNumber),
    totalPages: String(config.totalPages),
    pageSummary: outlineEntry.summary,
    theme: config.theme,
    childName: config.childName || "the child",
    favoritesList: favoritesList(config.favorites),
    lessonOfTheDay: config.lessonOfTheDay || "a gentle bedtime lesson",
    tone: config.tone,
    artStyle: config.style
  });
}

const styleMapping: Record<ArtStyle, string> = {
  cute: "bright pastels, soft round shapes, simple details, cozy lighting, picture book style",
  watercolor: "soft watercolor textures, gentle gradients, light strokes, dreamy storybook atmosphere",
  cartoon: "bold outlines, flat colors, expressive characters, simple backgrounds, clean cartoon style"
};

export function mapArtStyle(style: ArtStyle) {
  return styleMapping[style] ?? styleMapping.cute;
}

export function buildWrappedImagePrompt({
  imagePrompt,
  style,
  characterSheet
}: {
  imagePrompt: string;
  style: ArtStyle;
  characterSheet: CharacterSheet | Record<string, unknown> | string;
}) {
  const template = readPromptFile("image_prompt_wrapper_notes.md");
  let visualTraits = "";
  if (typeof characterSheet === "string") {
    visualTraits = characterSheet;
  } else if ("visual_traits" in (characterSheet as Record<string, unknown>)) {
    visualTraits = (characterSheet as CharacterSheet).visual_traits.join(", ");
  } else {
    visualTraits = JSON.stringify(characterSheet);
  }

  return replacePlaceholders(template, {
    imagePrompt,
    mappedStyle: mapArtStyle(style),
    characterVisualTraits: visualTraits
  }).replace(/\s+/g, " ").trim();
}
