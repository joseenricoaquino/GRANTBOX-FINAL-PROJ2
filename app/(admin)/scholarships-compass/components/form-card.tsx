"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
import { resetForm } from "../(actions)/action";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const FormCard = ({
  title,
  tag,
  checked,
}: {
  title: string;
  tag: number;
  checked: boolean;
}) => {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  async function handleReset() {
    setisLoading(true);
    resetForm(title)
      .then((res) => {
        if (res.success) {
          toast({
            title: "Success",
            description: res.success,
          });
          router.refresh();
        } else if (res.error) {
          toast({
            title: "Failed",
            description: res.error,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Failed",
          description: "Some error happened!",
        });
      })
      .finally(() => {
        setisLoading(false);
      });
  }
  const className = clsx(
    "w-full h-56 flex flex-col justify-between transition-colors relative",
    checked ? "bg-muted hover:text-primary" : "hover:bg-primary/20"
  );
  return (
    <Card className={className}>
      <CardContent className="flex justify-center items-center text-center flex-1">
        {checked && (
          <div className="bg-green-400 text-green-900  rounded-full absolute top-2 right-2 px-2 py-1 text-xs font-medium">
            Done
          </div>
        )}
        <p className="font-medium text-lg">{title} Form</p>
      </CardContent>
      <CardFooter className="flex w-full justify-end items-center gap-2">
        <Link href={`/scholarships-compass/form?tag=${tag}`}>
          <Button type="button" size={"sm"}>
            Answer
          </Button>
        </Link>
        {checked && (
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset{" "}
            {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
          </Button>
        )}
      </CardFooter>
    </Card>

    // <Link href={`/scholarships-compass/form?tag=${tag}`}>
    //   <button
    //     type="button"
    //     className="w-full rounded-sm border bg-white shadow-sm h-40 flex flex-col justify-center items-center p-2 hover:bg-main-200 transition-all hover:scale-105 hover:shadow-lg relative"
    //   >
    //     {checked && (
    //       <div className="absolute top-4 right-4 w-8 h-8">
    //         <CheckCircle className="text-green-500" />
    //       </div>
    //     )}
    //     <h3 className="text-center font-bold text-main-500">{title}</h3>
    //   </button>
    // </Link>
  );
};

export default FormCard;
