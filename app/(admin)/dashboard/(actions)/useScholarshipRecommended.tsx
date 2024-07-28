"use client";

import { useQuery } from "@tanstack/react-query";
import { getViewScholarship } from "./action";
import { FullStudentType } from "@/utils/interfaces";
import filterEligibleScholarships from "./useFilterEligibleScholarships";

const useScholarshipRecommended = (userInfo: FullStudentType) => {
  const { data, isLoading } = useQuery({
    enabled: userInfo !== undefined,
    queryKey: [`scholarship:recommendations`],
    queryFn: async () => {
      const scholarships = await getViewScholarship();
      if (userInfo && scholarships) {
        //TO ADD
        return filterEligibleScholarships(userInfo, scholarships);
      }
      return [];
    },
  });

  return { data, isLoading };
};

export default useScholarshipRecommended;
