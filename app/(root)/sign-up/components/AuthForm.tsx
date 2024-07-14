"use client";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, CITIZENSHIP } from "@/constants";

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/
);

// Define form schema using Zod

const AuthRegisterForm = () => {
  const isValid = (confirm: string) => {
    console.log(confirm);
    if (confirm === form.getValues("password")) return true;
    else return false;
  };
  const formSchema = z.object({
    password: z.string().regex(passwordValidation, {
      message:
        "Your password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
    confirmPassword: z.string().refine(isValid, {
      message: "Your password doesn't match",
    }),
    email: z.string().email(),
    dob: z.string().date(),
    name: z.string(),
    address: z.string(),
    nationality: z.string(),
    contact: z.string(),
  });

  const [terms, setTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session?.status, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      email: "",
      address: "",
      nationality: "",
      contact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!terms) {
      toast({
        title: "Oh no!",
        description: "Please accept the terms and conditions to proceed",
      });
      return null;
    }

    setIsLoading(true);

    axios
      .post("/api/register", values)
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Registered Successfully!",
            description: `Welcome ${res.data.email} to GrantBox Family!`,
          });

          // Auto login the user
          const loginResult = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (loginResult?.ok) {
            router.push("/onboarding");
          } else {
            toast({
              title: "Login failed!",
              description: "Please try to log in manually.",
              variant: "destructive",
            });
          }
        }
      })
      .catch(() =>
        toast({
          title: "Something went wrong!",
          description: "Please try again or try a different email",
          variant: "destructive",
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="w-full px-4 flex flex-col my-16">
      <div className="flex flex-col justify-center items-center">
        <h1 className="uppercase font-bold text-6xl text-center">
          <span className="text-main-500">REGISTER</span> NOW!
        </h1>
        <span className="">To get the scholarships waiting just for you!</span>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black rounded-md shadow-md"
                      disabled={isLoading}
                      type="text"
                      placeholder="Enter full name"
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
                  <FormLabel>Create Password</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Confirm Password</FormLabel>
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
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black rounded-md shadow-md"
                      disabled={isLoading}
                      type="date"
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-black">
                      <SelectValue placeholder="Select a City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CITIES.map((c) => {
                      return (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Find the city where you are located.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-black">
                      <SelectValue placeholder="Select a Nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CITIZENSHIP.map((c) => {
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
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+63"
                      className="border border-black rounded-md shadow-md"
                      disabled={isLoading}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id="terms"
              className="border-main-700"
              checked={terms}
              onCheckedChange={(e) => {
                if (e) setTerms(true);
                else setTerms(false);
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm text-main-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept all terms and conditions
            </label>
          </div>
          <Button
            disabled={isLoading}
            className="w-full h-14 text-xl font-bold rounded-lg shadow-md"
            type="submit"
          >
            Join Now!
            {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
          </Button>
        </form>
      </Form>
      <div className="flex gap-2 justify-center items-center text-xs mx-auto">
        {`Already have an acount?`}{" "}
        <Button
          variant={"link"}
          className="text-black text-xs p-0"
          onClick={() => {
            router.push("/sign-in");
          }}
        >
          Log in!{" "}
        </Button>
      </div>
    </div>
  );
};

export default AuthRegisterForm;
