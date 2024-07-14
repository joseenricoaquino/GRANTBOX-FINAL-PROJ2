"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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
  CoverageTypeEnum,
  ScholarshipTypeEnum,
  UniversityPreferenceEnum,
} from "@/utils/types";
import { CITIES } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import ProfilePhotoSection from "../../components/profilephoto";
import Link from "next/link";

const formSchema = z.object({
  collegeName: z.string().min(1, { message: "" }),
  location: z.string().min(1, { message: "" }),
  details: z.string().min(1, { message: "" }),
  webLink: z.string().url().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  collegeName: "",
  location: "",
  details: "",
  webLink: "",
};

export default function AddCollegePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageLink, setimageLink] = useState("");

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    axios
      .post("/api/scholarships/add/college", {
        ...data,
        imageLink,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Created Successfully!",
            description: "Successfully Added a new college",
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

  const handleUpload = (result: any) => {
    setimageLink(result?.info?.secure_url);
  };

  return (
    <div className="w-full max-w-2xl mt-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Create College</CardTitle>
              <CardDescription>
                Manually add a new college and scholarship for a customer
                <div className="text-xs font-light">
                  Already existing college? You can now add a scholarship for it{" "}
                  <Link
                    href={"/scholarships/add/scholarship"}
                    className="underline"
                  >
                    Click here
                  </Link>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid items-start gap-1 relative">
                <Label className="uppercase text-xs font-normal">College</Label>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-2">
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
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="You can select one from here" />
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
                </div>
              </div>
              <Separator className="my-4" />

              <div className="w-full grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium h-6"></h4>
                  <ProfilePhotoSection
                    handleUpload={handleUpload}
                    profile={imageLink}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium h-6">
                    College Background
                  </h4>

                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a City" />
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
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What details is in your college?"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="webLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Link</FormLabel>
                          <FormControl>
                            <Input
                              type="link"
                              placeholder="Enter valid link"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end items-center">
                <Button
                  disabled={isLoading || !form.formState.isDirty}
                  type="submit"
                >
                  Add New College
                  {isLoading && (
                    <Loader2 className="animate-spin w-6 h-6 ml-2" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
