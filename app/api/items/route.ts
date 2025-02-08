import { NextResponse } from "next/server";
import { z } from "zod";
import db from "../../../lib/prisma";
import { errorHandler } from "../../../lib/errorHandler";

// Define Zod schema for validation
const updateItemSchema = z.object({
  title: z.string().min(1).optional(),
  mediaUrl: z.string().url().optional(),
  galleryId: z.string().uuid().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = updateItemSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Update the item
    const updatedItem = await db.item.update({
      where: { id: params.id },
      data: validatedData.data,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return errorHandler(error);
  }
}
