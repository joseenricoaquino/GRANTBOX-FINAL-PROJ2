import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await prisma.user.update({
      where: { email: body.email },
      data: {
        name: "oyoyoyoyoyoyo ",
      },
    });

    return NextResponse.json("");
  } catch (error) {
    console.log(error, "COLLEGE_SCHOLARS_EDIT_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
