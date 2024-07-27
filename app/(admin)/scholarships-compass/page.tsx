"use client";
import React from "react";
import FormCard from "./components/form-card";
import { FORMS } from "@/constants";
import useForms from "./(actions)/useForms";
import { Skeleton } from "@/components/ui/skeleton";

const MainPage = () => {
  const forms = useForms();
  return (
    <main className="flex-1">
      <div className="container space-y-4">
        <div className="mt-4 w-full grid grid-cols-4 grid-flow-row gap-2">
          {forms.isLoading ? (
            <>
              {FORMS.map((_, index) => {
                return (
                  <Skeleton key={index} className="w-full h-56"></Skeleton>
                );
              })}
            </>
          ) : (
            <>
              {FORMS.map((form, index) => {
                if (form.title !== "Military Scholarship Preferences")
                  return (
                    <FormCard
                      title={form.title}
                      key={index}
                      tag={index}
                      checked={
                        forms.data?.map((d) => d.title).includes(form.title) ??
                        false
                      }
                    />
                  );
              })}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainPage;
