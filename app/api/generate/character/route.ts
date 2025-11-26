import { NextResponse } from "next/server";
import { runChatCompletion } from "@/lib/openai";
import { buildCharacterPrompt, getStorySystemPrompt } from "@/lib/prompts";
import { characterRequestSchema } from "@/lib/validation";
import { CharacterSheet } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = characterRequestSchema.parse(json);

    const safetyNote = body.strictSafety
      ? "\n\nReminder: keep everything extra gentle, cozy, and safe for a 3-5 year old."
      : "";

    const userPrompt = buildCharacterPrompt(body) + safetyNote;
    const systemPrompt = getStorySystemPrompt();

    const completion = await runChatCompletion({
      system: systemPrompt,
      user: userPrompt
    });

    let parsed: CharacterSheet | null = null;
    try {
      parsed = JSON.parse(completion) as CharacterSheet;
    } catch {
      parsed = null;
    }

    return NextResponse.json({ characterSheet: completion, character: parsed });
  } catch (error) {
    console.error("Character generation failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
