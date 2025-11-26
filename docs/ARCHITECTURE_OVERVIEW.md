## Purpose
Bedtime Story Maker creates gentle, age-appropriate bedtime stories (ages 3-5) with matching illustrations. Parents configure a theme, style, and child details; the system generates a character sheet, outline, per-page text, and images, then saves books to Postgres (Neon) for a flipbook-style reader.

## System Outline
- **Frontend (Next.js App Router, React, Tailwind)**: pages in `app/` with client components for the configuration form, generation progress, and flipbook reader.
- **API Routes (`app/api/`)**: OpenAI-backed generation routes (`generate/*`) plus book persistence routes (`books*`).
- **Database (Prisma + Postgres/Neon)**: `Book` and `Page` tables hold metadata, prompts, and generated assets.
- **Prompts (`prompts/`)**: Markdown templates for system prompts and user prompt scaffolds.

## Data Flow (Generation)
1. Client posts to `/api/generate/character` with config -> OpenAI returns a structured character sheet.
2. Client posts to `/api/generate/outline` with config + character sheet -> title + page summaries.
3. For each page:
   - `/api/generate/page` -> page text + image prompt.
   - `/api/generate/image` -> illustration URL via OpenAI image model.
4. Client previews story and saves via `/api/books` (POST).

## Frontend Pages
- `app/page.tsx`: Landing with CTAs to start or view saved books.
- `app/new/page.tsx`: Story configuration, generation orchestration, preview, and save.
- `app/books/page.tsx`: Saved book grid.
- `app/books/[id]/page.tsx`: Flipbook reader for a specific book.

## API Routes
- `generate/character`, `generate/outline`, `generate/page`, `generate/image`: Wrap OpenAI chat/image calls using prompt templates.
- `books` (GET/POST): List and create books with pages.
- `books/[id]` (GET): Fetch a single book with ordered pages.

## Database Schema (Prisma)
- **Book**: `id (UUID)`, `title`, `theme`, `style`, `tone`, `childName?`, `favorites (Json)`, `lessonOfTheDay?`, `totalPages`, `characterSheet (Json)`, `outline (Json)`, `config?`, timestamps, relation to pages.
- **Page**: `id (UUID)`, `bookId` (FK), `pageNumber` (unique per book), `text`, `imageUrl`, `imagePrompt`, `createdAt`.

## OpenAI Integration
- `lib/openai.ts` centralizes client, models from env (`OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`).
- `lib/prompts.ts` reads templates in `prompts/`, fills placeholders, and wraps image prompts with style/safety notes.
- System prompts enforce gentle, safe, bedtime-appropriate output; `strictSafety` flag adds extra emphasis.

## Configuration Points
- **Models**: change in `lib/config.ts` or env vars.
- **Themes/styles**: adjust enums and UI in `StoryConfigForm` and `lib/validation.ts`.
- **Tokens/temperature**: tweak `DEFAULT_TEMPERATURE` in `lib/config.ts` and route-level overrides.

## Deployment Notes
- Set env vars: `OPENAI_API_KEY`, `DATABASE_URL`, `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`.
- Run `prisma generate` then `prisma migrate deploy` before first boot.
- Vercel + Neon: ensure `DATABASE_URL` uses pooled connection; keep functions on Node runtime (not Edge).
