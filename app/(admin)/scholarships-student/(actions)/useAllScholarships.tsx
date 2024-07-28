"use client";

import { useQuery } from "@tanstack/react-query";
import { getData } from "./action";
import {
  FullScholarshipType,
  FullStudentType,
  ScholarFilterType,
} from "@/utils/interfaces";
import { useSearchParams } from "next/navigation";
import filterEligibleScholarships from "../../dashboard/(actions)/useFilterEligibleScholarships";
import { Criteria } from "@prisma/client";
import {
  checkCitizenshipApproval,
  checkFieldOfStudyApproval,
  checkFinancialApproval,
  checkGPAApproval,
  checkResidencyApproval,
  countNonNullProperties,
} from "@/utils/helpers/recommendations";

const useAllScholarships = (userInfo: FullStudentType) => {
  const searchParams = useSearchParams();

  const filter: ScholarFilterType = {
    name: searchParams.get("name") || "",
    coverage: searchParams.get("coverage") || "",
    category: searchParams.get("category") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: [`scholarship:all`],
    queryFn: async () => {
      const scholarships = (await getData(filter)) as any[];

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
      let eligibilityScore = getEligible(scholarship.criteria, userInfo);
      return { scholarship, eligibilityScore };
    })
    .filter((el) => el !== undefined);

  wtElgible.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  return wtElgible;
}

const getEligible = (criteria: Criteria, userInfo: FullStudentType) => {
  const { studentBackground, studentCriteria } = userInfo;

  let pts = 0;
  const overall = countNonNullProperties(criteria);

  if (overall === 0) return 0;

  if (checkFinancialApproval(studentCriteria, criteria)) pts++;
  if (checkGPAApproval(studentCriteria, criteria)) pts++;
  if (checkResidencyApproval(userInfo, criteria)) pts++;
  if (checkCitizenshipApproval(userInfo, criteria)) pts++;
  if (checkFieldOfStudyApproval(studentCriteria, criteria)) pts++;

  return pts / overall;
};

export default useAllScholarships;
