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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const AuthLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session?.status, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // NextAuth SignIn
    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast({
            title: "Something went wrong!",
            description: "Invalid credentials!",
            variant: "destructive",
          });
        }
        if (callback?.ok && !callback?.error) {
          toast({
            title: "Success!",
            description: "Welcome to GrantBox!",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="w-full px-4 flex flex-col -mt-20">
      <div className="flex flex-col justify-center items-center">
        <h1 className="uppercase font-bold text-6xl text-center relative">
          {isAdmin && (
            <div className="absolute top-0 font-bold text-xl left-full">
              Admin
            </div>
          )}
          <span className="text-main-500">LOG</span> IN!
        </h1>
        <span className="">Let&apos;s get started!</span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-sm mx-auto mt-16"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black rounded-md shadow-md"
                      disabled={isLoading}
                      type="email"
                      placeholder="Enter email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black rounded-md shadow-md"
                      disabled={isLoading}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            className="w-full h-14 text-xl font-bold rounded-lg shadow-md"
            type="submit"
          >
            Log In
            {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
          </Button>
        </form>
      </Form>
      <div className="flex gap-2 justify-center items-center text-xs mx-auto">
        {`Don't have an account yet?`}{" "}
        <Button
          variant={"link"}
          className="text-black text-xs p-0"
          onClick={() => {
            router.push("/sign-up");
          }}
        >
          Create an account!{" "}
        </Button>
      </div>
      {/* <div className="flex gap-2 justify-center items-center text-xs mx-auto">
        {isAdmin ? "Are you logging in as a student?" : "Are you an admin?"}
        <Button
          variant={"link"}
          className="text-black text-xs p-0"
          onClick={() => {
            setIsAdmin((prev) => !prev);
          }}
        >
          Click here!{" "}
        </Button>
      </div> */}
    </div>
  );
};

export default AuthLoginForm;
