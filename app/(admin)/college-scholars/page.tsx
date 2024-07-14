import React from "react";
import { getData } from "./(action)/action";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import CollegeScholarsProvider from "./provider";

const CollegeScholarsPage = async () => {
  const data = await getData();

  return (
    <div className="flex-1">
      <div className="container mx-auto">
        <CollegeScholarsProvider>
          <DataTable columns={columns} data={data || []} />
        </CollegeScholarsProvider>
      </div>
    </div>
  );
};

export default CollegeScholarsPage;
