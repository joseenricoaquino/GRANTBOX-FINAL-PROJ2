import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, image } = body;

    await prisma.user.update({
      where: { id: userId },
      data: { image },
    });

    return NextResponse.json("Updated Successfully");
  } catch (error) {
    console.log(error, "PROFILE_PIC_EDIT_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
