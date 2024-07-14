"use client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { useState } from "react";
import { getData } from "../(action)/action";

const useData = (userInfo: User) => {
  const [data, setData] = useState<any[]>([]);

  const { data: newData, isLoading } = useQuery({
    enabled: userInfo !== undefined,
    queryKey: [`scholarships:student`],
    queryFn: async () => {
      const newData = await getData();
      setData(newData);
      return newData;
    },
  });

  return { data, isLoading };
};

export default useData;
