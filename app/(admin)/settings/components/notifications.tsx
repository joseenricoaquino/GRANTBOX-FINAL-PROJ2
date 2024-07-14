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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// This can come from your database or API.

const NotificationsClient = ({ currentUser }: { currentUser: User }) => {
  console.log(currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarDeadline, setscholarDeadline] = useState(
    currentUser?.scholarshipDeadlines || false
  );
  const [newScholar, setnewScholar] = useState(
    currentUser?.newScholarship || false
  );
  const router = useRouter();

  function onSubmit() {
    setIsLoading(true);
    console.log(scholarDeadline, newScholar);
    axios
      .post("/api/settings/notifications", {
        newScholarship: newScholar,
        scholarshipDeadlines: scholarDeadline,
        userId: currentUser.id,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Updated Successfully!",
            description: "Successfully Updated User!",
          });
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
    <div className="flex flex-col w-full max-w-screen-sm gap-6 h-full mt-8">
      <div className="items-top flex space-x-2">
        <Checkbox
          checked={newScholar}
          onCheckedChange={(e) => {
            if (e) setnewScholar(true);
            else setnewScholar(false);
          }}
          id="newScholar"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="newScholar"
            className="text-lg font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            New Scholarships
          </label>
          <p className="text-sm text-muted-foreground">
            We&apos;ll send you an email when a new scholarship matches your
            profile. (Up to 7 notifications in a busy week)
          </p>
        </div>
      </div>
      <div className="items-top flex space-x-2">
        <Checkbox
          checked={scholarDeadline}
          onCheckedChange={(e) => {
            if (e) setscholarDeadline(true);
            else setscholarDeadline(false);
          }}
          id="scholarDeadline"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="scholarDeadline"
            className="text-lg font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Scholarship Deadline Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            We&apos;ll send you a reminder when you have deadlines approaching,
            so you don&apos;t miss out. (About 1-2 emails about deadlines in a
            busy week)
          </p>
        </div>
      </div>
      <div className="flex justify-start items-center">
        <Button type="button" onClick={onSubmit} disabled={isLoading}>
          Save Changes
          {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
        </Button>
      </div>
    </div>
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
export default NotificationsClient;
