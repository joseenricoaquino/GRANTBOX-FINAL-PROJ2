"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { FullScholarshipType } from "@/utils/interfaces";

import emailjs from "@emailjs/browser";

export const getViewScholarship = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];

  const data = await prisma.scholarship.findMany({
    where: {},
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
