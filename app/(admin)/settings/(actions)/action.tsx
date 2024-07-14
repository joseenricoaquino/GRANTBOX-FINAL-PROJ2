"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export const getData = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const data = await prisma.user.findFirst({
    where: { id: currentUser.id },
    // include: { college: true, criterias: true },
  });
  return data;
};
