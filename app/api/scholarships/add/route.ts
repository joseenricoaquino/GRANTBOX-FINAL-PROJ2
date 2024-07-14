import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      location,
      details,
      collegeName: name,
      scholarshipType,
      coverageType,
      deadline,
    } = body;

    let existingCollege = await prisma.college.findFirst({
      where: {
        name,
      },
    });

    if (!existingCollege) {
      existingCollege = await prisma.college.create({
        data: {
          location,
          details,
          name,
        },
      });
    }

    const newScholarship = await prisma.scholarship.create({
      data: {
        college: { connect: { id: existingCollege.id } },
        scholarshipType,
        coverageType,
        deadline: new Date(deadline),
        details,
        title: "",
      },
    });

    return NextResponse.json({ newScholarship, existingCollege });
  } catch (error) {
    console.log(error, "SCHOLARSHIPS_ADD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
