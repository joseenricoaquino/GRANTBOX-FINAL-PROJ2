"use client";
import useCurrentUser from "@/actions/useCurrentUser";
import { calculateEligibility } from "@/utils/helpers/recommendations";
import { ScholarshipType } from "@/utils/types";
import { Criteria } from "@prisma/client";
import { useMemo } from "react";

export const useEligibility = (
  criteria: Criteria,
  currScholarshipType: ScholarshipType
) => {
  const currentUser = useCurrentUser();
  const userInfo = currentUser.data;
  const userBackground = userInfo?.studentBackground;
  const userCriteria = userInfo?.studentCriteria;

  const eligibility = useMemo(() => {
    return calculateEligibility(
      userInfo,
      userBackground,
      userCriteria,
      criteria,
      currScholarshipType
    );
  }, [criteria, userBackground, userCriteria, currScholarshipType, userInfo]);

  return eligibility;
};

export default useEligibility;
