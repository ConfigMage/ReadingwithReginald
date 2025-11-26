export const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-5.1";
export const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
export const DEFAULT_TEMPERATURE = 0.8;

export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
