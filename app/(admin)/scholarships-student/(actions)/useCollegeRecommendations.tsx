"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getRecommendations } from "./action";

const useRecommendation = (id: string, currId: string) => {
  const session = useSession();
  const { data, isLoading } = useQuery({
    enabled: session?.data?.user?.email !== undefined,
    queryKey: [`college:recommendations`],
    queryFn: async () => {
      if (!session?.data?.user?.email) return [];
      const data = await getRecommendations(id);
      return data?.filter((d) => d.id !== currId);
    },
  });
  return { data, isLoading };
};

export default useRecommendation;
