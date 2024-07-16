"use client";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// UI
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import FormInput from "../(admin)/scholarships-compass/components/form-input";
import FormSelect from "../(admin)/scholarships-compass/components/form-select";

const formSchema = z.object({
  qna: z.string(),
  answer: z.string(),
});

const SecurityPage = () => {
  const QUESTIONS = [
    "What is the name of your favorite dog?",
    "What is your nickname?",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qna: "",
      answer: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    axios
      .post("/api/security", {
        ...values,
      })
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Updated Successfully!",
            description: "Successfully Updated Profile!",
          });
          form.reset();
          router.push("/onboarding");
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
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full px-4 flex flex-col -mt-20">
        <div className="flex flex-col justify-center items-center">
          <h1 className="uppercase font-bold text-6xl text-center relative">
            <span className="text-main-500">GRANT</span>BOX
          </h1>
          <span className="">
            Set up your security incase you forget your password
          </span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-sm mx-auto mt-16"
          >
            <FormSelect
              control={form.control}
              name="qna"
              label="Question"
              isLoading={isLoading}
              array={QUESTIONS}
            />
            <FormInput
              control={form.control}
              name="answer"
              label="Answer"
              isLoading={isLoading}
            />
            <Button
              disabled={isLoading}
              className="w-full h-14 text-xl font-bold rounded-lg shadow-md"
              type="submit"
            >
              Submit
              {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SecurityPage;
