"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export const getData = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;
  if (currentUser.role === "STUDENT") return null;

  const data = await prisma.scholarship.findMany({
    include: { college: true, criteria: true },
  });
  return data;
};

export const getViewScholarship = async (id: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;
  if (currentUser.role === "STUDENT") return null;

  const data = await prisma.scholarship.findFirst({
    where: { id },
    include: { college: true, criteria: true },
  });
  return data;
};
