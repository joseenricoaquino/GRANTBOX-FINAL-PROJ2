"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { FullScholarshipType } from "@/utils/interfaces";

import emailjs from "@emailjs/browser";

export const getViewScholarship = async ({
  name,
  coverage,
  category,
  from,
  to,
}: {
  name: string;
  coverage: string;
  category: string;
  from: string | undefined;
  to: string | undefined;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];

  const whereClause: any = {};

  let coverageArr = coverage.split(",").filter((val) => val !== "");
  let categoryArr = category.split(",").filter((val) => val !== "");

  if (name) {
    whereClause.title = {
      contains: name,
      mode: "insensitive", // case-insensitive filtering
    };
  }

  if (coverageArr.length > 0) {
    whereClause.OR = [
      ...coverageArr.map((coverageType) => ({
        coverageType,
      })),
    ];
  }

  if (categoryArr.length > 0) {
    if (!whereClause.OR) whereClause.OR = [];
    whereClause.OR = [
      ...whereClause.OR,
      ...categoryArr.map((scholarshipType) => ({
        scholarshipType,
      })),
    ];
  }

  if (from && to) {
    whereClause.deadline = {};
    if (from) {
      whereClause.deadline.gte = new Date(from);
    }
    if (to) {
      whereClause.deadline.lte = new Date(to);
    }
  }

  const data = await prisma.scholarship.findMany({
    where: whereClause,
    include: { college: true, criteria: true },
  });

  return data as FullScholarshipType[];
};

export const getTrending = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];

  const data = await prisma.scholarship.findMany({
    orderBy: {
      number_of_clicks: "desc",
    },
    take: 10,
    select: { id: true, number_of_clicks: true, title: true },
  });
  return data;
};

const templateParams = {
  from_name: "coyaquino30@gmail.com",
  to_name: "Coy",
  message: "Hello",
};

export const sendEmail = async () => {
  const service_key = "service_4pkan6x";
  const template_key = "template_4job9ms";
  const public_key = "ceIp0fgC0JxwJEHUj";
  try {
    emailjs.send(service_key, template_key, templateParams, public_key).then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
    console.log("sent");
  } catch (error) {
    console.log(error);
  }
};

export const getDataScholars = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];
  if (currentUser.role === "STUDENT") return [];

  const data = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    select: { id: true, email: true, name: true },
    take: 5,
  });
  return data;
};
