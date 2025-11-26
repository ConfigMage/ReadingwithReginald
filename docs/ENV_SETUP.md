## Environment Setup

Use these variables (see `.env.example`):

- `OPENAI_API_KEY`: Create an API key in your OpenAI dashboard and keep it server-side only.
- `OPENAI_TEXT_MODEL`: Set to `gpt-5.1` (or another supported text/chat model).
- `OPENAI_IMAGE_MODEL`: Set to `gpt-image-1`.
- `DATABASE_URL`: Postgres connection string from Neon.

### Getting the `DATABASE_URL`
- **Neon**: Sign in at [Neon](https://console.neon.tech/), create a project, open **Connection Details**, copy the pooled Postgres connection string, and ensure `?sslmode=require` is present. Set it as `DATABASE_URL` (and optionally `POSTGRES_URL` for Prisma tooling compatibility).
- **Prisma Accelerate (Data Proxy)**: If you have a `prisma+postgres://accelerate.prisma-data.net/?api_key=...` URL, set it as `PRISMA_DATABASE_URL` and also set `DATABASE_URL` to the same value for consistency. Do not commit real keys—add them only in your Vercel project settings.

### Apply changes
1. Add the variables to `.env` (do not commit the file). For Vercel, set them in **Project Settings → Environment Variables**.
2. Run `npm install` if dependencies changed.
3. Run `npx prisma generate` and then `npx prisma migrate dev` (or `prisma migrate deploy` in production) to sync the schema.
4. Start the app with `npm run dev`.
