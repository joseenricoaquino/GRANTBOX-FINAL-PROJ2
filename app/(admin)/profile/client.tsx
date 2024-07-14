"use client";
import { FullStudentType } from "@/utils/interfaces";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CollegeCourseEnum, UniversityPreferenceEnum } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast, useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { EducationalLevelEnum, FinancialStatusEnum } from "@/utils/types";
import { STUDENT_BG } from "@/app/onboarding/provider";
import { useRouter } from "next/navigation";

const ProfileClient = ({ profile }: { profile: FullStudentType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    educationalLevel: z.string().min(1, { message: "" }),
    gpa: z.string().min(1, { message: "" }),
    nameOfPrevSchool: z.string().min(1, { message: "Required!" }),
    typeOfPrevSchool: z.string().min(1, { message: "Please select one!" }),
    financialStatus: z.string().min(1, { message: "Please select one!" }),

    univ1: z.string().min(1, { message: "Required!" }),
    univ2: z.string().optional(),
    course1: z.string().min(1, { message: "Required!" }),
    course2: z.string().min(1, { message: "Required!" }),
    course3: z.string().optional(),

    isPWD: z.boolean().optional(),
    isVarsityScholarship: z.boolean().optional(),
    isArtistScholarship: z.boolean().optional(),
    isExtracurricular: z.boolean().optional(),
    isLeader: z.boolean().optional(),
    isMinority: z.boolean().optional(),
    isStudentWorker: z.boolean().optional(),
    isInnnovative: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationalLevel: profile.studentCriteria.educationalLevel || "",
      gpa: `${profile.studentCriteria.gpa}` || "",
      nameOfPrevSchool: profile.studentCriteria.nameOfPrevSchool || "",
      typeOfPrevSchool: profile.studentCriteria.typeOfPrevSchool || "",
      financialStatus: profile.studentCriteria.financialStatus || "",

      univ1:
        profile.studentCriteria.universityPreference.length > 0
          ? profile.studentCriteria.universityPreference[0]
          : "",
      univ2:
        profile.studentCriteria.universityPreference.length >= 1
          ? profile.studentCriteria.universityPreference[1]
          : "",
      course1:
        profile.studentCriteria.coursePreference.length > 0
          ? profile.studentCriteria.coursePreference[0]
          : "",
      course2:
        profile.studentCriteria.coursePreference.length >= 1
          ? profile.studentCriteria.coursePreference[1]
          : "",
      course3:
        profile.studentCriteria.coursePreference.length >= 2
          ? profile.studentCriteria.coursePreference[2]
          : "",

      isPWD: profile.studentBackground.isPWD,
      isVarsityScholarship: profile.studentBackground.isVarsityScholarship,
      isArtistScholarship: profile.studentBackground.isArtistScholarship,
      isExtracurricular: profile.studentBackground.isExtracurricular,
      isLeader: profile.studentBackground.isLeader,
      isMinority: profile.studentBackground.isMinority,
      isStudentWorker: profile.studentBackground.isStudentWorker,
      isInnnovative: profile.studentBackground.isInnnovative,
    },
  });

  // STUDENT BACKGROUND
  const DEFAULT_STUDENT_BG: STUDENT_BG = {
    isPWD: false,
    isArtistScholarship: false,
    isExtracurricular: false,
    isInnnovative: false,
    isLeader: false,
    isMinority: false,
    isStudentWorker: false,
    isVarsityScholarship: false,
  };
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
  // FORM SUBMIT
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/profile", {
        ...values,
        userId: profile.id,
        backgroundId: profile.studentBackground.id,
        criteriaId: profile.studentCriteria.id,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Updated Successfully!",
            description: "Successfully Updated Profile!",
          });
          form.reset();
          router.refresh();
        }
      })
      .catch((error) => {
        console.log(error.request.response);
        toast({
          title: "Unexpected error!",
          variant: "destructive",
          description: `${error.request.response}!`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="w-full h-full relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <div className="fixed top-4 right-4 flex gap-2 items-center justify-center">
            {form.formState.isDirty && (
              <Button
                size={"lg"}
                type="button"
                variant="outline"
                onClick={() => router.refresh()}
              >
                Cancel
              </Button>
            )}
            <Button
              size={"lg"}
              type="submit"
              disabled={!form.formState.isDirty || isLoading}
            >
              Save Changes
              {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
            </Button>
          </div>

          {/* PREVIOUS SCHOOL INFO */}
          <>
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
            <div className="flex w-full gap-4 items-center">
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
          </>

          {/* PREFERRED UNIVERSITIES */}
          <>
            <Separator className="my-1" />
            <Label className="text-xl font-bold text-left -mb-4">
              Preferred University
            </Label>
            <FormField
              control={form.control}
              name="univ1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Choice</FormLabel>
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
                      {UniversityPreferenceEnum.map((c) => {
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
              name="univ2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Choice</FormLabel>
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
                      {UniversityPreferenceEnum.map((c) => {
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
          </>

          {/* PREFERRED COURSES */}
          <>
            <Separator className="my-1" />
            <Label className="text-xl font-bold text-left -mb-4">
              Preferred Course
            </Label>
            <FormField
              control={form.control}
              name="course1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Choice</FormLabel>
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
                      {CollegeCourseEnum.map((c) => {
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
              name="course2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Choice</FormLabel>
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
                      {CollegeCourseEnum.map((c) => {
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
              name="course3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3rd Choice</FormLabel>
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
                      {CollegeCourseEnum.map((c) => {
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
          </>

          {/* STUDENT BACKGROUND */}
          <>
            <Separator className="my-1" />
            <div className="">
              <Label className="text-xl font-bold text-left -mb-4">
                Student Background
              </Label>
              <p className="text-xs">
                Check the following which applies to you:
              </p>
            </div>

            {STBG.map((d) => {
              const key = d.id as keyof typeof DEFAULT_STUDENT_BG;
              return (
                <SingleStudentBackground
                  key={key}
                  control={form.control}
                  name={key}
                  label={d.label}
                />
              );
            })}
          </>
        </form>
      </Form>
    </div>
  );
};

const SingleStudentBackground = ({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="block space-x-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="border-black"
            />
          </FormControl>
          <FormLabel className="font-semibold text-left leading-none">
            {label}
          </FormLabel>
        </FormItem>
      )}
    />
  );
};

export default ProfileClient;
