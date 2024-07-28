import React from "react";

import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import ScholarshipsProvider from "./provider";
import { getData } from "./(actions)/action";
import Filter from "./components/filter";
import ScholarshipList from "./components/list";
import { FullScholarshipType, ScholarFilterType } from "@/utils/interfaces";

interface IParams {
  params: any;
  searchParams: ScholarFilterType;
}
const ScholarshipsStudentPage = async (props: IParams) => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "STUDENT") redirect("/dashboard");
  

  const initialData = await getData(props.searchParams);

  return (
    <div className="flex-1">
      <ScholarshipsProvider>
        <div className="container mx-auto grid grid-cols-7 gap-2 w-full h-full relative pb-4">
          <ScholarshipList
            initialData={initialData as FullScholarshipType[]}
            currentUser={currentUser as any}
          />
          <Filter />
        </div>
      </ScholarshipsProvider>
    </div>
  );
};

export default ScholarshipsStudentPage;
