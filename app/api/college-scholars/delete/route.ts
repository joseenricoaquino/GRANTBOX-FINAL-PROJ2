import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("hello world");
    console.log(body);

    const deleted = await prisma.user.delete({ where: { email: body.email } });

    return NextResponse.json({ deleted });
  } catch (error) {
    console.log(error, "COLLEGE_SCHOLARS_DELETE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
