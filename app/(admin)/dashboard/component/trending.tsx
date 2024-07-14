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

const TrendingCard = () => {
  return (
    <Card className="flex-1 bg-main-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-sm text-white">
          Trending Scholarships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className=""></ul>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default TrendingCard;
