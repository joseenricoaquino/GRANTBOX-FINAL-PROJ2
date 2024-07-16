"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDataScholars, getTrending } from "./action";

const useScholars = () => {
  const [data, setData] = useState<any[]>([]);

  const { data: newData, isLoading } = useQuery({
    queryKey: [`admin:scholars`],
    queryFn: async () => {
      const newData = await getDataScholars();
      setData(newData);
      return newData;
    },
    refetchInterval: 300000,
  });

  return { data, isLoading };
};

export default useScholars;
