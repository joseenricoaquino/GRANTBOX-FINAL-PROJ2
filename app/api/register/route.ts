import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, dob, password, address, nationality, contact, name } = body;

    if (!email || !dob || !password || !address || !nationality || !contact) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }] },
    });

    if (existing)
      return new NextResponse("Oh no, email already exists in the system!", {
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "STUDENT",
        address,
        nationality,
        contact,
        dob: new Date(dob),
      },
    });

    return NextResponse.json({ email, role: "STUDENT" });
  } catch (error) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
