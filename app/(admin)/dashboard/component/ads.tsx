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

const AdvertisementCard = () => {
  return (
    <Card className="min-h-[16rem]">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-sm">Advertisement</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AdvertisementCard;
