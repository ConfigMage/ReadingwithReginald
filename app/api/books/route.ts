import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { saveBookSchema } from "@/lib/validation";

// Allow larger payloads when saving books (texts + image URLs).
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
};

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = saveBookSchema.parse(json);

    const characterSheet =
      typeof body.characterSheet === "string" ? JSON.parse(body.characterSheet) : body.characterSheet;
    const outline = typeof body.outline === "string" ? JSON.parse(body.outline) : body.outline;

    const book = await prisma.book.create({
      data: {
        title: body.title,
        theme: body.theme,
        style: body.style,
        tone: body.tone,
        childName: body.childName || null,
        favorites: body.favorites,
        lessonOfTheDay: body.lessonOfTheDay || null,
        totalPages: body.totalPages,
        characterSheet,
        outline
      }
    });

    await prisma.page.createMany({
      data: body.pages.map((page) => ({
        bookId: book.id,
        pageNumber: page.pageNumber,
        text: page.text,
        imageUrl: page.imageUrl,
        imagePrompt: page.imagePrompt
      }))
    });

    return NextResponse.json({ bookId: book.id });
  } catch (error) {
    console.error("Saving book failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        theme: true,
        style: true,
        totalPages: true,
        createdAt: true,
        tone: true
      }
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("List books failed", error);
    return NextResponse.json({ error: "Failed to load books" }, { status: 500 });
  }
}
