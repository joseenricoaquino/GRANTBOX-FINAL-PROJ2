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
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { checkUser, fetchEmail } from "./action";
import FormInput from "@/app/(admin)/scholarships-compass/components/form-input";

const formSchema = z.object({
  email: z.string().email(),
  qna: z.string(),
  answer: z.string(),
  newPassword: z.string(),
});

const ForgotPassPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [isRegisteredEmail, setisRegisteredEmail] = useState(false);
  const [hasCorrectInfo, sethasCorrectInfo] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      qna: "",
      answer: "",
      newPassword: "",
    },
  });

  async function getEmail(strEmail: string) {
    const res = await fetchEmail(strEmail);

    if (res && res.qna) {
      form.setValue("qna", res.qna);
      setisRegisteredEmail(true);
    } else {
      toast({
        title: "No Email found!",
        description: "Invalid: Our system has no such email!",
      });
    }
    setIsLoading(false);
  }

  async function checkInfo(strEmail: string, qna: string, answer: string) {
    const res = await checkUser(strEmail, qna, answer);
    if (res) {
      sethasCorrectInfo(true);
    } else {
      toast({
        title: "Wrong Answer",
        description: "You have entered the incorrect answer!",
      });
    }
    setIsLoading(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (!isRegisteredEmail && values.email) {
      getEmail(values.email);
    } else if (!hasCorrectInfo && values.email && values.qna && values.answer) {
      checkInfo(values.email, values.qna, values.answer);
    } else if (
      isRegisteredEmail &&
      hasCorrectInfo &&
      values.email &&
      values.qna &&
      values.answer &&
      values.newPassword
    ) {
      axios
        .post("/api/forgot-password", {
          ...values,
        })
        .then((d: any) => {
          if (d.data) {
            toast({
              title: "Updated Successfully!",
              description: "Please Login to Your Account!",
            });
            form.reset();
            router.push("/sign-in");
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
  }

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full px-4 flex flex-col -mt-20">
        <div className="flex flex-col justify-center items-center">
          <h1 className="uppercase font-bold text-6xl text-center relative">
            <span className="text-main-500">GRANT</span>BOX
          </h1>
          <span className="">
            Having trouble? Enter your email and we&apos;ll help you!
          </span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-sm mx-auto mt-16"
          >
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              isLoading={isLoading || isRegisteredEmail}
            />
            {isRegisteredEmail && (
              <>
                <FormInput
                  control={form.control}
                  name="qna"
                  label="Question"
                  isLoading={true}
                />
                <FormInput
                  control={form.control}
                  name="answer"
                  label="Answer"
                  isLoading={isLoading || hasCorrectInfo}
                />
              </>
            )}

            {hasCorrectInfo && (
              <>
                <FormInput
                  control={form.control}
                  name="newPassword"
                  label="New Password"
                  isLoading={isLoading}
                />
              </>
            )}
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

export default ForgotPassPage;
