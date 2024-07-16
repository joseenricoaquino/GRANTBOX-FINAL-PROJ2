"use client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { useState } from "react";
import { getTrending } from "./action";

const useTrending = () => {
  const [data, setData] = useState<any[]>([]);

  const { data: newData, isLoading } = useQuery({
    queryKey: [`scholarships:trending`],
    queryFn: async () => {
      const newData = await getTrending();
      setData(newData);
      return newData;
    },
    refetchInterval: 300000 
  });

  return { data, isLoading };
};

export default useTrending;
