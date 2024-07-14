"use client";
import React, { useEffect, useState } from "react";
import FormInput from "../components/form-input";
import { Form } from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormTextArea from "../components/form-textarea";
import FormSelect from "../components/form-select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FORMS } from "@/constants";
import { CollegeCourseEnum, FinancialStatusEnum } from "@/utils/types";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormCheckbox from "../components/form-checkbox";
import useForms from "../(actions)/useForms";
import { Form as FormType } from "@prisma/client";

interface IProps {
  params: undefined;
  searchParams: {
    tag: string;
  };
}
const FormPage = ({ searchParams: { tag } }: IProps) => {
  const form = parseInt(tag);
  const router = useRouter();
  const forms = useForms();
  let selectedForm = undefined;

  if (forms.isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  switch (form) {
    case 0:
      selectedForm = forms.data?.find(
        (d) => d.title === "Academic Information"
      );
      return (
        <AcademicInformationForm formNum={form} selectedForm={selectedForm} />
      );
    case 1:
      selectedForm = forms.data?.find(
        (d) => d.title === "Academic Based Scholarship Preferences"
      );
      return <AcademicBasedForm formNum={form} selectedForm={selectedForm} />;
    case 2:
      selectedForm = forms.data?.find(
        (d) => d.title === "Need-Based Scholarship Preferences"
      );
      return <NeedBasedForm formNum={form} selectedForm={selectedForm} />;
    case 3:
      selectedForm = forms.data?.find(
        (d) => d.title === "Athletic Scholarship Preferences"
      );
      return <AthleticBasedForm formNum={form} selectedForm={selectedForm} />;
    case 4:
      return <MilitaryBasedForm formNum={form} />;
    case 5:
      selectedForm = forms.data?.find(
        (d) => d.title === "Community Service Scholarship Preferences"
      );
      return <CommunityBasedForm formNum={form} selectedForm={selectedForm} />;
    case 6:
      selectedForm = forms.data?.find(
        (d) =>
          d.title === "PWD (Person with Disability) Scholarship Preferences"
      );
      return <PWDBasedForm formNum={form} selectedForm={selectedForm} />;
    default:
      router.push("/scholarships-compass");
      return null;
  }
};

export default FormPage;

const AcademicInformationForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    percentageGrade: z.string(),
    expectedGrad: z.string(),
    academicAwards: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percentageGrade: selectedForm?.percentageGrade?.toLocaleString() || "",
      expectedGrad: selectedForm?.expectedGrad || "",
      academicAwards: selectedForm?.academicAwards || "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
        percentageGrade: parseInt(values.percentageGrade),
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Academic Information
          </h2>
          <FormInput
            control={form.control}
            name="percentageGrade"
            label="Percentage Grade"
            isLoading={isLoading}
          />
          <FormSelect
            control={form.control}
            name="expectedGrad"
            label="Expected Graduation Year"
            isLoading={isLoading}
            array={["2024-2025", "2025-2026", "2026-2027", "2027-2028"]}
          />
          <FormTextArea
            control={form.control}
            name="academicAwards"
            label="Academic Awards and Honors"
            isLoading={isLoading}
            placeholder="List any academic achievements or recognitions..."
          />
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const AcademicBasedForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    fieldOfStudy: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldOfStudy: selectedForm?.fieldOfStudy || "",
    },
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Academic Based Scholarship Preferences
          </h2>
          <p className="">
            Do you have a specific field of study in mind for your graduate
            studies (e.g., Engineering, Law)?
          </p>
          <FormSelect
            control={form.control}
            name="fieldOfStudy"
            label=""
            isLoading={isLoading}
            array={CollegeCourseEnum}
          />
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const NeedBasedForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    householdIncome: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      householdIncome: selectedForm?.householdIncome || "",
    },
  });
  const router = useRouter();
  const [firstGen, setfirstGen] = useState("yes");
  const [hasDependents, sethasDependents] = useState("yes");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
        hasDependents: hasDependents === "yes" ? true : false,
        firstGen: firstGen === "yes" ? true : false,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Academic Based Scholarship Preferences
          </h2>
          <div className="grid gap-1">
            <p className="">Are you a first-generation college student?</p>
            <RadioGroup
              defaultValue="yes"
              value={firstGen}
              onValueChange={(e) => setfirstGen(e)}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-1">
            <p className="">Do you have any dependents (e.g. children)</p>
            <RadioGroup
              defaultValue="yes"
              value={hasDependents}
              onValueChange={(e) => sethasDependents(e)}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <FormSelect
            control={form.control}
            name="householdIncome"
            label="What is your estimated annual household income?"
            isLoading={isLoading}
            array={FinancialStatusEnum}
          />
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const AthleticBasedForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    sportsInvolved: z.string(),
    highestLevel: z.string(),
    athleticAwards: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sportsInvolved: selectedForm?.sportsInvolved || "",
      highestLevel: selectedForm?.highestLevel || "",
      athleticAwards: selectedForm?.athleticAwards || "",
    },
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Athletic Scholarship Preferences
          </h2>
          <FormTextArea
            control={form.control}
            name="sportsInvolved"
            label="What sport(s) do you participate in at a competitive level?"
            isLoading={isLoading}
            placeholder="List all that apply"
          />
          <FormInput
            control={form.control}
            name="highestLevel"
            label="What is your highest level of competition?"
            isLoading={isLoading}
          />
          <FormTextArea
            control={form.control}
            name="athleticAwards"
            label="Do you have any athletic awards or recognitions?"
            isLoading={isLoading}
            placeholder="List all achievements"
          />
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const MilitaryBasedForm = ({ formNum }: { formNum: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    militaryBranch: z.string(),
    veteranBranch: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      militaryBranch: "",
      veteranBranch: "",
    },
  });
  const router = useRouter();
  const [interestedMilitary, setinterestedMilitary] = useState("yes");
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
        interestedMilitary: interestedMilitary === "yes" ? true : false,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Military Scholarship Preferences
          </h2>
          <FormInput
            control={form.control}
            name="highestLevel"
            label="Are you currently enlisted in the military? If yes, please specify branch, if No then leave it blank"
            isLoading={isLoading}
          />
          <FormInput
            control={form.control}
            name="highestLevel"
            label="Are you a veteran? If yes, please specify branch, if No then leave it blank"
            isLoading={isLoading}
          />
          <div className="grid gap-1">
            <p className="">
              Are you interested in scholarships specifically for dependents of
              military personnel?
            </p>
            <RadioGroup
              defaultValue="yes"
              value={interestedMilitary}
              onValueChange={(e) => setinterestedMilitary(e)}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const CommunityBasedForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    communityActivities: z.string(),
    hoursInCommunity: z.string(),
    organizations: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityActivities: selectedForm?.communityActivities || "",
      hoursInCommunity: selectedForm?.hoursInCommunity?.toString() || "",
      organizations: selectedForm?.organizations || "",
    },
  });
  const router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
        hoursInCommunity: parseInt(values.hoursInCommunity),
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            Community Scholarship Preferences
          </h2>
          <FormInput
            control={form.control}
            name="communityActivities"
            label="Describe your involvement in community service activities (e.g., volunteer work, leadership roles)"
            isLoading={isLoading}
          />
          <FormInput
            control={form.control}
            name="hoursInCommunity"
            label="How many hours have you dedicated to community service in the past year?"
            isLoading={isLoading}
          />
          <FormInput
            control={form.control}
            name="organizations"
            label="Do you have any specific causes or organizations you are passionate about? If yes, please specify, if No then leave it blank"
            isLoading={isLoading}
          />

          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
const PWDBasedForm = ({
  formNum,
  selectedForm,
}: {
  formNum: number;
  selectedForm: FormType | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    disabilities: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disabilities: selectedForm?.disabilities?.split(",") || [],
    },
  });
  const router = useRouter();
  const [interestedPWD, setinterestedPWD] = useState("yes");
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post("/api/compass/form", {
        ...values,
        title: FORMS[formNum].title,
        disabilities: values.disabilities.join(","),
        interestedPWD: interestedPWD === "yes" ? true : false,
      })
      .then(async (res) => {
        if (res.status === 200 && res.data) {
          toast({
            title: "Form Checked!",
          });
          router.push("/scholarships-compass");
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
  const PWD_ITEMS = [
    {
      id: "Visual Impairment",
      label: "Visual Impairment",
    },
    {
      id: "Hearing Impairment",
      label: "Hearing Impairment",
    },
    {
      id: "Mobility Impairment",
      label: "Mobility Impairment",
    },
    {
      id: "Learning Disability",
      label: "Learning Disability",
    },
  ] as any[];
  const flag = isLoading || !form.formState.isDirty;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex flex-col container"
      >
        <div className="w-full max-w-screen-sm mx-auto space-y-4 mt-4">
          <h2 className="font-bold text-2xl text-center">
            PWD (Person with Disability) Scholarship Preferences
          </h2>

          <FormCheckbox
            control={form.control}
            name="disabilities"
            label="Please select the disability category that best describes you:"
            isLoading={isLoading}
            array={PWD_ITEMS}
          />
          <div className="grid gap-1">
            <p className="">
              Are you interested in scholarships that provide support for
              students with disabilities (e.g., assistive technology)?
            </p>
            <RadioGroup
              defaultValue="yes"
              value={interestedPWD}
              onValueChange={(e) => setinterestedPWD(e)}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            type="submit"
            className="h-16 w-full text-xl font-bold"
            disabled={flag}
          >
            Submit{" "}
            {isLoading && <Loader2 className="w-6 h-6 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
