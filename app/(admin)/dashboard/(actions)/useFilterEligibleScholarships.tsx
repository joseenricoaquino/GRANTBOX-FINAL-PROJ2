import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
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
import { ScholarshipType } from "@/utils/types";

const filterEligibleScholarships = (
  userInfo: FullStudentType,
  scholarships: FullScholarshipType[]
) => {
  const { studentBackground, studentCriteria } = userInfo;

  if (!studentBackground || !studentCriteria) {
    return [];
  }

  let wtElgible: any[] = scholarships
    .map((scholarship) => {
      let eligibilityScore = getEligible(scholarship, userInfo);
      if (eligibilityScore * 100 > 60) {
        return { scholarship, eligibilityScore };
      } else {
        return undefined;
      }
    })
    .filter((el) => el !== undefined);

  wtElgible.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

  return wtElgible;
};

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

export default filterEligibleScholarships;
