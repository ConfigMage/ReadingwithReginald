import { z } from "zod";

export const themeEnum = z.enum([
  "animals",
  "dinosaurs",
  "space",
  "princesses",
  "silly_bedtime",
  "emotions",
  "adventure_child"
]);

export const artStyleEnum = z.enum(["cute", "watercolor", "cartoon"]);
export const toneEnum = z.enum(["gentle", "silly", "adventurous"]);

export const storyConfigSchema = z.object({
  theme: themeEnum,
  style: artStyleEnum,
  tone: toneEnum,
  childName: z.string().max(60).optional().nullable(),
  totalPages: z.number().int().min(6).max(12),
  favorites: z.array(z.string().max(60)).max(3),
  lessonOfTheDay: z.string().max(120).optional().nullable(),
  strictSafety: z.boolean().default(false)
});

export const characterRequestSchema = storyConfigSchema;

export const outlineRequestSchema = storyConfigSchema.extend({
  characterSheet: z.string().min(10)
});

export const pageRequestSchema = storyConfigSchema.extend({
  pageNumber: z.number().int().min(1),
  totalPages: z.number().int().min(6).max(12),
  outline: z.array(
    z.object({
      pageNumber: z.number(),
      summary: z.string()
    })
  ),
  outlineEntry: z.object({
    pageNumber: z.number(),
    summary: z.string()
  }),
  characterSheet: z.string().min(10)
});

export const imageRequestSchema = z.object({
  imagePrompt: z.string().min(10),
  artStyle: artStyleEnum,
  characterSheet: z.any().optional()
});

export const saveBookSchema = z.object({
  title: z.string().min(1).max(120),
  theme: z.string(),
  style: z.string(),
  totalPages: z.number().int().min(1).max(50),
  childName: z.string().max(120).optional().nullable(),
  favorites: z.array(z.string()).max(3),
  lessonOfTheDay: z.string().max(240).optional().nullable(),
  tone: z.string(),
  characterSheet: z.any(),
  outline: z.any(),
  pages: z
    .array(
      z.object({
        pageNumber: z.number().int(),
        text: z.string(),
        imageUrl: z.string().url(),
        imagePrompt: z.string()
      })
    )
    .min(1)
});
