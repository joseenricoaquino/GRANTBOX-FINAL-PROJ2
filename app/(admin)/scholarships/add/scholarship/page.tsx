"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import {
  CollegeCourseEnum,
  CoverageTypeEnum,
  FinancialStatusEnum,
  ScholarshipTypeEnum,
} from "@/utils/types";
import useExistingCollege from "./(action)/useGetAttendances";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { CITIES, CITIZENSHIP, CLUBS } from "@/constants";

const formSchema = z.object({
  name: z.string().min(1, { message: "" }),
  details: z.string().min(1, { message: "" }),
  deadline: z.string().min(1, { message: "" }),
  scholarshipType: z.string().min(1, { message: "" }),
  coverageType: z.string().min(1, { message: "" }),
  formLink: z.string().optional(),

  // CRITERIA
  grades: z.string().optional(),
  financialStatus: z.string().optional(),
  prevSchool: z.string().optional(),
  residency: z.string().optional(),
  citizenship: z.string().optional(),
  club: z.string().optional(),
  fos: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  name: "",
  details: "",
  scholarshipType: "",
  coverageType: "",
  formLink: "",

  grades: "",
  financialStatus: "",
  prevSchool: "",
  residency: "",
  citizenship: "",
  club: "",
  fos: "",
};

export default function AddScholarshipPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);

  const existingColleges = useExistingCollege();

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    axios
      .post("/api/scholarships/add/scholarship", {
        ...data,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Created Successfully!",
            description: "Successfully Added a scholarship",
          });
          form.reset();
          window.location.assign("/scholarships");
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
    <div className="w-full mt-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full py-4 flex gap-6"
        >
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle>Create Scholarship</CardTitle>
              <CardDescription>
                Manually add a new scholarship into the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid items-start gap-1 relative">
                <Label className="uppercase text-xs font-normal">
                  Existing College
                </Label>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select one" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {existingColleges.isLoading ||
                          !existingColleges.data ? (
                            <SelectGroup>
                              <SelectLabel>Loading...</SelectLabel>
                            </SelectGroup>
                          ) : (
                            <>
                              {existingColleges.data.map((c) => {
                                return (
                                  <SelectItem key={c.id} value={c.name}>
                                    {c.name}
                                  </SelectItem>
                                );
                              })}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Can&apos;t find the college? Add it first to the
                        database!{" "}
                        <Link
                          href={"/scholarships/add/college"}
                          className="underline"
                        >
                          Click here
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4" />

              <div className="w-full grid grid-cols-2 gap-2">
                <h4 className="text-sm font-medium h-6">
                  Scholarship Information
                </h4>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="scholarshipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ScholarshipTypeEnum.map((c) => {
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="coverageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coverage</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Coverage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CoverageTypeEnum.map((c) => {
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid gap-2">
                            <FormLabel>Deadline</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                type="date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="formLink"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid gap-2">
                            <FormLabel>Form Link</FormLabel>
                            <FormControl>
                              <Input
                                type="link"
                                placeholder="Enter valid link"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6 col-span-2">
                    <FormField
                      control={form.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full grid gap-2">
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What details is in your scholarship?"
                                className="max-h-[20rem]"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={isLoading || !form.formState.isDirty}
                type="submit"
              >
                Add New Scholarship
                {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Criteria</CardTitle>
              <CardDescription>
                Some criterias for students to matched with...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />

              <div className="w-full grid grid-cols-2 gap-2">
                <h4 className="text-sm font-medium h-6">
                  Criteria Information
                </h4>
                <div className="col-span-2 grid gap-4">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="grades"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid gap-2">
                            <FormLabel>Minimum Grade</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                placeholder="Ex. 94"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="financialStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Financial Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Please Select One" />
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="prevSchool"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid gap-2">
                            <FormLabel>Name of Previous School</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                placeholder="De La Salle University"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="residency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CITIES.map((c) => {
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="citizenship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Citizenship</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CITIZENSHIP.map((c) => {
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="club"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extracurricular Activities</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CLUBS.map((c) => {
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
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="fos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select one" />
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
