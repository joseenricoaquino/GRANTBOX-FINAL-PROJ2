"use client";
import React, { useState } from "react";
import StepsCounter from "../components/steps";
import { useRouter } from "next/navigation";
import { useOnboardingContext } from "../provider";
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface IParams {
  params: {
    currPage: string;
  };
}
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CollegeCourseEnum, UniversityPreferenceEnum } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const OnboardingPaging = (props: IParams) => {
  const page = parseInt(props.params.currPage);
  const router = useRouter();
  if (page <= 1) router.push("/onboarding");
  if (page > 3) router.push("/onboarding");

  const {
    setUniversityPreferences,
    setCoursePreferences,

    fetchAll,
  } = useOnboardingContext();

  const formSchema = z.object({
    univ1: z.string().min(1, { message: "Required!" }),
    univ2: z.string().optional(),
    course1: z.string().min(1, { message: "Required!" }),
    course2: z.string().min(1, { message: "Required!" }),
    course3: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      univ1: "",
      univ2: "",
      course1: "",
      course2: "",
      course3: "",
    },
  });

  const [isNewScholarship, setIsNewScholarship] = useState(false);
  const [isScholarshipDeadline, setIsScholarshipDeadline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newUniv = [values.univ1, values.univ2].filter((d) => {
      return d !== "" && d !== undefined;
    });

    const newCour = [values.course1, values.course2, values.course3].filter(
      (d) => {
        return d !== "" && d !== undefined;
      }
    );

    setUniversityPreferences(newUniv as any[]);
    setCoursePreferences(newCour as any[]);
    form.reset();
    router.push("/onboarding/3");
  }

  async function Finish() {
    const vals = fetchAll();

    const booleanValues = Object.values(vals.studentBG);

    setIsLoading(true);

    axios
      .post("/api/onboarding", {
        ...vals,

        studentBG: booleanValues,
        isNewScholarship,
        isScholarshipDeadline,
      })
      .then(async (res) => {
        if (res.status === 200) {
          toast({
            title: "Onboarding Successful!",
            description: `Welcome and explore your new scholarships`,
          });
          router.push("/dashboard");
        }
      })
      .catch(() =>
        toast({
          title: "Something went wrong!",
          description: "Please try again!",
          variant: "destructive",
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  }
  if (page === 2)
    return (
      <div className="w-screen flex flex-col justify-center items-center relative">
        <StepsCounter page={page} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full max-w-sm mx-auto"
          >
            <Label className="text-xl font-bold text-left -mb-4">
              Preferred University
            </Label>
            <FormField
              control={form.control}
              name="univ1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Choice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Please select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UniversityPreferenceEnum.map((c) => {
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
              name="univ2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Choice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Please select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UniversityPreferenceEnum.map((c) => {
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

            <Label className="text-xl font-bold text-left -mb-4">
              Preferred Course
            </Label>
            <FormField
              control={form.control}
              name="course1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Choice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Please select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CollegeCourseEnum.map((c) => {
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
              name="course2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Choice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Please select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CollegeCourseEnum.map((c) => {
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
              name="course3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3rd Choice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Please select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CollegeCourseEnum.map((c) => {
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

            <Button
              className="w-full h-14 text-xl font-bold rounded-lg shadow-md mt-8"
              type="submit"
              onClick={() => {
                console.log("asd");
              }}
            >
              Next Step
            </Button>
          </form>
        </Form>
      </div>
    );

  if (page === 3)
    return (
      <div className="w-screen h-screen -mt-16 flex flex-col justify-center items-center relative">
        <StepsCounter page={page} />
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
          <div className="">
            <Label className="text-xl font-bold text-left -mb-4">
              Subscribe
            </Label>
            <p className="text-sm">
              Check the following to get notifications to the latest news and
              updates
            </p>
          </div>

          <div className="items-top flex space-x-2">
            <Checkbox
              id="terms1"
              checked={isNewScholarship}
              onCheckedChange={(e) => {
                if (e) setIsNewScholarship(true);
                else setIsNewScholarship(false);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                New Scholarships
              </label>
              <p className="text-sm text-muted-foreground">
                We&apos;ll send you an email when a new scholarship matches your
                profile. (Up to 7 notifications in a busy week)
              </p>
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox
              id="terms2"
              checked={isScholarshipDeadline}
              onCheckedChange={(e) => {
                if (e) setIsScholarshipDeadline(true);
                else setIsScholarshipDeadline(false);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms2"
                className="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scholarship Deadline Notifications
              </label>
              <p className="text-sm text-muted-foreground">
                We&apos;ll send you a reminder when you have deadlines
                approaching, so you don&apos;t miss out. (About 1-2 emails about
                deadlines in a busy week)
              </p>
            </div>
          </div>

          <Button
            disabled={isLoading}
            className="w-full h-14 text-xl font-bold rounded-lg shadow-md"
            type="button"
            onClick={Finish}
          >
            Find Me My Scholarships!
            {isLoading && <Loader2 className="animate-spin w-6 h-6 ml-2" />}
          </Button>
        </div>
      </div>
    );
};

export default OnboardingPaging;
