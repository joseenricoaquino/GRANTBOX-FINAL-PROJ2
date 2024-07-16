"use server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { ScholarFilterType } from "@/utils/interfaces";

export const getData = async (scholarFilter: ScholarFilterType) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  // Process filters
  const coverageArray = scholarFilter.coverage
    ? scholarFilter.coverage.split(",")
    : [];
  const categoryArray = scholarFilter.category
    ? scholarFilter.category.split(",")
    : [];

  // Determine if any filter has a meaningful value
  const hasFilters =
    scholarFilter.name || coverageArray.length > 0 || categoryArray.length > 0;

  // Fetch all records if no filters are applied
  if (!hasFilters) {
    const data = await prisma.scholarship.findMany({
      include: { college: true, criteria: true },
    });
    return data;
  }

  let whereClauseArray: any = [
    { coverageType: { in: coverageArray } },
    { scholarshipType: { in: categoryArray } },
  ];
  if (scholarFilter.name !== "" || scholarFilter.name)
    whereClauseArray.push({
      college: { collegeName: { contains: scholarFilter.name } },
    });

  // Apply filters if any are present
  const data = await prisma.scholarship.findMany({
    where: {
      OR: whereClauseArray,
    },
    include: { college: true, criteria: true },
  });

  return data;
};

export const getViewScholarship = async (id: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const data = await prisma.scholarship.findFirst({
    where: { id },
    include: { college: true, criteria: true },
  });
  return data;
};

export const getRecommendations = async (collegeId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return [];

  try {
    const data = await prisma.scholarship.findMany({
      where: { collegeId },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updatedScholarshipClicks = async (
  scholarId: string,
  prevClicks: number
) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return undefined;

  try {
    const data = await prisma.scholarship.update({
      where: { id: scholarId },
      data: {
        number_of_clicks: prevClicks + 1,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
