import { NextResponse } from "next/server";

export const errorHandler = (error: any, status: number = 500) => {
  console.error("Error:", error);

  return NextResponse.json(
    {
      error: error.message || "An unexpected error occurred",
    },
    { status }
  );
};
