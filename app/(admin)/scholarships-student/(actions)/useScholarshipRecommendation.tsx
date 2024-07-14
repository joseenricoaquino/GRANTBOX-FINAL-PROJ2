"use client";
import useCurrentUser from "@/actions/useCurrentUser";
import {
  checkCitizenshipApproval,
  checkFieldOfStudyApproval,
  checkFinancialApproval,
  checkGPAApproval,
  checkResidencyApproval,
  countNonNullProperties,
} from "@/utils/helpers/recommendations";
import { FullScholarshipType } from "@/utils/interfaces";
import { Criteria } from "@prisma/client";
import { useMemo } from "react";

const useScholarshipRecommendation = (initialData: FullScholarshipType[]) => {
  const currentUser = useCurrentUser();
  const userInfo = currentUser.data;

  const data = useMemo(() => {
    const userBackground = userInfo?.studentBackground;
    const userCriteria = userInfo?.studentCriteria;

    if (userBackground && userCriteria && userInfo) {
      let recommendedScholarships = initialData
        .map((d) => {
          return isEligible(d.criteria) ? d : null;
        })
        .filter((d) => d !== null);

      return recommendedScholarships;
    }

    function isEligible(baseCriteria: Criteria): boolean {
      const userBackground = userInfo?.studentBackground;
      const userCriteria = userInfo?.studentCriteria;

      let pts = 0;
      let overall = countNonNullProperties(baseCriteria);

      if (userBackground && userCriteria && userInfo) {
        if (checkFinancialApproval(userCriteria, baseCriteria)) {
          pts++;
        }
        if (checkGPAApproval(userCriteria, baseCriteria)) {
          pts++;
        }
        if (checkResidencyApproval(userInfo, baseCriteria)) {
          pts++;
        }
        if (checkCitizenshipApproval(userInfo, baseCriteria)) {
          pts++;
        }
        if (checkFieldOfStudyApproval(userCriteria, baseCriteria)) {
          pts++;
        }
        return (pts / overall) * 100 > 60;
      } else return false;
    }
    return [];
  }, [initialData, userInfo]);
  return data;
};
export default useScholarshipRecommendation;
