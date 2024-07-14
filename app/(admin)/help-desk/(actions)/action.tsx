"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export const getData = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];
    const data = await prisma.fAQ.findMany({});
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
