"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getCurrentUser from "./getCurrentUser";

const useCurrentUser = () => {
  const session = useSession();
  const { data, isLoading } = useQuery({
    enabled: session?.data?.user?.email !== undefined,
    queryKey: [`currentUser`],
    queryFn: async () => {
      if (!session?.data?.user?.email) return undefined;
      const data = await getCurrentUser();
      return data;
    },
  });
  return { data, isLoading };
};

export default useCurrentUser;
