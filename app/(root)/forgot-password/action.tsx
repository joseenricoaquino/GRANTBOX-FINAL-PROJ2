"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { FullScholarshipType } from "@/utils/interfaces";

export const fetchEmail = async (toFindEmail: string) => {
  let user = await prisma.user.findFirst({
    where: {
      email: toFindEmail,
    },
    select: {
      email: true,
      qna: true,
    },
  });

  if (!user) return { success: false, email: "", qna: "" };

  return { success: true, email: user.email, qna: user.qna };
};

export const checkUser = async (
  toFindEmail: string,
  qna: string,
  answer: string
) => {
  let user = await prisma.user.findFirst({
    where: {
      email: toFindEmail,
    },
    select: {
      email: true,
      qna: true,
      answer: true,
    },
  });

  if (!user) return false;

  if (user.answer?.toLocaleLowerCase() === answer.toLocaleLowerCase() && user.qna === qna) return true;

  return false;
};
