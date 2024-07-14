import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const deleted = await prisma.scholarship.delete({ where: { id: body.id } });

    return NextResponse.json({ deleted });
  } catch (error) {
    console.log(error, "COLLEGE_SCHOLARS_DELETE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
