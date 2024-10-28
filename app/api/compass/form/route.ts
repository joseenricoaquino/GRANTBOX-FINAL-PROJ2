import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.id)
      return new NextResponse("Unauthorized", { status: 500 });

    const body = await request.json();

    await prisma.form.create({
      data: {
        ...body,
        student: { connect: { id: currentUser.id } },
      },
    });

    switch (body.title) {
      case "Academic Information":
        await prisma.studentCriteria.update({
          where: { studentId: currentUser.id },
          data: { gpa: parseInt(body.percentageGrade) },
        });
        break;
      case "Academic Based Scholarship Preferences":
        await prisma.studentCriteria.update({
          where: { studentId: currentUser.id },
          data: {},
        });
        break;
      case "Need-Based Scholarship Preferences":
        await prisma.studentCriteria.update({
          where: { studentId: currentUser.id },
          data: { financialStatus: body.householdIncome },
        });
        break;
      case "Athletic Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isVarsityScholarship: true, isExtracurricular: true },
        });
        break;
      case "Community Service Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: {
            isLeader: true,
            isInnnovative: true,
            isExtracurricular: true,
          },
        });
        break;
      case "PWD (Person with Disability) Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isPWD: true },
        });
        break;
      case "Artists Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isArtistScholarship: true },
        });
        break;
      case "Minority Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isMinority: true },
        });
        break;
      case "Student Worker Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isStudentWorker: true },
        });
        break;
    }

    return NextResponse.json("Added Form");
  } catch (error) {
    console.log(error, "COMPASS_FORM_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
