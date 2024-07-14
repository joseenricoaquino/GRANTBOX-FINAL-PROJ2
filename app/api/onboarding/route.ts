import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const currentStudent = await getCurrentUser();

    if (!currentStudent) return;

    await prisma.user.update({
      where: { id: currentStudent.id },
      data: {
        newScholarship: body.isNewScholarship,
        scholarshipDeadlines: body.isScholarshipDeadline,
      },
    });

    const newStudentCriteria = await prisma.studentCriteria.create({
      data: {
        student: { connect: { id: currentStudent.id } },
        educationalLevel: body.educationalLevel,
        gpa: body.percentageGrade,
        nameOfPrevSchool: body.nameOfPrevSchool,
        typeOfPrevSchool: body.typeOfPrevSchool,
        financialStatus: body.financialStatus,
        universityPreference: body.universityPreferences,
        coursePreference: body.coursePreferences,
      },
    });
    const vals: boolean[] = body.studentBG;

    const newStudentBackground = await prisma.studentBackground.create({
      data: {
        student: { connect: { id: currentStudent.id } },
        isPWD: vals[0],
        isVarsityScholarship: vals[1],
        isArtistScholarship: vals[2],
        isExtracurricular: vals[3],
        isLeader: vals[4],
        isMinority: vals[5],
        isStudentWorker: vals[6],
        isInnnovative: vals[7],
      },
    });

    return NextResponse.json({ newStudentCriteria, newStudentBackground });
  } catch (error) {
    console.log(error, "ONBOARDING_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
