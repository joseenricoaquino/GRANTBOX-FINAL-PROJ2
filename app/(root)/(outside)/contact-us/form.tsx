"use client";
import React from "react";

import { Form } from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/app/(admin)/scholarships-compass/components/form-input";
import FormTextArea from "@/app/(admin)/scholarships-compass/components/form-textarea";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  const formSchema = z.object({
    fullName: z
      .string()
      .min(1, { message: "Must be filled up" }),
    contact: z
      .string()
      .min(11, { message: "Enter valid contact number (11) digits" })
      .max(11, { message: "Enter valid contact number (11) digits" }),
    email: z.string().email().min(1),
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      contact: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container mt-8 gap-6"
      >
        <FormInput
          control={form.control}
          name="fullName"
          label="Full Name"
          isLoading={false}
        />
        <FormInput
          control={form.control}
          name="email"
          label="Email Address"
          isLoading={false}
          type="email"
        />
        <FormInput
          control={form.control}
          name="contact"
          label="Contact"
          isLoading={false}
        />
        <FormTextArea
          control={form.control}
          name=""
          label="Message"
          isLoading={false}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ContactForm;
