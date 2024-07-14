import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, response } = body;
    console.log({ question, response });

    const newFAQ = await prisma.fAQ.create({ data: { question, response } });

    return NextResponse.json({ response: "Added Successfully", data: newFAQ });
  } catch (error) {
    console.log(error, "FAQ_ADD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
