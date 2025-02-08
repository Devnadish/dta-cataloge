import { NextResponse } from "next/server";
import { z } from "zod";
import db from "../../../lib/prisma";
import { errorHandler } from "../../../lib/errorHandler";

// Define Zod schema for validation
const updateCommentSchema = z.object({
  text: z.string().min(1).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = updateCommentSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Update the comment
    const updatedComment = await db.comment.update({
      where: { id: params.id },
      data: validatedData.data,
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    return errorHandler(error);
  }
}
