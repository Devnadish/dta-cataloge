import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      select: { id: true, title: true },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import db from "@/lib/prisma";

// export async function GET() {
//   try {
//     const galleries = await db.gallery.findMany();
//     return NextResponse.json(galleries);
//   } catch (error) {
//     console.error("Error fetching galleries:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch galleries" },
//       { status: 500 }
//     );
//   }
// }
