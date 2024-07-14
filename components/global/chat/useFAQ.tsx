"use client";

import { useQuery } from "@tanstack/react-query";
import { getFAQs } from "./action";

const useFAQ = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`faq`],
    queryFn: async () => {
      const data = await getFAQs();
      return data;
    },
  });
  return { data, isLoading };
};

export default useFAQ;
