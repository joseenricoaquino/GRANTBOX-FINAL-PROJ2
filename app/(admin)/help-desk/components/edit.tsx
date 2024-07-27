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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHelpDeskContext } from "../provider";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "../../scholarships-compass/components/form-input";
import FormTextArea from "../../scholarships-compass/components/form-textarea";
import { Loader2 } from "lucide-react";

export function EditModal() {
  const { toggleEdit, setToggleEdit, selected, setSelected } =
    useHelpDeskContext();

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    question: z.string(),
    response: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: selected?.question || "",
      response: selected?.response || "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/help-desk/edit", {
        ...values,
        id: selected.id,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Updated Successfully!",
          });
          setToggleEdit(false);
          setSelected(undefined);
          router.push("/help-desk");
        }
      })
      .catch(() =>
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  }
  const flag = isLoading || !form.formState.isDirty;

  return (
    <Dialog open={toggleEdit} onOpenChange={setToggleEdit}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit FAQ</DialogTitle>
          <DialogDescription>
            Make changes to the frequently asked questions. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 flex flex-col container"
            >
              <div className="w-full max-w-screen-sm mx-auto space-y-4">
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
                <Button type="submit" className="w-full" disabled={flag}>
                  Save Changes{" "}
                  {isLoading && (
                    <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
