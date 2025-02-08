import { NextResponse } from "next/server";
import { z } from "zod";
import db from "../../../lib/prisma";
import { errorHandler } from "../../../lib/errorHandler";

// Define Zod schema for validation
const updateShareSchema = z.object({
  shareType: z.enum(["public", "private", "invite"]).optional(),
  shareLink: z.string().url().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = updateShareSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Update the share
    const updatedShare = await db.share.update({
      where: { id: params.id },
      data: validatedData.data,
    });

    return NextResponse.json(updatedShare);
  } catch (error) {
    return errorHandler(error);
  }
}
