"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormInput = ({
  control,
  name,
  label,
  isLoading,
  type = "text",
  placeholder = "Please Enter...",
  className = "border border-black rounded-md shadow-md max-h-[14rem]",
}: {
  control: any;
  name: string;
  label: string;
  isLoading: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
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
              <Input
                className={className}
                disabled={isLoading}
                type={type}
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

export default FormInput;
