"use client";
import { Button } from "@/components/ui/button";
import { IsScholarNearing } from "@/utils/helpers/date";
import React, { useEffect, useState } from "react";

import emailjs from "@emailjs/browser";

const TestNotif = () => {
  const [toEmail, setToEmail] = useState<any[]>([]);

  useEffect(() => {
    if (toEmail.length > 0) {
      console.log(toEmail);

      //checking kung kailangan ba mag notif na within 3 days
      let toNotif = toEmail
        .map((sc) => {
          console.log(sc);
          if (IsScholarNearing(sc.scholarship.deadline)) {
            return sc;
          }
        })
        .filter((d) => d !== undefined);

      console.log(toNotif);

      if (toNotif.length > 0) {
        // has something to notify
        let key = `deadlineNotif1:${new Date().toLocaleDateString()}`;
        const item = window.localStorage.getItem(key);

        if (!item) {
          // Now sendEmail is wrapped in useCallback
          sendEmail(key, toNotif);
        } else console.log("Already sent email");
      }
    }
  }, [toEmail]);

  function sendEmail(key: string, toNotifyScholarships: any[]) {
    const service_id = "service_sa36w8r";
    const template_id = "template_t1xhfkk";
    const user_id = "r50xqQOwMhBw6Htv7";

    console.log(toNotifyScholarships);

    const template_params = {
      to_email: `kielo.mercado04@gmail.com`,
      to_name: `yococs`,
      scholarships: `${toNotifyScholarships
        .map((sch) => {
          console.log(sch);
          return `(${sch.scholarship.college.name}) ${sch.scholarship.title}: ${sch.scholarship?.deadline ? sch.scholarship.deadline.toDateString() : "No Deadline"}`;
        })
        .join("\n")}`,
    };

    console.log(template_params);

    emailjs
      .send(service_id, template_id, template_params, user_id)
      .then((res) => {
        // for avoiding duplicates
        console.log("email sent");
        window.localStorage.setItem(key, "Notification Sent!");
      })
      .catch((e) => console.log(e))
      .finally();

    //       emailjs
    //         .send(service_id, template_id, template_params, user_id)
    //         .then((res) => {
    //           console.log("Email Sent!");
    //           window.localStorage.setItem(key, "Notification Sent!");
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
  }

  //   const sendEmail = useCallback(
  //     (key: string, scholarships: FullScholarshipType[]) => {
  //       const service_id = "service_sa36w8r";
  //       const template_id = "template_t1xhfkk";
  //       const user_id = "r50xqQOwMhBw6Htv7";
  //       const template_params = {
  //         to_email: `${currentUser.email}`,
  //         to_name: `${currentUser.name}`,
  //         scholarships: `${scholarships
  //           .map((sch) => {
  //             return `(${sch.college.name}) ${sch.title}: ${sch?.deadline ? sch.deadline.toDateString() : "No Deadline"}`;
  //           })
  //           .join("\n")}`,
  //       };

  //       emailjs
  //         .send(service_id, template_id, template_params, user_id)
  //         .then((res) => {
  //           console.log("Email Sent!");
  //           window.localStorage.setItem(key, "Notification Sent!");
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     },
  //     [currentUser]
  //   );

  function clickSendEmail() {
    setToEmail([
      {
        scholarship: {
          id: "6695942a08edeaa99ccf1376",
          collegeId: "66958769489a396df6c0c417",
          title: "HONOR'S LIST",
          details:
            "Any college student of the Colegio, with meritorious performance in a given semester, qualifies for inclusion in the Honor's List (Dean's List) and discounts on tuition fee for the immediately succeeding semester.",
          scholarshipType: "N/A",
          coverageType: "Partial Tuition",
          deadline: new Date("2024-07-19T21:27:06.000Z"),
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
      },
    ]);
  }

  return (
    <div>
      TestNotif
      <Button type="button" onClick={clickSendEmail}>
        Send Email
      </Button>
    </div>
  );
};

export default TestNotif;
