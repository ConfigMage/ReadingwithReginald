import { NextResponse } from "next/server";
import { runChatCompletion } from "@/lib/openai";
import { buildPagePrompt, getStorySystemPrompt } from "@/lib/prompts";
import { pageRequestSchema } from "@/lib/validation";
import { GeneratedPage } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = pageRequestSchema.parse(json);

    const safetyNote = body.strictSafety
      ? "\n\nKeep the page extra calm, friendly, and bedtime-safe."
      : "";

    const userPrompt = buildPagePrompt({
      config: body,
      characterSheet: body.characterSheet,
      outline: body.outline,
      pageNumber: body.pageNumber,
      outlineEntry: body.outlineEntry
    }) + safetyNote;
    const systemPrompt = getStorySystemPrompt();

    const completion = await runChatCompletion({
      system: systemPrompt,
      user: userPrompt,
      temperature: 0.9
    });

    let parsed: GeneratedPage | null = null;
    try {
      parsed = JSON.parse(completion) as GeneratedPage;
    } catch {
      parsed = null;
    }

    if (!parsed) {
      throw new Error("Could not parse generated page JSON");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Page generation failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
