"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2, Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import FormTextArea from "../../scholarships-compass/components/form-textarea";

const formSchema = z.object({
  question: z.string().min(1, { message: "" }),
  response: z.string().min(1, { message: "" }),
});

type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  question: "",
  response: "",
};

export function AddFAQModel() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    axios
      .post("/api/faq", {
        ...data,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Created Successfully!",
            description: "Successfully Added a new college",
          });
          form.reset();
          window.location.assign("/help-desk");
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => {}}>
          Add FAQ <Plus className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Frequently Asked Questions</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormTextArea
              control={form.control}
              name="question"
              label="Question"
              isLoading={isLoading}
            />
            <FormTextArea
              control={form.control}
              name="response"
              label="Response"
              isLoading={isLoading}
            />
            <Button
              disabled={isLoading || !form.formState.isDirty}
              type="submit"
            >
              Submit
              {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
