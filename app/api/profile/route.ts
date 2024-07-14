import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      backgroundId,
      criteriaId,

      educationalLevel,
      gpa,
      nameOfPrevSchool,
      typeOfPrevSchool,
      financialStatus,

      univ1,
      univ2,
      course1,
      course2,
      course3,

      isPWD,
      isArtistScholarship,
      isExtracurricular,
      isInnnovative,
      isLeader,
      isMinority,
      isStudentWorker,
      isVarsityScholarship,
    } = body;

    let coursePreference = [course1, course2];
    if (course3) coursePreference.push(course3);

    let universityPreference = [univ1];
    if (univ2) universityPreference.push(univ2);

    await prisma.$transaction([
      prisma.studentBackground.update({
        where: { id: backgroundId },
        data: {
          isPWD,
          isArtistScholarship,
          isExtracurricular,
          isInnnovative,
          isLeader,
          isMinority,
          isStudentWorker,
          isVarsityScholarship,
        },
      }),
      prisma.studentCriteria.update({
        where: { id: criteriaId },
        data: {
          educationalLevel,
          gpa: parseFloat(gpa),
          nameOfPrevSchool,
          typeOfPrevSchool,
          financialStatus,

          universityPreference,
          coursePreference,
        },
      }),
    ]);

    return NextResponse.json("Updated Successfully");
  } catch (error) {
    console.log(error, "PROFILE_UPDATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
