"use client";
import React from "react";
import {
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

const FormSelect = ({
  control,
  name,
  label,
  isLoading,
  placeholder = "Please select one...",
  className = "border border-black",
  array,
}: {
  control: any;
  name: string;
  label: string;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  array: any[];
}) => {
  return (
    <FormField
      disabled={isLoading}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {array.map((c) => {
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
  );
};

export default FormSelect;
