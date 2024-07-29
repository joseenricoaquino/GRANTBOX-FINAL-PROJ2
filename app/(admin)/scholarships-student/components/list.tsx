"use client";
import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScholarshipCard from "./card";
import useScholarshipRecommended from "../../dashboard/(actions)/useScholarshipRecommended";
import useAllScholarships from "../(actions)/useAllScholarships";
import { Skeleton } from "@/components/ui/skeleton";

const ScholarshipList = ({ currentUser }: { currentUser: FullStudentType }) => {
  const recommended = useScholarshipRecommended(currentUser);
  const all = useAllScholarships(currentUser);
  return (
    <div className="col-span-5 flex flex-col">
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList>
          <TabsTrigger value="recommended">
            Recommended
            {!recommended.isLoading && (
              <span className="font-light ml-1 text-sm">
                ({recommended.data?.length ?? 0} results)
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">
            All Scholarships{" "}
            {!all.isLoading && (
              <span className="font-light ml-1 text-sm">
                ({all.data?.length ?? 0} results)
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recommended">
          <div className="w-full h-full grid grid-cols-4 gap-2 pr-8">
            {recommended.isLoading ? (
              <>
                {Array(8)
                  .fill([])
                  .map((_, idx) => {
                    return (
                      <Skeleton
                        className="w-full h-[33rem] border"
                        key={idx}
                      ></Skeleton>
                    );
                  })}
              </>
            ) : (
              <>
                {recommended?.data?.map((d) => {
                  return (
                    <ScholarshipCard
                      key={d.id}
                      scholarship={d.scholarship}
                      score={d.eligibilityScore}
                    />
                  );
                })}
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="w-full h-full grid grid-cols-4 gap-2 pr-8">
            {all.isLoading ? (
              <>
                {Array(8)
                  .fill([])
                  .map((_, idx) => {
                    return (
                      <Skeleton
                        className="w-full h-[33rem] border"
                        key={idx}
                      ></Skeleton>
                    );
                  })}
              </>
            ) : (
              <>
                {all?.data?.map((d) => {
                  return (
                    <ScholarshipCard
                      key={d.id}
                      scholarship={d.scholarship}
                      score={d.eligibilityScore}
                    />
                  );
                })}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScholarshipList;
