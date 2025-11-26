## Environment Setup

Use these variables (see `.env.example`):

- `OPENAI_API_KEY`: Create an API key in your OpenAI dashboard and keep it server-side only.
- `OPENAI_TEXT_MODEL`: Set to `gpt-5.1` (or another supported text/chat model).
- `OPENAI_IMAGE_MODEL`: Set to `gpt-image-1`.
- `DATABASE_URL`: Postgres connection string from Neon.

### Getting the Neon `DATABASE_URL`
1. Sign in to [Neon](https://console.neon.tech/) and create a project.
2. In the project dashboard, open the **Connection Details** panel.
3. Copy the **Postgres connection string** (choose the pooled connection string for serverless/Vercel).
4. Add `?sslmode=require` if it is not already present.
5. Paste into `.env` as `DATABASE_URL=postgresql://...`.

### Apply changes
1. Add the variables to `.env` (do not commit the file).
2. Run `npm install` if dependencies changed.
3. Run `npx prisma generate` and then `npx prisma migrate dev` (or `prisma migrate deploy` in production) to sync the schema.
4. Start the app with `npm run dev`.
