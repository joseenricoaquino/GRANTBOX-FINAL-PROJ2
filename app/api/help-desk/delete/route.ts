import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    console.log(id);

    await prisma.fAQ.delete({ where: { id } });

    return NextResponse.json({ response: "Deleted Successfully" });
  } catch (error) {
    console.log(error, "FAQ_DELETE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
