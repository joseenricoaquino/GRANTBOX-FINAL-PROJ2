"use client";
import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScholarshipCard from "./card";
import useScholarshipRecommended from "../../dashboard/(actions)/useScholarshipRecommended";

const ScholarshipList = ({
  initialData,
  currentUser,
}: {
  initialData: FullScholarshipType[];
  currentUser: FullStudentType;
}) => {
  const recommended = useScholarshipRecommended(currentUser);

  return (
    <div className="col-span-5 flex flex-col">
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="all">All Scholarships</TabsTrigger>
        </TabsList>
        <TabsContent value="recommended">
          <div className="w-full h-full grid grid-cols-4 gap-2 pr-8">
            {recommended?.data?.map((d) => {
              return <ScholarshipCard key={d.id} scholarship={d.scholarship} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="w-full h-full grid grid-cols-4 gap-2 pr-8">
            {initialData.map((d) => {
              return <ScholarshipCard key={d.id} scholarship={d} />;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScholarshipList;