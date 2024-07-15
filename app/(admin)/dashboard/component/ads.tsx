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
import Image from "next/image";
import ads from "@/public/mcdo ads.jpg";
import Link from "next/link";
const AdvertisementCard = () => {
  return (
    <Link href={"google.com"} target="_blank">
      <div className="w-full h-[16rem] relative">
        <Card className="h-full bg-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-sm relative z-10">
              Advertisement
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Image src={ads} alt="" fill className="object-fit object-center" />
      </div>
    </Link>
  );
};

export default AdvertisementCard;
