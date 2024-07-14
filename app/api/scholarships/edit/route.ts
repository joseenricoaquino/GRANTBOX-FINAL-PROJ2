import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      collegeName: name,
      detailsCollege,
      location,
      webLink,
      image,

      details,
      scholarshipType,
      coverageType,
      deadline,
      formLink,

      grades,
      financialStatus,
      prevSchool,
      residency,
      citizenship,
      club,
      fos,

      collegeId,
      scholarshipId,
      criteriaId,
    } = body;

    await prisma.college.update({
      where: { id: collegeId },
      data: {
        name,
        details: detailsCollege,
        location,
        webLink,
        image,
      },
    });

    await prisma.scholarship.update({
      where: { id: scholarshipId },
      data: {
        details,
        scholarshipType,
        coverageType,
        deadline: new Date(deadline),
        formLink,
      },
    });

    await prisma.criteria.update({
      where: { id: criteriaId },
      data: {
        grades: parseInt(grades),
        financialStatus,
        prevSchool,
        location: residency,
        citizenship,
        extracurricularActivities: club,
        courseInterest: fos,
      },
    });

    return NextResponse.json("Updated Successfully");
  } catch (error) {
    console.log(error, "SCHOLARSHIPS_EDIT_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
