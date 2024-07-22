"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AdvertisementCard from "../ads";
import TrendingCard from "../trending";
import useScholarshipRecommended from "../../(actions)/useScholarshipRecommended";
import { FullScholarshipType, FullStudentType } from "@/utils/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import emailjs from "@emailjs/browser";
import { useCallback, useEffect } from "react";
import { IsScholarNearing } from "@/utils/helpers/date";
import TestNotif from "./test-notif";

export default function StudentMainTemplate({
  currentUser,
}: {
  currentUser: FullStudentType;
}) {
  // return <TestNotif />;

  const recommended = useScholarshipRecommended(currentUser);

  // Define sendEmail inside useCallback
  const sendEmail = useCallback(
    (key: string, scholarships: FullScholarshipType[]) => {
      const service_id = "service_sa36w8r";
      const template_id = "template_t1xhfkk";
      const user_id = "r50xqQOwMhBw6Htv7";
      const template_params = {
        to_email: `${currentUser.email}`,
        to_name: `${currentUser.name}`,
        scholarships: `${scholarships
          .map((sch) => {
            return `(${sch.college.name}) ${sch.title}: ${sch?.deadline ? sch.deadline.toDateString() : "No Deadline"}`;
          })
          .join("\n")}`,
      };

      emailjs
        .send(service_id, template_id, template_params, user_id)
        .then((res) => {
          console.log("Email Sent!");
          window.localStorage.setItem(key, "Notification Sent!");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [currentUser]
  ); // Add dependencies here
  console.log(recommended);
  useEffect(() => {
    if (recommended && recommended.data) {
      let toNotif = recommended.data
        .map((d) => {
          const scholarDl = d.scholarship.deadline as Date | undefined;
          if (scholarDl) {
            if (IsScholarNearing(scholarDl)) {
              return d.scholarship;
            }
          }
        })
        .filter((d) => d !== undefined);

      toNotif.push({
        scholarship: {
          id: "6695942a08edeaa99ccf1376",
          collegeId: "66958769489a396df6c0c417",
          title: "HONOR'S LIST",
          details:
            "Any college student of the Colegio, with meritorious performance in a given semester, qualifies for inclusion in the Honor's List (Dean's List) and discounts on tuition fee for the immediately succeeding semester.",
          scholarshipType: "N/A",
          coverageType: "Partial Tuition",
          deadline: new Date("2024-07-15T21:27:06.000Z"),
          formLink: "",
          number_of_clicks: 2,
          college: {
            id: "66958769489a396df6c0c417",
            image: null,
            location: "N/A",
            details: "N/A",
            name: "Colegio de San Juan de Letran",
            webLink: null,
          },
          criteria: {
            id: "6695942a08edeaa99ccf1377",
            scholarshipId: "6695942a08edeaa99ccf1376",
            grades: 90,
            financialStatus: "Not Specified",
            prevSchool: null,
            location: null,
            citizenship: null,
            extracurricularActivities: null,
            courseInterest: null,
          },
        },
        eligibilityScore: 1,
      });
      console.log(toNotif);
      console.log(toNotif.length);

      // if (toNotif.length > 0) {
      //   // has something to notify
      //   let key = `deadlineNotif1:${new Date().toLocaleDateString()}`;
      //   const item = window.localStorage.getItem(key);

      //   if (!item) {
      //     // Now sendEmail is wrapped in useCallback
      //     sendEmail(key, toNotif);
      //   } else console.log("Already sent email");
      // }
    }
  }, [recommended, sendEmail]);

  return (
    <main className="grid flex-1 items-start gap-4 grid-cols-4 min-h-[calc(100vh-4.5rem)]">
      <div className="grid auto-rows-max items-start gap-4 col-span-3">
        <div className="grid gap-4 grid-cols-4">
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>New Recommendations</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Answer different forms to increase your eligibility on other
                scholarships.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={"/scholarships-compass"}>
                <Button type="button">Start Answering</Button>
              </Link>
              {/* <Button
                type="button"
                onClick={async () => {
                  const service_id = "service_4pkan6x";
                  const template_id = "template_8nheg1w";
                  const user_id = "ceIp0fgC0JxwJEHUj";
                  const template_params = {
                    to_email: `${currentUser.email}`,
                    to_name: `${currentUser.name}`,
                    scholarships: `${recommended.data
                      ?.map((d) => {
                        let sch = d.scholarship as FullScholarshipType;
                        return `${sch.title}: ${sch?.deadline ? sch.deadline.toDateString() : "No Deadline"}`;
                      })
                      .join("\n")}`,
                  };
                  const data = {
                    service_id,
                    template_id,
                    user_id,
                    template_params,
                  };

                  console.log(data);
                  emailjs
                    .send(service_id, template_id, template_params, user_id)
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  console.log("done");
                }}
              >
                Notify
              </Button> */}
            </CardFooter>
          </Card>

          {recommended.isLoading ? (
            <Skeleton className="col-span-1" />
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-8xl text-center font-semibold text-main-500">
                    {recommended.data?.length}
                  </CardTitle>
                  <CardDescription className="text-center">
                    Total Recommendations
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
        <ScrollArea className="w-full">
          <DataTable columns={columns} data={recommended.data || []} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-4 h-full">
        <AdvertisementCard />
        <TrendingCard />
      </div>
    </main>
  );
}
