import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getViewScholarship } from "../../(action)/action";
import ViewScholarshipClient from "./client";

interface IParams {
  params: {
    scholarshipId: string;
  };
}
const ViewScholarshipPage = async (props: IParams) => {
  const id = props.params.scholarshipId;
  const scholarship = await getViewScholarship(id);
  if (!scholarship) return null;

  return (
    <main className="container">
      <header className="w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/scholarships">Scholarships</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>View</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{scholarship.college.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <ViewScholarshipClient scholarship={scholarship as any} />
    </main>
  );
};

export default ViewScholarshipPage;
