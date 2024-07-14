"use client";
import React from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

const StepsCounter = ({ page }: { page: number }) => {
  const STEPS = [
    "Filling up student information and student background",
    "Filling up your preferences on which universities to focus on!",
    "Finishing up and some reminders!",
  ];
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2">
      <div className="w-full grid grid-rows-3 max-w-screen-md gap-4">
        {STEPS.map((step, index) => {
          const activeStepClassName = clsx(
            "h-20 -mt-2 transition-color",
            page === index + 1 ? "text-main-500" : ""
          );
          const activeCheckClassName = clsx(
            "w-10 h-10",
            page > index + 1 ? "text-main-500" : "text-slate-300"
          );
          return (
            <div
            //   href={`/onboarding/${index + 1}`}
              key={index}
              className="flex flex-col justify-between items-start"
            >
              <Check className={activeCheckClassName} />
              <div className="h-4" />
              <div className={activeStepClassName}>
                <div className="text-left font-bold text-xl">
                  Step {index + 1}
                </div>
                <p className="text-[12px] w-40 text-left">{step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepsCounter;
