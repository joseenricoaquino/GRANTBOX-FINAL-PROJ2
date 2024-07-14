import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { newScholarship, scholarshipDeadlines, userId } = body;
    await prisma.user.update({
      where: { id: userId },
      data: { newScholarship, scholarshipDeadlines },
    });

    return NextResponse.json("Updated Successfully");
  } catch (error) {
    console.log(error, "SETTINGS_NOTIFICATIONS_EDIT_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
