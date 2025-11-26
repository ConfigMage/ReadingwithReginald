import { NextResponse } from "next/server";
import { runChatCompletion } from "@/lib/openai";
import { buildOutlinePrompt, getStorySystemPrompt } from "@/lib/prompts";
import { outlineRequestSchema } from "@/lib/validation";
import { OutlineResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = outlineRequestSchema.parse(json);

    const safetyNote = body.strictSafety
      ? "\n\nReminder: keep every event gentle, calm, and reassuring for a bedtime story."
      : "";
    const userPrompt = buildOutlinePrompt({ config: body, characterSheet: body.characterSheet }) + safetyNote;
    const systemPrompt = getStorySystemPrompt();

    const completion = await runChatCompletion({
      system: systemPrompt,
      user: userPrompt
    });

    let parsed: OutlineResponse | null = null;
    try {
      parsed = JSON.parse(completion) as OutlineResponse;
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      outline: parsed?.pages ?? [],
      title: parsed?.title ?? "Your Cozy Story",
      raw: completion
    });
  } catch (error) {
    console.error("Outline generation failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
