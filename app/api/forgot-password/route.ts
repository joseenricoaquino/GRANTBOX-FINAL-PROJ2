import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, newPassword } = body;
    console.log({ email, newPassword });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const success = await prisma.user.update({
      where: { email },
      data: { hashedPassword },
    });

    if (success) return NextResponse.json({ response: "Updated Successfully" });

    return new NextResponse("Internal Error: Chaing Password", {
      status: 500,
    });
  } catch (error) {
    console.log(error, "FORGOT_PASSWORD_UPDATE_ERROR");
    return new NextResponse("Internal Error: Changing Password", {
      status: 500,
    });
  }
}
