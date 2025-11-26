import OpenAI from "openai";
import { DEFAULT_TEMPERATURE, OPENAI_IMAGE_MODEL, OPENAI_TEXT_MODEL, requireEnv } from "./config";

let cachedClient: OpenAI | null = null;

function getClient() {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Please add it to your environment.");
  }
  cachedClient = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  return cachedClient;
}

export async function runChatCompletion({
  system,
  user,
  temperature
}: {
  system: string;
  user: string;
  temperature?: number;
}) {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }
  return content.trim();
}

export async function generateImage({
  prompt,
  size = "1024x1024"
}: {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024" | "1024x1792" | "1792x1024" | "auto";
}) {
  const client = getClient();
  const response = await client.images.generate({
    model: OPENAI_IMAGE_MODEL,
    prompt,
    size,
    quality: "standard",
    n: 1
  });

  const image = response.data?.[0];
  const imageUrl = image?.url;
  const base64 = (image as { b64_json?: string | null } | undefined)?.b64_json;

  if (imageUrl) {
    return imageUrl;
  }

  if (base64) {
    return `data:image/png;base64,${base64}`;
  }

  throw new Error(`No image URL returned from OpenAI. Raw data: ${JSON.stringify(image ?? response.data)}`);
}
