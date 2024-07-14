"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FormTextArea = ({
  control,
  name,
  label,
  isLoading,
  placeholder = "Please Enter...",
}: {
  control: any;
  name: string;
  label: string;
  isLoading: boolean;
  placeholder?: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2 w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea
                className="border border-black rounded-md shadow-md max-h-[14rem]"
                disabled={isLoading}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
