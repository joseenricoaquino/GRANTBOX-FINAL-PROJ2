"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAllExistingCollege } from "./action";

const useExistingCollege = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`existing-college`],
    queryFn: async () => {
      const data = await fetchAllExistingCollege();
      return data;
    },
  });
  return { data, isLoading };
};

export default useExistingCollege;
