"use server";
import prisma from "@/lib/prismadb";

export async function fetchCurrentUser(email: string | null | undefined) {
  try {
    if (!email) return null;

    const data = await prisma.user.findFirst({
      where: { email },
      select: { email: true, name: true, id: true, role: true, image: true },
    });

    return data;
  } catch (error) {
    console.error(error, "Error in fetchCurrentUser Function");
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
