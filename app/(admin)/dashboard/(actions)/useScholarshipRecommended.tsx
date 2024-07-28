"use client";

import { useQuery } from "@tanstack/react-query";
import { getViewScholarship } from "./action";
import { FullStudentType } from "@/utils/interfaces";
import filterEligibleScholarships from "./useFilterEligibleScholarships";
import { useSearchParams } from "next/navigation";

const useScholarshipRecommended = (userInfo: FullStudentType) => {
  const searchParams = useSearchParams();
  let name = searchParams.get("name") || "";
  let coverage = searchParams.get("coverage") || "";
  let category = searchParams.get("category") || "";
  let from = undefined;
  let to = undefined;

  const { data, isLoading } = useQuery({
    enabled: userInfo !== undefined,
    queryKey: [
      `scholarship:recommendations`,
      name,
      coverage,
      category,
      from,
      to,
    ],
    queryFn: async () => {
      const scholarships = await getViewScholarship({
        name,
        coverage,
        category,
        from,
        to,
      });
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
