import React from "react";
import ScholarshipsProvider from "./provider";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { getData } from "./(action)/action";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

const ScholarshipsPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "STUDENT") redirect("/scholarships-student");

  const initialData = await getData();
  return (
    <div className="flex-1">
      <div className="container mx-auto">
        <ScholarshipsProvider>
          <DataTable columns={columns as any[]} data={initialData || []} />
        </ScholarshipsProvider>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
