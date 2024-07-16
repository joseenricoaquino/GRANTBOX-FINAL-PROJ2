"use client";
import { Button } from "@/components/ui/button";
import { FullScholarshipType } from "@/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useEligibility from "../(actions)/useEligibility";

const ScholarshipCard = ({
  scholarship,
}: {
  scholarship: FullScholarshipType;
}) => {
  const { eligibility } = useEligibility(
    scholarship.criteria,
    scholarship.scholarshipType as any
  );
  return (
    <div
      className="w-full h-[30rem] border rounded-md shadow-sm p-2 flex flex-col justify-between items-center"
      key={scholarship.id}
    >
      <div className="flex flex-col justify-start items-center">
        <div className="mb-4 w-32 aspect-square relative overflow-hidden rounded-full border-2 shadow-sm">
          <Image src={scholarship.college?.image || ""} alt="Univ Pic" fill />
        </div>
        <h2 className="font-bold text-base text-center h-28 overflow-hidden">
          {scholarship.title}
        </h2>
        <h4 className="text-sm text-center">{scholarship.college.name}</h4>
        <p className="font-light text-xs text-center">
          Ends at {scholarship.deadline?.toDateString()}
        </p>
        <div className="flex justify-center items-center flex-wrap mt-4 gap-2">
          <div className="px-2 py-1 rounded-full border bg-white text-xs text-center">
            {scholarship.coverageType}
          </div>
          <div className="px-2 py-1 rounded-full border bg-white text-xs text-center">
            {scholarship.scholarshipType}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-4">
          <h2 className="font-bold text-3xl text-main-500">
            {eligibility.toPrecision(4)}%
          </h2>
          <span className="text-xs">Eligibility</span>
        </div>
      </div>
      <div className="w-full">
        <Link href={`/scholarships-student/${scholarship.id}`}>
          <Button className="w-full" size={"sm"} type="button">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ScholarshipCard;
