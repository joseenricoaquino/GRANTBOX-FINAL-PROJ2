import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, details, collegeName: name, webLink, imageLink } = body;

    let existingCollege = await prisma.college.findFirst({
      where: {
        name,
      },
    });

    if (existingCollege) {
      return new NextResponse("Existing College in the Database", {
        status: 400,
      });
    }

    const newCollege = await prisma.college.create({
      data: {
        details,
        name,
        location,
        webLink,
        image: imageLink,
      },
    });

    return NextResponse.json({ newCollege });
  } catch (error) {
    console.log(error, "COLLEGE_ADD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
