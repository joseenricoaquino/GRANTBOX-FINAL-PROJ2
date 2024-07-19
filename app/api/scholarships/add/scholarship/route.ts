import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      scholarshipType,
      details,
      collegeName: name,
      coverageType,
      formLink,
      deadline,

      grades,
      financialStatus,
      prevSchool,
      residency,
      citizenship,
      club,
      fos,
    } = body;

    let existingCollege = await prisma.college.findFirst({
      where: {
        name,
      },
    });

    if (!existingCollege) {
      return new NextResponse("No Existing College in the Database", {
        status: 400,
      });
    }

    const newScholarship = await prisma.scholarship.create({
      data: {
        college: { connect: { id: existingCollege.id } },
        title: "",
        details,
        scholarshipType,
        coverageType,
        deadline: new Date(deadline),
        formLink,
        sourceType: "MANUAL",
      },
    });

    const newCritera = await prisma.criteria.create({
      data: {
        scholarship: { connect: { id: newScholarship.id } },
        grades: parseInt(grades),
        financialStatus,
        prevSchool,
        location: residency,
        citizenship,
        extracurricularActivities: club,
        courseInterest: fos,
      },
    });

    return NextResponse.json({ newScholarship, newCritera });
  } catch (error) {
    console.log(error, "SCHOLARSHIP_ADD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
