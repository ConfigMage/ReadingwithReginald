import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        pages: {
          orderBy: { pageNumber: "asc" }
        }
      }
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book, pages: book.pages });
  } catch (error) {
    console.error("Get book failed", error);
    return NextResponse.json({ error: "Failed to load book" }, { status: 500 });
  }
}
