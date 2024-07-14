"use client";
import React, { useState } from "react";

// FORMS
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
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";
import { formatDateForInput } from "@/utils/helpers/date";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import ProfilePhotoSection from "./profilephoto";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, CITIZENSHIP } from "@/constants";

// This can come from your database or API.

const AccountClient = ({ currentUser }: { currentUser: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    fullName: z.string().min(1, { message: "" }),
    email: z.string().email(),
    contact: z.string().min(1, { message: "" }),
    dob: z.string().date(),
    address: z.string().min(1, { message: "" }),
    nationality: z.string().min(1, { message: "" }),
    oldPass: z.string().optional(),
    newPass: z.string().optional(),
    confirmPass: z.string().optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const defaultValues: Partial<FormValues> = {
    fullName: currentUser.name || "",
    email: currentUser.email || "",
    contact: currentUser.contact || "",
    dob: formatDateForInput(currentUser.dob),
    address: currentUser.address || "",
    nationality: currentUser.nationality || "",
    oldPass: "",
    newPass: "",
    confirmPass: "",
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  function onSubmit(data: FormValues) {
    setIsLoading(true);
    axios
      .post("/api/settings/account", {
        ...data,
        userId: currentUser.id,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Updated Successfully!",
            description: "Successfully Updated User!",
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-6 w-full max-w-screen-lg gap-4 h-full"
      >
        <div className="col-span-2 border rounded-md shadow-sm h-full p-4">
          <ProfilePhotoSection
            userId={currentUser.id}
            profile={currentUser?.image || ""}
          />
        </div>
        <div className="col-span-4 border rounded-md shadow-sm h-full p-4 flex flex-col">
          <div onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormInput
              name="fullName"
              inputType="text"
              inputLabel="Full Name"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormInput
              name="email"
              inputType="email"
              inputLabel="Email Address"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormInput
              name="contact"
              inputType="text"
              inputLabel="Contact Information"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormInput
              name="dob"
              inputType="date"
              inputLabel="Date of Birth"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
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
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Nationality" />
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

            <Separator className="my-2" />

            <FormInput
              name="oldPass"
              inputType="password"
              inputLabel="Old Password"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormInput
              name="newPass"
              inputType="password"
              inputLabel="New Password"
              control={form.control}
              placeholder="Enter here..."
            />
            <FormInput
              name="confirmPass"
              inputType="password"
              inputLabel="Confirm Password"
              control={form.control}
              placeholder="Enter here..."
            />
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

const FormInput = ({
  name,
  inputType,
  inputLabel,
  control,
  placeholder,
}: {
  name: any;
  inputType: string;
  inputLabel: string;
  control: any;
  placeholder: string;
}) => {
  return (
    <div className="grid gap-6">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{inputLabel}</FormLabel>
            <FormControl>
              <Input type={inputType} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
export default AccountClient;
