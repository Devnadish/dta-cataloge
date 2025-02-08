import { NextResponse } from "next/server";
import { z } from "zod";
import db from "../../../lib/prisma";
import { errorHandler } from "../../../lib/errorHandler";

// Define Zod schema for validation
const updateReactionSchema = z.object({
  emoji: z.string().optional(),
  count: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = updateReactionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Update the reaction
    const updatedReaction = await db.reaction.update({
      where: { id: params.id },
      data: validatedData.data,
    });

    return NextResponse.json(updatedReaction);
  } catch (error) {
    return errorHandler(error);
  }
}
