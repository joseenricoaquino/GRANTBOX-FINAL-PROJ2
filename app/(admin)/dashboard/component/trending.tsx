"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTrending from "../(actions)/useTrending";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const TrendingCard = () => {
  const trending = useTrending();
  if (trending.isLoading) return <Skeleton className="flex-1 max-h-[20rem]" />;

  return (
    <Card className="flex-1 bg-main-500 max-h-[20rem]">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-sm text-white">
          Trending Scholarships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="text-sm text-white list-decimal">
          {trending.data.map((d, idx) => {
            return (
              <Link href={`/scholarships-student/${d.id}`} key={d.id}>
                <li className="line-clamp-1 hover:underline transition-all">
                  {idx + 1}. {d.title}
                </li>
              </Link>
            );
          })}
        </ol>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default TrendingCard;
