import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
import { Criteria } from "@prisma/client";
import {
  checkCitizenshipApproval,
  checkFieldOfStudyApproval,
  checkFinancialApproval,
  checkGPAApproval,
  checkResidencyApproval,
  countNonNullProperties,
} from "@/utils/helpers/recommendations";

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
      let eligibilityScore = getEligible(scholarship.criteria, userInfo);
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

export default filterEligibleScholarships;
