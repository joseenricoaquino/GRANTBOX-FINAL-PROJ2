"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export const getData = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];
  if (currentUser.role === "STUDENT") return [];

  const data = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
  });
  return data;
};
