"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getForms } from "./action";

const useForms = () => {
  const session = useSession();
  const { data, isLoading } = useQuery({
    enabled: session?.data?.user?.email !== undefined,
    queryKey: [`forms`],
    queryFn: async () => {
      if (!session?.data?.user?.email) return [];
      const data = await getForms();
      return data
    },
  });
  return { data, isLoading };
};

export default useForms;
