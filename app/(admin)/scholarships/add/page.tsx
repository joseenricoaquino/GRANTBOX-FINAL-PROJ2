import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LucideTextQuote, School2 } from "lucide-react";
import Link from "next/link";

const AddPage = () => {
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
              <BreadcrumbPage>Forms</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="w-full h-full flex justify-center items-center p-10">
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          <Link className="w-full h-full" href={"/scholarships/add/college"}>
            <button
              type="button"
              className="w-full h-full group border rounded-md p-4 flex flex-col gap-1 justify-center items-center hover:bg-main-500 transition-colors"
            >
              <h1 className="group-hover:text-white font-bold text-2xl text-main-500 transition-colors">
                Add College
              </h1>
              <School2 className="group-hover:text-white w-16 h-16 text-main-500 transition-colors" />
            </button>
          </Link>
          <Link
            className="w-full h-full"
            href={"/scholarships/add/scholarship"}
          >
            <button
              type="button"
              className="w-full h-full group border rounded-md p-4 flex flex-col gap-1 justify-center items-center hover:bg-main-500 transition-colors"
            >
              <h1 className="group-hover:text-white font-bold text-2xl text-main-500 transition-colors">
                Add Scholarship
              </h1>
              <LucideTextQuote className="group-hover:text-white w-16 h-16 text-main-500 transition-colors" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AddPage;
