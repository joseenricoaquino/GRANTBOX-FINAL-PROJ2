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

    return { success: "Form deleted successfully" };
  } catch (error) {
    return { error: "Error deleting form" };
  }
};
