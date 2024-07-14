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

const templateParams = {
  from_name: "kielo.mercado04@gmail.com",
  to_name: "Kels",
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
