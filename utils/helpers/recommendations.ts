import { Criteria, StudentCriteria, User } from "@prisma/client";
import { FinancialStatusEnum, ScholarshipMapping } from "../types";


export const calculateEligibility = (
  userInfo: any,
  userBackground: any,
  userCriteria: any,
  criteria: any,
  currScholarshipType: any
) => {
  let pts = 0;
  let overAll = countNonNullProperties(criteria);

  let inStudentBG = false;
  let inGPA = false;
  let sameLocation = false;
  let sameNationality = false;
  let sameFoS = false;
  let financeNeeds = false;

  if (userBackground && userCriteria) {
    const truths = Object.entries(userBackground).reduce(
      (acc, [key, value]) => {
        //@ts-ignore
        if (value === true) acc.push(key);
        return acc;
      },
      []
    );

    const scholarshipTypes = truths.map((key) => ScholarshipMapping[key]);

    const userFinancial = FinancialStatusEnum.findIndex(
      (d) => d === userCriteria?.financialStatus
    );
    const criteriaFinancial = FinancialStatusEnum.findIndex(
      (d) => d === criteria?.financialStatus
    );

    if (userFinancial <= criteriaFinancial) {
      pts++;
      financeNeeds = true;
    }
    if (userCriteria.gpa >= (criteria?.grades ?? 100)) {
      pts++;
      inGPA = true;
    }
    if (userInfo.address === criteria.location) {
      pts++;
      sameLocation = true;
    }
    if (userInfo.nationality === criteria.citizenship) {
      pts++;
      sameNationality = true;
    }
    if (
      userCriteria.coursePreference.includes(criteria?.courseInterest ?? "")
    ) {
      pts++;
      sameFoS = true;
    }
  }

  return {
    eligibility: (pts / overAll) * 100,
    inStudentBG,
    inGPA,
    sameLocation,
    sameNationality,
    sameFoS,
    financeNeeds,
  };
};

export function checkFinancialApproval(
  userCriteria: StudentCriteria,
  baseCriteria: Criteria
): boolean {
  const userFinancial = FinancialStatusEnum.findIndex(
    (d) => d === userCriteria?.financialStatus
  );
  const criteriaFinancial = FinancialStatusEnum.findIndex(
    (d) => d === baseCriteria?.financialStatus
  );

  if (userFinancial <= criteriaFinancial) return true;
  else return false;
}
export function checkGPAApproval(
  userCriteria: StudentCriteria,
  baseCriteria: Criteria
): boolean {
  if ((userCriteria?.gpa ?? 0) >= (baseCriteria?.grades ?? 100)) {
    return true;
  } else return false;
}
export function checkResidencyApproval(
  userInfo: Partial<User>,
  baseCriteria: Criteria
): boolean {
  if (userInfo.address === baseCriteria.location) {
    return true;
  } else return false;
}
export function checkCitizenshipApproval(
  userInfo: Partial<User>,
  baseCriteria: Criteria
): boolean {
  if (userInfo.nationality === baseCriteria.citizenship) {
    return true;
  } else return false;
}
export function checkFieldOfStudyApproval(
  userCriteria: StudentCriteria,
  baseCriteria: Criteria
): boolean {
  if (
    userCriteria.coursePreference.includes(baseCriteria?.courseInterest ?? "")
  ) {
    return true;
  } else return false;
}

export function countNonNullProperties(criteria: Criteria): number {
  let count = 0;
  for (const [key, value] of Object.entries(criteria)) {
    if (
      key !== "id" &&
      key !== "scholarshipId" &&
      key !== "prevSchool" &&
      value !== null &&
      value !== ""
    ) {
      count++;
    }
  }

  return count;
}
