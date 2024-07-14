import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { getData } from "./(actions)/action";
import { FAQ } from "@prisma/client";

const MainPage = async () => {
  const currentUser = await getCurrentUser();
  let initialData: FAQ[] = [];

  if (!currentUser) redirect("/");
  if (
    (!currentUser.studentBackground || !currentUser.studentCriteria) &&
    currentUser.role === "STUDENT"
  )
    redirect("/dashboard");

  initialData = await getData();

  return (
    <main className="flex-1">
      <div className="container space-y-4">
        <DataTable columns={columns} data={initialData} />
      </div>
    </main>
  );
};

export default MainPage;
