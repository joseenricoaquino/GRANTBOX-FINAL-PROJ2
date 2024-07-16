import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return new NextResponse("Unauthorized", { status: 404 });
    const body = await request.json();

    const { qna, answer } = body;
    console.log({ qna, answer });

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { qna, answer },
    });

    return NextResponse.json({ response: "Updated Successfully" });
  } catch (error) {
    console.log(error, "FORGOT_PASSWORD_UPDATE_ERROR");
    return new NextResponse("Internal Error: Adding Forgot Password", {
      status: 500,
    });
  }
}
