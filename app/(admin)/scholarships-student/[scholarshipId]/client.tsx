"use client";
import { FullScholarshipType } from "@/utils/interfaces";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useRecommendation from "../(actions)/useCollegeRecommendations";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import useCurrentUser from "@/actions/useCurrentUser";
import LoadingModal from "@/components/global/LoadingModal";
import useEligibility from "../(actions)/useEligibility";
import clsx from "clsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { updatedScholarshipClicks } from "../(actions)/action";

const ViewScholarshipClient = ({
  scholarship,
}: {
  scholarship: FullScholarshipType;
}) => {
  return (
    <div className="w-full py-2 grid grid-cols-8 gap-6 pt-10">
      <View scholarship={scholarship} />
    </div>
  );
};

export default ViewScholarshipClient;

const View = ({ scholarship }: { scholarship: FullScholarshipType }) => {
  const criteria = scholarship.criteria;
  const college = scholarship.college;

  const recommendations = useRecommendation(college.id, scholarship.id);
  const currentUser = useCurrentUser();

  const {
    eligibility,
    inStudentBG,
    inGPA,
    sameLocation,
    sameNationality,
    sameFoS,
    financeNeeds,
  } = useEligibility(scholarship.criteria, scholarship.scholarshipType as any);

  function eligibleClassName(bool: boolean) {
    return clsx("", bool ? "text-green-500" : "");
  }

  async function addScholarClick() {
    const res = await updatedScholarshipClicks(
      scholarship.id,
      scholarship.number_of_clicks
    );
  }

  if (currentUser.isLoading || !currentUser.data) return <LoadingModal />;

  const EligibilityCriteria = ({
    tag,
    flag,
    label,
  }: {
    tag: string | undefined | null;
    flag: boolean;
    label: string;
  }) => {
    return (
      <div className="flex flex-col justify-center items-center p-1">
        <h3 className="text-sm font-bold text-center h-10 justify-center items-center flex">
          {tag ? <span className={eligibleClassName(flag)}>{tag}</span> : "N/A"}
        </h3>
        <span className="text-center text-xs">{label}</span>
      </div>
    );
  };

  return (
    <>
      <div className="col-span-3">
        <div className="grid gap-4">
          <Avatar className="w-40 h-40 mx-auto shadow-sm">
            <AvatarImage
              src={college?.image || ""}
              alt={college?.name || "profile pic"}
            />
            <AvatarFallback>{college?.name?.charAt(0) || "T"}</AvatarFallback>
          </Avatar>
          <p className="px-3 py-1 text-2xl justify-center text-center items-center font-bold">
            {scholarship.title}
          </p>
          <Link
            href={college?.webLink || ""}
            target="_blank"
            className="flex justify-center items-center"
          >
            <Button
              type="button"
              className="h-14 text-xl text-white font-bold w-80"
              onClick={addScholarClick}
            >
              Apply Now
            </Button>
          </Link>
          <Link
            href={scholarship?.formLink || ""}
            target="_blank"
            className="flex justify-center items-center"
          >
            <Button
              type="button"
              className="h-10 bg-blue-500 text-white font-semibold hover:bg-blue-400 w-80"
            >
              Application Form
            </Button>
          </Link>
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="rounded-full py-2 px-4 bg-white border-2 text-sm font-semibold text-center">
              {scholarship.scholarshipType}
            </div>
            <div className="rounded-full py-2 px-4 bg-white border-2 text-sm font-semibold text-center">
              {scholarship.coverageType}
            </div>
          </div>
          <div className="text-center font-semibold">
            <span className="">Ends at: </span>{" "}
            {scholarship.deadline?.toDateString()}
          </div>
        </div>
      </div>
      <div className="col-span-5 flex flex-col gap-4">
        <div className="w-full p-4 border rounded-md shadow-sm grid grid-cols-6 divide-x gap-1">
          <div className="col-span-1 flex flex-col justify-center items-center">
            <h2 className="font-bold text-3xl text-center text-main-500">
              {eligibility.toPrecision(4)}%
            </h2>
            <span className="text-xs text-center">Eligibility</span>
          </div>
          <div className="col-span-5 grid grid-cols-3 grid-flow-row gap-1">
            <EligibilityCriteria
              tag={criteria?.grades?.toString()}
              flag={inGPA}
              label="Minimum GPA"
            />
            <EligibilityCriteria
              tag={criteria?.financialStatus}
              flag={financeNeeds}
              label="Maximum Financial Need"
            />
            <EligibilityCriteria
              tag={criteria?.location}
              flag={sameLocation}
              label="Residency"
            />
            <EligibilityCriteria
              tag={criteria?.citizenship}
              flag={sameNationality}
              label="Citizenship"
            />
            <EligibilityCriteria
              tag={criteria?.extracurricularActivities}
              flag={false}
              label="Clubs Involved in"
            />
            <EligibilityCriteria
              tag={criteria?.courseInterest}
              flag={sameFoS}
              label="Field of Study"
            />
          </div>
        </div>

        <div className="flex flex-wrap flex-col min-h-40">
          <h2 className="text-lg font-bold">Scholarship Details</h2>
          <p className="">{scholarship.details}</p>
        </div>
        <div className="flex flex-wrap flex-col min-h-40">
          <h2 className="text-lg font-bold">College Details</h2>
          <p className="">{college.details}</p>
        </div>
      </div>
      <div className="flex flex-wrap flex-col min-h-40 overflow-hidden mt-4 col-span-8">
        <h2 className="text-lg font-bold">
          Other scholarship offers of {college.name}
        </h2>
        <ScrollArea className="w-[40rem] whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {recommendations.data !== undefined &&
            !recommendations.isLoading ? (
              <>
                {recommendations.data.length > 0 ? (
                  <>
                    {recommendations.data?.map((scholarship) => {
                      return (
                        <div
                          className="relative p-2 border rounded-md w-80 h-48 flex flex-col justify-between items-start"
                          key={scholarship.id}
                        >
                          <div className="absolute top-2 right-2 bg-main-500/70 text-white p-1.5 rounded-full text-xs">
                            Ends at:{" "}
                            {scholarship.deadline?.toLocaleDateString()}
                          </div>
                          <p className="text-sm font-normal mt-10 text-wrap">
                            {scholarship.title}
                          </p>
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-start items-center gap-1">
                              <div className="line-clamp-1 rounded-full p-1.5 bg-white border-2 text-xs font-semibold text-center">
                                {scholarship.scholarshipType}
                              </div>
                              <div className="rounded-full p-1.5 bg-white border-2 text-xs font-semibold text-center">
                                {scholarship.coverageType}
                              </div>
                            </div>
                            <Link
                              href={`/scholarships-student/${scholarship.id}`}
                              className="w-full"
                            >
                              <Button
                                className="w-full"
                                type="button"
                                size={"sm"}
                              >
                                Visit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p className="tex-xs font-light">
                      University doesn&apos;t offer any other scholarships at
                      the moment!
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <Skeleton className="w-80 h-48 rounded-md" />
              </>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
