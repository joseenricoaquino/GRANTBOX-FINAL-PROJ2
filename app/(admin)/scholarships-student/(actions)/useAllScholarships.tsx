"use client";

import { useQuery } from "@tanstack/react-query";
import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
import { useSearchParams } from "next/navigation";
import { Criteria } from "@prisma/client";
import {
  checkBackground,
  checkCitizenshipApproval,
  checkFieldOfStudyApproval,
  checkFinancialApproval,
  checkGPAApproval,
  checkResidencyApproval,
  countNonNullProperties,
} from "@/utils/helpers/recommendations";
import { getViewScholarship } from "../../dashboard/(actions)/action";
import { ScholarshipType } from "@/utils/types";

const useAllScholarships = (userInfo: FullStudentType) => {
  const searchParams = useSearchParams();
  let name = searchParams.get("name") || "";
  let coverage = searchParams.get("coverage") || "";
  let category = searchParams.get("category") || "";
  let from = undefined;
  let to = undefined;

  const { data, isLoading } = useQuery({
    queryKey: [`scholarship:all`, name, coverage, category, from, to],
    enabled: userInfo !== undefined,
    queryFn: async () => {
      const scholarships = await getViewScholarship({
        name,
        coverage,
        category,
        from,
        to,
      });

      let wtScore = getEligilbilityScore(userInfo, scholarships);

      return wtScore as any[];
    },
  });

  return { data, isLoading };
};

function getEligilbilityScore(
  userInfo: FullStudentType,
  scholarships: FullScholarshipType[]
) {
  const { studentBackground, studentCriteria } = userInfo;

  if (!studentBackground || !studentCriteria) {
    return [];
  }

  let wtElgible: any[] = scholarships
    .map((scholarship) => {
      let eligibilityScore = getEligible(scholarship, userInfo);
      return { scholarship, eligibilityScore };
    })
    .filter((el) => el !== undefined);

  wtElgible.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  return wtElgible;
}

const getEligible = (
  scholarship: FullScholarshipType,
  userInfo: FullStudentType
) => {
  const { studentBackground, studentCriteria } = userInfo;
  const { criteria, ...otherScholarshipData } = scholarship;

  let pts = 0;
  let overall = countNonNullProperties(criteria);
  if ((otherScholarshipData.scholarshipType as ScholarshipType) !== "N/A")
    overall++;

  if (overall === 0) return 0;

  if (
    checkBackground(
      studentBackground,
      otherScholarshipData.scholarshipType as ScholarshipType
    )
  )
    pts++;
  if (checkFinancialApproval(studentCriteria, criteria)) pts++;
  if (checkGPAApproval(studentCriteria, criteria)) pts++;
  if (checkResidencyApproval(userInfo, criteria)) pts++;
  if (checkCitizenshipApproval(userInfo, criteria)) pts++;
  if (checkFieldOfStudyApproval(studentCriteria, criteria)) pts++;

  return pts / overall;
};

export default useAllScholarships;
