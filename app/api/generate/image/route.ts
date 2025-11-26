import { NextResponse } from "next/server";
import { generateImage } from "@/lib/openai";
import { buildWrappedImagePrompt, getImageSystemPrompt } from "@/lib/prompts";
import { imageRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = imageRequestSchema.parse(json);

    const prompt = buildWrappedImagePrompt({
      imagePrompt: body.imagePrompt,
      style: body.artStyle,
      characterSheet: body.characterSheet ?? ""
    });

    const systemPrompt = getImageSystemPrompt();
    const finalPrompt = `${systemPrompt}\n\n${prompt}`;

    const imageUrl = await generateImage({
      prompt: finalPrompt
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
