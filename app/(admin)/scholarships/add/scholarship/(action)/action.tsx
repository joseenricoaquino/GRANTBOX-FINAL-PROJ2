"use server";

import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export async function fetchAllExistingCollege() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const data = await prisma.college.findMany({});
    return data;
  } catch (error) {
    console.error(error, "Error in fetchAllExistingCollege");
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
