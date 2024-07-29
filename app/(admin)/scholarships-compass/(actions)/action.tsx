"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export const getForms = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];

  const data = await prisma.form.findMany({
    where: { studentId: currentUser.id },
    // select: { title: true },
  });
  return data;
};

export const resetForm = async (title: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "User not found" };
    }

    await prisma.form.deleteMany({
      where: {
        studentId: currentUser.id,
        title,
      },
    });

    switch (title) {
      case "Academic Information":
        break;
      case "Academic Based Scholarship Preferences":
        break;
      case "Need-Based Scholarship Preferences":
        break;
      case "Athletic Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isVarsityScholarship: false, isExtracurricular: false },
        });
        break;
      case "Community Service Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: {
            isLeader: false,
            isInnnovative: false,
            isExtracurricular: false,
          },
        });
        break;
      case "PWD (Person with Disability) Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isPWD: false },
        });
        break;
      case "Artists Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isArtistScholarship: false },
        });
        break;
      case "Minority Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isMinority: false },
        });
        break;
      case "Student Worker Scholarship Preferences":
        await prisma.studentBackground.update({
          where: { studentId: currentUser.id },
          data: { isStudentWorker: false },
        });
        break;
    }

    return { success: "Form deleted successfully" };
  } catch (error) {
    return { error: "Error deleting form" };
  }
};
