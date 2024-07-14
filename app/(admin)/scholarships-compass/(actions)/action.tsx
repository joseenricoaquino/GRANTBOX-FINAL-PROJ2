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
