"use client";
import { FullScholarshipType } from "@/utils/interfaces";
import React, { useState } from "react";

import { CldUploadButton } from "next-cloudinary";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI
import { toast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CollegeCourseEnum,
  CoverageTypeEnum,
  FinancialStatusEnum,
  ScholarshipTypeEnum,
} from "@/utils/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CITIES, CITIZENSHIP, CLUBS } from "@/constants";
const EditScholarshipClient = ({
  scholarship,
}: {
  scholarship: FullScholarshipType;
}) => {
  const college = scholarship.college;
  const criteria = scholarship.criteria;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [imageLink, setimageLink] = useState(college?.image || "");
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad month with leading zero if necessary
    const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if necessary
    return `${year}-${month}-${day}`;
  }

  const formSchema = z.object({
    collegeName: z.string().min(1, { message: "" }),
    detailsCollege: z.string().min(1, { message: "" }),
    location: z.string().min(1, { message: "" }),
    webLink: z.string().url().optional(),

    details: z.string().min(1, { message: "" }),
    scholarshipType: z.string().min(1, { message: "" }),
    coverageType: z.string().min(1, { message: "" }),
    deadline: z.string(),
    formLink: z.string().url().optional(),

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
    collegeName: college.name,
    detailsCollege: college.details,
    location: college.location,
    webLink: college?.webLink || "",

    details: scholarship.details,
    scholarshipType: scholarship.scholarshipType,
    coverageType: scholarship.coverageType,
    deadline: formatDate(scholarship?.deadline || new Date()),
    formLink: scholarship.formLink || "",

    grades: `${criteria.grades}` || "",
    financialStatus: criteria.financialStatus || "",
    prevSchool: criteria.prevSchool || "",
    residency: criteria.location || "",
    citizenship: criteria.citizenship || "",
    club: criteria.extracurricularActivities || "",
    fos: criteria.courseInterest || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    axios
      .post("/api/scholarships/edit", {
        ...data,
        image: imageLink,
        collegeId: college.id,
        scholarshipId: scholarship.id,
        criteriaId: criteria.id,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Updated Successfully!",
            description: "Successfully Updated details",
          });
          form.reset();
          window.location.assign(`/scholarships/${scholarship.id}/view`);
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

  const handleUpload = (result: any) => {
    setimageLink(result?.info?.secure_url);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full py-2 grid grid-cols-7 gap-3"
      >
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Scholarship Details</CardTitle>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormControl>
                      <Textarea
                        placeholder="Enter college details..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="scholarshipType"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
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
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverageType"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
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
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter college name..."
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
                name="formLink"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Form Link</FormLabel>
                      <FormControl>
                        <Input
                          type="link"
                          placeholder="Enter college name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Separator className="mt-4" />
              <Label className="uppercase text-base font-normal">
                Criteria
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="grades"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter college name..."
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
                  name="financialStatus"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Financial Type</FormLabel>
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
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prevSchool"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Previous School</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter college name..."
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
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>College Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="relative w-32 h-32 overflow-hidden rounded-full mx-auto border-2 shadow-sm group transition-all">
                <Avatar className="w-full h-full border-2 border-black shadow-sm">
                  <AvatarImage
                    src={imageLink || ""}
                    alt={college?.name || "profile pic"}
                  />
                  <AvatarFallback>
                    {college?.name?.charAt(0) || "T"}
                  </AvatarFallback>
                </Avatar>
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onSuccess={handleUpload}
                  uploadPreset="baoqlgle"
                  className="p-0 w-full h-full absolute top-0 left-0 z-10 bg-main-500/80 hidden group-hover:flex justify-center items-center"
                >
                  <span className="font-bold text-lg text-white">
                    Upload Pic
                  </span>
                </CldUploadButton>
              </div>
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter college name..."
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
                name="detailsCollege"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter college details..."
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter college name..."
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
                name="webLink"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Web Link</FormLabel>
                      <FormControl>
                        <Input
                          type="link"
                          placeholder="Enter college name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <div className="col-span-7 flex justify-start items-center gap-2">
          <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
            Save Changes
            {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
          </Button>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              router.push(`/scholarships/${scholarship.id}/view`);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditScholarshipClient;
