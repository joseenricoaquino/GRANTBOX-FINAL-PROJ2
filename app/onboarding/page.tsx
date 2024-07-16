"use client";
import React, { useState } from "react";
import StepsCounter from "./components/steps";
import { STUDENT_BG, useOnboardingContext } from "./provider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EducationalLevelEnum, FinancialStatusEnum } from "@/utils/types";
import { Separator } from "@/components/ui/separator";
import { redirect, useRouter } from "next/navigation";
import useCurrentUser from "@/actions/useCurrentUser";
import { Loader2 } from "lucide-react";

const OnboardingMain = () => {
  const {
    page,
    educationalLevel,
    percentageGrade,
    nameOfPrevSchool,
    typeOfPrevSchool,
    financialStatus,

    setEducationalLevel,
    setPercentageGrade,
    setNameOfPrevSchool,
    setTypeOfPrevSchool,
    setFinancialStatus,

    studentBG: finalStudentBG,
    setStudentBG: finalSetStudentBG,
  } = useOnboardingContext();
  const DEFAULT_STUDENT_BG: STUDENT_BG = finalStudentBG;
  const router = useRouter();

  const STBG = [
    { id: "isPWD", label: "Considered a PWD?" },
    { id: "isVarsityScholarship", label: "Applying for varsity scholarship?" },
    { id: "isArtistScholarship", label: "Applying for artist scholarship?" },
    { id: "isExtracurricular", label: "Engages in extracurricular activities" },
    { id: "isLeader", label: "Has leadership experience" },
    { id: "isMinority", label: "Belongs in a minority group" },
    { id: "isStudentWorker", label: "Student worker" },
    { id: "isInnnovative", label: "Involved in any innovative projects" },
  ];

  const [studentBG, setStudentBG] = useState<STUDENT_BG>(DEFAULT_STUDENT_BG);
  const formSchema = z.object({
    educationalLevel: z.string().min(1, { message: "" }),
    gpa: z.string().min(1, { message: "" }),
    nameOfPrevSchool: z.string().min(1, { message: "Required!" }),
    typeOfPrevSchool: z.string().min(1, { message: "Please select one!" }),
    financialStatus: z.string().min(1, { message: "Please select one!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationalLevel,
      gpa: percentageGrade?.toString(),
      nameOfPrevSchool,
      typeOfPrevSchool,
      financialStatus,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setEducationalLevel(values.educationalLevel as any);
    setPercentageGrade(parseInt(values.gpa));
    setNameOfPrevSchool(values.nameOfPrevSchool);
    setTypeOfPrevSchool(values.typeOfPrevSchool as any);
    setFinancialStatus(values.financialStatus as any);

    finalSetStudentBG(studentBG);
    form.reset();
    router.push("/onboarding/2");
  }

  const handleCheckboxChange = (id: keyof STUDENT_BG) => {
    setStudentBG((prevStudentBG) => ({
      ...prevStudentBG,
      [id]: !prevStudentBG[id], // Toggle the value of the checkbox
    }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center relative pb-8">
      <div className="w-full flex flex-col justify-center items-center">
        <h4 className="font-bold text-6xl">
          <span className="text-main-500">ON</span>BOARDING
        </h4>
        <p className="w-[20rem] text-center text-sm mt-1">
          Fill up the necessary information so we can get the best scholarships
          for you!{" "}
        </p>
      </div>
      <StepsCounter page={page} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-sm mx-auto mt-16"
        >
          <Label className="text-xl font-bold text-left -mb-4">
            Previous School Information
          </Label>
          <FormField
            control={form.control}
            name="educationalLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educational Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-black">
                      <SelectValue placeholder="Please select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EducationalLevelEnum.map((c) => {
                      return (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Percentage Grade</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black rounded-md shadow-md"
                      type="text"
                      placeholder="Enter your percentage grade 60-99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex grid-cols-2 gap-4 items-center">
            <FormField
              control={form.control}
              name="nameOfPrevSchool"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel>Name of Previous School</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-black rounded-md shadow-md"
                        type="text"
                        placeholder="Enter school name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeOfPrevSchool"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-black">
                            <SelectValue placeholder="Please select one" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["PUBLIC", "PRIVATE", "HOMESCHOOL"].map((c) => {
                            return (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="financialStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Status (Annual Income)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-black">
                      <SelectValue placeholder="Please select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FinancialStatusEnum.map((c) => {
                      return (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="w-full bg-black my-2" />
          <div className="">
            <Label className="text-xl font-bold text-left -mb-4">
              Student Background
            </Label>
            <p className="text-xs">Check the following which applies to you:</p>
          </div>
          {STBG.map((d) => {
            const key = d.id as keyof typeof DEFAULT_STUDENT_BG;
            return (
              <div key={d.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={studentBG[key]}
                  onCheckedChange={(e) => {
                    handleCheckboxChange(key);
                  }}
                  id={d.id}
                  className="border-black"
                />
                <label
                  htmlFor={d.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {d.label}
                </label>
              </div>
            );
          })}
          <Button
            className="w-full h-14 text-xl font-bold rounded-lg shadow-md mt-10"
            type="submit"
            onClick={() => {}}
          >
            Next Step
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingMain;
