export type Theme =
  | "animals"
  | "dinosaurs"
  | "space"
  | "princesses"
  | "silly_bedtime"
  | "emotions"
  | "adventure_child";

export type ArtStyle = "cute" | "watercolor" | "cartoon";

export type Tone = "gentle" | "silly" | "adventurous";

export interface StoryConfig {
  theme: Theme;
  style: ArtStyle;
  tone: Tone;
  childName?: string;
  totalPages: number;
  favorites: string[];
  lessonOfTheDay?: string;
  strictSafety: boolean;
}

export interface CharacterSheet {
  name: string;
  description: string;
  visual_traits: string[];
  personality: string;
  fixed_outfit: string;
  color_palette: string[];
  notes_for_illustrator: string;
}

export interface OutlinePage {
  pageNumber: number;
  summary: string;
}

export interface OutlineResponse {
  title: string;
  pages: OutlinePage[];
}

export interface GeneratedPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface BookRecord {
  id: string;
  title: string;
  theme: string;
  style: string;
  tone: string;
  childName?: string | null;
  favorites: string[];
  lessonOfTheDay?: string | null;
  totalPages: number;
  characterSheet: CharacterSheet | Record<string, unknown> | null;
  outline: OutlineResponse | Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BookPage {
  id: string;
  bookId: string;
  pageNumber: number;
  text: string;
  imageUrl: string;
  imagePrompt: string;
  createdAt: string;
}

export interface SaveBookPayload {
  title: string;
  theme: string;
  style: string;
  totalPages: number;
  childName?: string;
  favorites: string[];
  lessonOfTheDay?: string;
  tone: string;
  characterSheet: unknown;
  outline: unknown;
  pages: Array<{
    pageNumber: number;
    text: string;
    imageUrl: string;
    imagePrompt: string;
  }>;
}
