import {
  Criteria,
  StudentBackground,
  StudentCriteria,
  User,
} from "@prisma/client";
import {
  FinancialStatusEnum,
  ScholarshipMapping,
  ScholarshipType,
} from "../types";

export const calculateEligibility = (
  userInfo: any,
  userBackground: any,
  userCriteria: any,
  criteria: any,
  currScholarshipType: any
) => {
  let pts = 0;
  let overAll = countNonNullProperties(criteria);
  if (currScholarshipType !== "N/A") overAll++;

  let inStudentBG = false;
  let inGPA = false;
  let sameLocation = false;
  let sameNationality = false;
  let sameFoS = false;
  let financeNeeds = false;

  console.log(criteria);
  console.log(overAll);

  if (userBackground && userCriteria) {
    // const truths = Object.entries(userBackground).reduce(
    //   (acc, [key, value]) => {
    //     //@ts-ignore
    //     if (value === true) acc.push(key);
    //     return acc;
    //   },
    //   []
    // );

    // const scholarshipTypes: any[] = truths.map(
    //   (key) => ScholarshipMapping[key]
    // );

    const userFinancial = FinancialStatusEnum.findIndex(
      (d) => d === userCriteria?.financialStatus
    );
    const criteriaFinancial = FinancialStatusEnum.findIndex(
      (d) => d === criteria?.financialStatus
    );

    // if (userFinancial <= criteriaFinancial || criteriaFinancial === 0) {
    //   pts++;
    //   financeNeeds = true;
    // }
    if (userFinancial <= criteriaFinancial) {
      pts++;
      financeNeeds = true;
    }
    if (userCriteria.gpa >= (criteria?.grades ?? 100)) {
      pts++;
      inGPA = true;
    }
    if (userInfo.address === criteria?.location) {
      pts++;
      sameLocation = true;
    }
    if (userInfo.nationality === criteria?.citizenship) {
      pts++;
      sameNationality = true;
    }
    if (
      userCriteria.coursePreference.includes(criteria?.courseInterest ?? "")
    ) {
      pts++;
      sameFoS = true;
    }
    if (
      checkBackground(userBackground, currScholarshipType as ScholarshipType)
    ) {
      pts++;
      inStudentBG = true;
    }
    // if ([...scholarshipTypes].includes(currScholarshipType)) {
    //   pts++;
    //   inStudentBG = true;
    // }
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
  ); //1 - index
  const criteriaFinancial = FinancialStatusEnum.findIndex(
    (d) => d === baseCriteria?.financialStatus
  ); //0 - index

  //Meaning not spcified
  if (criteriaFinancial === 0) return false;
  // if (userFinancial <= criteriaFinancial || criteriaFinancial === 0) return true;
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
  if (userInfo?.address === baseCriteria?.location) {
    return true;
  } else return false;
}
export function checkCitizenshipApproval(
  userInfo: Partial<User>,
  baseCriteria: Criteria
): boolean {
  if (userInfo?.nationality === baseCriteria?.citizenship) {
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

export function checkBackground(
  userBackground: StudentBackground,
  scholarshipType: ScholarshipType
): boolean {
  if (scholarshipType === "N/A") return false;
  if (
    scholarshipType === "Athletic Scholarship" &&
    userBackground.isVarsityScholarship
  )
    return true;

  if (
    scholarshipType === "Academic Scholarship" &&
    userBackground.isInnnovative // Assuming "isInnnovative" is intended for academic or innovative achievements
  )
    return true;

  if (
    scholarshipType === "Merit Scholarship" &&
    userBackground.isInnnovative // Assuming "isInnnovative" is intended for merit achievements
  )
    return true;

  if (scholarshipType === "Minority Scholarship" && userBackground.isMinority)
    return true;

  if (
    scholarshipType === "Creative Scholarship" &&
    userBackground.isArtistScholarship
  )
    return true;

  if (scholarshipType === "PWD Scholarship" && userBackground.isPWD)
    return true;

  if (
    scholarshipType === "Student Worker Scholarship" &&
    userBackground.isStudentWorker
  )
    return true;

  return false;
}

export function countNonNullProperties(criteria: Criteria): number {
  let count = 0;
  if (!criteria) return count;

  for (const [key, value] of Object.entries(criteria)) {
    if (
      key !== "id" &&
      key !== "scholarshipId" &&
      key !== "prevSchool" &&
      key !== "disability" &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "Not Specified"
    ) {
      count++;
    }
  }

  return count;
}
