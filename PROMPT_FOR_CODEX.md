# Codex Instructions: Build a Kids Bedtime Story Web App

You are an expert full-stack TypeScript and Next.js engineer.  
Your task is to generate a **complete, production-ready web app** based on this specification.

The app is for **personal/family use**, deployed on **Vercel**, using **Neon (Postgres)** for persistence, and the **OpenAI API** for text + image generation.

Do **not** create placeholder/sample apps. Implement the features described here.


## 0. High-Level Product Description

Build a web application that lets parents generate **custom bedtime storybooks** for children aged **3–5**.

Key points:

- Parents configure a story (theme, art style, child’s name, length, etc.).
- The app:
  1. Generates a **character sheet** (for a consistent main character).
  2. Generates a **story outline** (page-by-page summary).
  3. Automatically generates a **book title**.
  4. For each page, generates:
     - Page text (3–5 simple sentences).
     - A detailed **image prompt** for illustration.
  5. Generates an illustration for each page via OpenAI’s image generation API.
- The result is presented as a **flipbook-style web reader**.
- The parent can **save** the story; saved stories are stored in a Neon Postgres DB.
- Focus on **simplicity, warmth, and visual polish**. This is for real nightly use by a parent.


## 1. Target Audience & Content Constraints

- Audience: children aged **3–5**.
- Length: configurable number of pages, between **6–12 pages**.
- Tone: cozy, gentle, bedtime-appropriate stories.
- Absolutely **no**:
  - Violence
  - Fear, horror, or dark themes
  - Serious illness, death, or injury
  - Mature/complex topics
- Stories should gently reinforce **positive lessons** (sharing, kindness, empathy, curiosity).

You must enforce these rules via carefully designed **system prompts** and prompt templates (see `prompts/` section later).


## 2. Technology Stack & Project Structure

Use:

- **Next.js** with the **App Router** (latest stable).
- **TypeScript** throughout.
- **React** function components + hooks.
- **Tailwind CSS** for styling.
- **Server Components** where appropriate, Client Components for interactive views/forms.
- **Neon (Postgres)** as the database.
- **Prisma** or another mature TypeScript ORM is acceptable; if you choose Prisma, configure it properly for Neon + Vercel.
- **OpenAI API**:
  - Use a **chat/completions model** for text (story, outline, character sheet).
  - Use an **image generation model** for illustrations.
  - Do **not** hard-code model names; put them in a small config so they can be easily changed.

### Project Structure (high-level)

Implement a structure similar to:

- `app/`
  - `layout.tsx` – global layout
  - `page.tsx` – home/landing page
  - `new/page.tsx` – story configuration + generation screen
  - `books/page.tsx` – list of saved books
  - `books/[id]/page.tsx` – book reader (flipbook)
- `app/api/`
  - `generate/character/route.ts`
  - `generate/outline/route.ts`
  - `generate/page/route.ts`
  - `generate/image/route.ts`
  - `books/route.ts` (POST for save, GET for list)
  - `books/[id]/route.ts` (GET for details)
- `components/`
  - `StoryConfigForm.tsx` – configuration form
  - `GenerationProgress.tsx` – visual progress/status
  - `BookFlipReader.tsx` – flipbook reader component
  - `BookCard.tsx` – for listing saved books
  - Reusable UI pieces as needed (buttons, inputs, etc.).
- `lib/`
  - `openai.ts` – OpenAI client helper
  - `db.ts` – database client
  - `prompts.ts` – helper to build OpenAI prompts from templates
  - `types.ts` – shared TypeScript types/interfaces
- `prisma/` or `db/` (if using another ORM)
  - Schema and migrations
- `prompts/` – **non-code prompt templates** (see section 7).
- `docs/` – **non-code documentation** (see section 8).

Do not generate test frameworks or CI unless trivial. Focus on functionality.


## 3. Environment & Configuration

Use environment variables:

- `OPENAI_API_KEY` – OpenAI key, **server-side only**.
- `DATABASE_URL` – Neon Postgres connection string.
- `OPENAI_TEXT_MODEL` – e.g. a chat/completion model.
- `OPENAI_IMAGE_MODEL` – e.g. an image generation model.

Ensure:

- OpenAI calls are made **only from server-side code** (`app/api` routes or server utilities).
- No secrets are exposed in the browser.
- The app builds and runs with `npm install && npm run dev` (or `pnpm`/`yarn`).


## 4. Domain Model & Database Schema

We need to persist books and pages.

### Entities

1. **Book**
2. **Page**

### Book Fields

Implement a `books` table with fields like:

- `id` – primary key (UUID).
- `title` – string.
- `theme` – string (e.g. `"animals" | "dinosaurs" | "space" | "princesses" | "silly_bedtime" | "emotions" | "adventure_child"`)
- `style` – string (e.g. `"cute" | "watercolor" | "cartoon"`).
- `createdAt` – timestamp.
- `updatedAt` – timestamp.
- `totalPages` – integer.
- `childName` – string (optional).
- `favorites` – JSON / text storing list of up to 3 things the child loves.
- `lessonOfTheDay` – string (optional).
- `tone` – string (e.g. `"gentle" | "silly" | "adventurous"`).
- `characterSheet` – text (full character description JSON or formatted text).
- `outline` – text (JSON for outline: page summaries).
- Optionally `config` JSON field to store raw story configuration.

You may adjust names/types as needed but keep the semantics.

### Page Fields

Implement a `pages` table with fields like:

- `id` – primary key (UUID).
- `bookId` – FK to `books.id`.
- `pageNumber` – integer (1–N).
- `text` – text content of the page.
- `imageUrl` – string URL returned by the image generation API.
- `imagePrompt` – text used to generate the image.
- `createdAt` – timestamp.

Ensure `bookId + pageNumber` is unique.


## 5. User-Facing Flows & Screens

### 5.1 Home Page (`app/page.tsx`)

- Simple, clean landing page.
- Show:
  - App name (choose a friendly name like “Bedtime Story Maker” in the UI).
  - Description: “Create a new bedtime story for ages 3–5 with AI.”
- Buttons:
  - **“Start a New Story”** → navigates to `/new`.
  - **“View Saved Stories”** → navigates to `/books`.

Use soft, pastel color palette; this is a parent-friendly tool.

---

### 5.2 Story Configuration Page (`app/new/page.tsx`)

This is the **main form** for parents.

Form fields:

1. **Preset Theme** (radio buttons or cards):
   - Animals  
   - Dinosaurs  
   - Space  
   - Princesses  
   - Silly bedtime stories  
   - Learning about emotions  
   - Adventure starring your child  

2. **Art Style** (radio buttons or cards):
   - Cute children’s book  
   - Watercolor  
   - Cartoon  

3. **Child’s Name** – text input.

4. **Number of Pages** – slider or number input (min 6, max 12, default ~8).

5. **Three Things Your Child Loves** – maybe 3 text inputs or tags (e.g., “trains”, “pancakes”, “blue”).

6. **Lesson of the Day** – optional text input (e.g. “sharing”, “being brave about the dark”, “trying new foods”).

7. **Advanced Settings** (collapsed by default):
   - **Tone** (select):
     - Gentle (default)
     - Silly
     - Adventurous
   - **Strict Safety Mode** – checkbox. When enabled, the safety rules are emphasized even more in prompts.

Buttons:

- **Generate Story** – triggers the generation pipeline.
- Disable the button and show spinner/progress once clicked.

---

### 5.3 Generation Screen (same `/new` page)

Once “Generate Story” is clicked:

- Show a multi-step progress component (`GenerationProgress`), with phases like:
  1. “Creating your main character…”
  2. “Planning the adventure…”
  3. “Writing page X of N…”
  4. “Drawing picture X of N…”
- Update progress as each API call returns.
- Offer simple statuses: e.g. “In progress”, “Done”, “Failed – Retry”.

**Important**: The generation process should be orchestrated from the client, calling separate API routes sequentially:

1. Call `/api/generate/character`.
2. Call `/api/generate/outline`.
3. For each page:
   - Call `/api/generate/page`.
   - Call `/api/generate/image`.

Store intermediate results in client state.

At the end:

- Show a **preview** of the book (maybe a smaller inline flip-style preview).
- Show buttons:
  - **Read Story** – navigates to reader view.
  - **Save Story** – calls `/api/books` (POST) to persist book + pages.

If saving is successful, show confirmation and possibly redirect to `/books/[id]`.

---

### 5.4 Saved Books List (`app/books/page.tsx`)

- Fetch list of saved books via `/api/books` (GET).
- Display in a grid or list of `BookCard` components, each showing:
  - Title
  - Theme
  - Style
  - Created date
  - Page count
- Clicking a card navigates to `/books/[id]`.

---

### 5.5 Book Reader (`app/books/[id]/page.tsx`)

- Fetch the book + pages from `/api/books/[id]` (GET).
- Display:
  - Title
  - Subtitle based on theme and child’s name (e.g., “A bedtime story for Sam”).
- Render a **flipbook-style reader** using a React component.
  - If you use a library (e.g., something like `react-pageflip`), integrate it cleanly.
  - If no external library, implement a simple page view with “Previous” / “Next” buttons and maybe a slide animation.

Each “page” view:

- Left side: page text (large, readable font, high contrast).
- Right side: illustration image.
- Add simple controls:
  - Page indicator (“Page X of N”).
  - Buttons: `Previous` / `Next`.
- Provide a `Back to all stories` link.

No need for PDF export right now; keep that a potential future feature.


## 6. API Routes & Orchestration Logic

Implement the following routes as **Next.js App Router** `route.ts` files using POST/GET.

### 6.1 `/api/generate/character` – POST

**Input body (JSON):**

- `theme` – string.
- `childName` – string.
- `favorites` – array of up to 3 strings.
- `lessonOfTheDay` – string or null/empty.
- `tone` – string.
- `strictSafety` – boolean.
- `artStyle` – string.

**Function:**

- Call OpenAI chat/completion to generate a **character sheet** for a main child character (and possibly a sidekick if needed).
- Use the **story system prompt** + a specific character-sheet user prompt (described in `prompts/character_sheet_prompt_template.md`).
- Response from OpenAI should be structured JSON.

**Output body (JSON):**

- `characterSheet` – string (raw JSON or text).
- Possibly parsed representation:
  - `name`
  - `visualTraits`
  - `personality`
  - `notesForIllustrator`


### 6.2 `/api/generate/outline` – POST

**Input body (JSON):**

- `characterSheet` – from previous step.
- `theme`
- `childName`
- `favorites`
- `lessonOfTheDay`
- `tone`
- `strictSafety`
- `artStyle`
- `totalPages` – integer (6–12).

**Function:**

- Call OpenAI chat/completion to produce:
  - A **story title**.
  - A **page-by-page outline** (1 summary per page).

Use the **story system prompt** + the outline template described in `prompts/outline_prompt_template.md`.

**Output body (JSON):**

- `title` – string.
- `outline` – array of `{ pageNumber: number, summary: string }`.


### 6.3 `/api/generate/page` – POST

**Input body (JSON):**

- `pageNumber` – number.
- `totalPages` – number.
- `outline` – full outline array.
- `outlineEntry` – object for the specific page (summary).
- `characterSheet`
- `theme`
- `childName`
- `favorites`
- `lessonOfTheDay`
- `tone`
- `strictSafety`
- `artStyle`

**Function:**

- Call OpenAI chat/completion to generate:
  - `pageText` – 3–5 simple sentences suitable for ages 3–5.
  - `imagePrompt` – 1–2 paragraphs describing the illustration for this page, referencing the main character’s traits.

Use the **story system prompt** + **image description rules**, plus `prompts/page_prompt_template.md`.

**Output body (JSON):**

- `pageNumber`
- `text`
- `imagePrompt`


### 6.4 `/api/generate/image` – POST

**Input body (JSON):**

- `imagePrompt`
- `artStyle`
- `characterSheet` (optional, if needed to reinforce consistency).

**Function:**

- Call the OpenAI Image Generation API with `imagePrompt` and art-style adapter phrases.
- The **image consistency method to use is Option A**: “Character Sheet + Detailed Prompting”.
  - Always embed key character traits in the image prompt.
  - Example: “small child with curly brown hair, yellow shirt, blue overalls, friendly smile” repeated across pages.
- Make sure prompts emphasize:
  - bright colors
  - rounded shapes
  - gentle, non-scary scenes

**Output body (JSON):**

- `imageUrl` – a URL string that the front-end can load directly.


### 6.5 `/api/books` – POST (Save Book)

**Input body (JSON):**

- `title`
- `theme`
- `style`
- `totalPages`
- `childName`
- `favorites`
- `lessonOfTheDay`
- `tone`
- `characterSheet`
- `outline`
- `pages` – array of `{ pageNumber, text, imageUrl, imagePrompt }`.

**Function:**

- Insert record into `books`.
- Insert related `pages`.
- Return created `book` with `id`.

**Output body (JSON):**

- `bookId`


### 6.6 `/api/books` – GET (List Books)

**Function:**

- Return a list of books (id, title, theme, style, totalPages, createdAt).

**Output body (JSON):**

- `books: Array<{ id, title, theme, style, totalPages, createdAt }>`


### 6.7 `/api/books/[id]` – GET

**Function:**

- Return a specific book plus ordered pages.

**Output body (JSON):**

- `book`
- `pages` (ordered by `pageNumber`)


## 7. Prompt Files (Non-code Markdown Files)

Create a `prompts/` directory containing the following files. These are NOT code; they are prompt templates for OpenAI calls.

### 7.1 `prompts/story_system_prompt.md`

Content (you can copy text below):

```md
You are a master children's book author writing stories for children aged 3–5.

Rules:
- Always write in a warm, gentle, comforting tone suitable for bedtime.
- Use short, simple sentences and clear language that a 3–5 year old can understand when read aloud.
- No violence, fear, horror, serious danger, illness, or death.
- No scary monsters or dark, intense situations.
- Focus on kindness, curiosity, sharing, empathy, and gentle bravery.
- Keep emotional tone light, cozy, and reassuring.
- Situations should resolve in a positive, comforting way.
- Do not moralize heavily; show lessons through simple, sweet events and character actions.

7.2 prompts/image_system_prompt.md
You are an illustrator for children's storybooks aimed at ages 3–5.

Illustration rules:
- Always create gentle, bright, and colorful scenes.
- Use soft, rounded shapes and friendly expressions.
- Avoid any realistic gore, fear, darkness, or threatening imagery.
- No sharp weapons or explicit danger.
- No dark, gritty, or horror aesthetics.
- Style should feel whimsical, safe, and cozy, like a picture book a parent would happily read at bedtime.

7.3 prompts/character_sheet_prompt_template.md
Create a main child protagonist for a bedtime story for a child aged 3–5.

The story configuration is:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Preferred art style: {{artStyle}}

The protagonist should be roughly the same age as the child (3–5), and feel relatable and friendly.

Return a JSON object with the following shape:

{
  "name": "string - the character's first name (use the child's name if it makes sense)",
  "description": "short paragraph describing who they are in the story",
  "visual_traits": [
    "bullet point list of key visual traits, like hair color, hairstyle, eye color, clothing, and any distinctive items"
  ],
  "personality": "short description of their personality, focusing on positive, age-appropriate traits",
  "fixed_outfit": "description of a consistent outfit they wear throughout the story",
  "color_palette": [
    "list of main colors to use for clothing and accessories"
  ],
  "notes_for_illustrator": "any extra details that will help keep the character visually consistent across pages"
}

Do not include any extra commentary outside the JSON.

7.4 prompts/outline_prompt_template.md
You are planning a complete bedtime story for a child aged 3–5.

Use this character sheet:
{{characterSheet}}

Story configuration:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Total pages: {{totalPages}} (between 6 and 12)

1. First, invent a warm and cozy bedtime story that fits this configuration and age group.
2. Then, create:
   - A story title.
   - A page-by-page outline that divides the story into {{totalPages}} parts.
   - Each page's summary should describe the main event(s) for that page in 1–3 sentences.

Return a JSON object with this shape:

{
  "title": "string - a charming, age-appropriate book title",
  "pages": [
    {
      "pageNumber": 1,
      "summary": "1-3 sentences summarizing what happens on page 1"
    },
    {
      "pageNumber": 2,
      "summary": "..."
    }
    // Continue up to page {{totalPages}}
  ]
}

Do not include any extra commentary outside the JSON.

7.5 prompts/page_prompt_template.md
You are writing a single page of a children's bedtime story for ages 3–5.

Use this character sheet:
{{characterSheet}}

Use this full story outline:
{{outlineJson}}

You are now writing page {{pageNumber}} of {{totalPages}}.

The summary for this page is:
{{pageSummary}}

Story configuration:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Preferred art style: {{artStyle}}

Tasks:

1. Write the full text for this page, as 3–5 short, simple sentences that can be read aloud to a 3–5 year old at bedtime.
2. Write a detailed description of the illustration for this page that:
   - Clearly describes the main character using the same visual traits and outfit as in the character sheet.
   - Matches the events of this page.
   - Uses a gentle, cozy, age-appropriate scene.
   - Adapts to the requested art style.

Return a JSON object:

{
  "pageNumber": {{pageNumber}},
  "text": "3–5 sentences of story text for this page.",
  "imagePrompt": "A detailed description of the illustration to generate for this page, including character appearance and a simple background."
}

Do not include any extra commentary outside the JSON.

7.6 prompts/image_prompt_wrapper_notes.md
When calling the image generation API, the app should combine:

- The base image prompt from the page:
  {{imagePrompt}}

With additional style and safety details:

- Art style mapping:
  - "cute children’s book" -> "bright pastels, soft round shapes, simple details, cozy lighting, picture book style"
  - "watercolor" -> "soft watercolor textures, gentle gradients, light strokes, dreamy storybook atmosphere"
  - "cartoon" -> "bold outlines, flat colors, expressive characters, simple backgrounds, clean cartoon style"

- Always mention the key visual traits from the character sheet (hair, clothing, height, etc.) to maintain consistency across pages.

The final combined prompt should be:
"{{imagePrompt}}. In a {{mappedStyle}}. The main child character should match these traits: {{characterVisualTraits}}. Make it bright, gentle, and safe for children aged 3–5."

8. Additional Non-code Docs

Create a docs/ directory with descriptive markdown files helpful for future maintenance. These are not code; they describe the system.

8.1 docs/ARCHITECTURE_OVERVIEW.md

Outline:

Short description of the app’s purpose.

System diagram (textual).

High-level explanation of:

Frontend pages.

API routes.

DB schema.

OpenAI integration steps (character sheet → outline → pages → images).

Notes on where to change:

Models.

Tokens.

Themes/styles.

8.2 docs/FUTURE_ENHANCEMENTS.md

List potential future features:

PDF export.

Audio narration with TTS.

User accounts & auth.

More themes (holidays, seasons, friendship, etc.).

Additional art styles.

Multiple children as characters.

9. UI & Styling Guidelines

Use soft, pastel colors and rounded corners.

Use large, readable fonts for text that will be read aloud.

Keep forms compact and non-intimidating.

Use plain language in labels (“How long should the story be?”, “What are three things your child loves?”).

Make error messages friendly and non-technical.

Use small, subtle animations sparingly (e.g., for progress indicators or page transitions).

10. Error Handling & Resilience

If an OpenAI call fails:

Return a clear error from the API route.

Show a friendly message to the user (e.g., “Something went wrong talking to the story engine. Please try again.”).

Allow retry for the specific step (e.g., regenerate that page).

Validate inputs on the server side:

Total pages in [6, 12].

Favorites length ≤ 3.

Reasonable length limits on strings.

11. Implementation Notes (Important)

Assume single-user for now (no authentication).

Code should be clean, modular, and readable.

Favor small, focused components.

Include TypeScript types for:

StoryConfig

CharacterSheet

OutlinePage

GeneratedPage

Book

BookPage

Favor async/await and proper error handling in API routes.

Do not include hard-coded secrets.

Keep model names and temperature parameters configurable in a small config module.

Your job as the code model:

Read this entire specification.

Generate the Next.js + TypeScript project structure and files implementing this app.

Create all non-code files described in prompts/ and docs/.

Implement DB schema and migrations for Neon/Postgres.

Implement the API routes and front-end UI according to the flows above.

Ensure everything compiles and would run correctly with appropriate environment variables set.

Do not generate placeholder/sample apps; implement this specific bedtime story app.
