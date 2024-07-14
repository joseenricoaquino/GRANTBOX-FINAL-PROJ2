import Image from "next/image";
import React from "react";
import ABOUT from "@/public/about.jpg";

const AboutUsPage = () => {
  const CONTENTS = [
    {
      lbl: "GRANTBOX",
      p: `Welcome to Grant Box, your trusted companion in finding scholarships for university students across Metro Manila. At GrantBox, we believe that everyone deserves a chance to pursue their academic dreams without being held back by costs, and we're here to make that happen through technology and dedication.`,
    },
    // {
    //   lbl: "OUR MISSION",
    //   p: `Our mission is to empower university students in Metro Manila by providing a seamless and accessible platform for finding scholarships. We are committed to simplifying the scholarship search process, ensuring that every student has the opportunity to pursue their education without financial barriers.`,
    // },
    // {
    //   lbl: "OUR VISION",
    //   p: `Our vision at Grant Box is to become the leading scholarship finding service in the Philippines, transforming the way students access educational funding. We envision a future where financial constraints are no longer an obstacle to higher education, enabling every student to unlock their full potential.`,
    // },
  ];
  return (
    <main className="w-full min-h-screen bg-white -mt-20 flex-col justify-start pt-12 items-center relative overflow-hidden flex">
      <section className="w-screen h-[calc(100vh-12rem)] flex justify-start items-end pl-8 pb-4 relative px-6">
        <div className="w-full h-full absolute top-0 left-0">
          <Image
            src={ABOUT}
            alt="about.png"
            fill
            className="object-cover object-top"
          />
          <div className="w-full h-full bg-black/30 relative" />
        </div>
        <h1 className="uppercase text-8xl font-semibold relative z-10 text-white drop-shadow-lg">
          About <span className="text-main-500">us</span>
        </h1>
      </section>
      <section className="w-full py-8 px-6">
        <ul className="grid grid-cols-4 gap-y-10">
          {CONTENTS.map((e, idx) => {
            return (
              <React.Fragment key={idx}>
                <span className="font-bold text-4xl">{e.lbl}</span>
                <li className="col-span-3">
                  <p className="text-4xl leading-[3.2rem] font-normal text-slate-600">
                    {e.p}
                  </p>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </section>
      <section className="w-full py-20 flex flex-col justify-center items-center bg-main-100">
        <h1 className="text-8xl font-bold mb-4">
          <span className="text-main-500">OUR</span> MISSION
        </h1>
        <h2 className="text-center text-2xl max-w-[56rem] leading-loose font-light">
          Our mission is to empower university students in Metro Manila by
          providing a seamless and accessible platform for finding scholarships.
          We are committed to simplifying the scholarship search process,
          ensuring that every student has the opportunity to pursue their
          education without financial barriers.
        </h2>
      </section>
      <section className="w-full py-20 flex flex-col justify-center items-center bg-black text-white">
        <h1 className="text-8xl font-bold mb-4">
          <span className="text-main-500">OUR</span> VISION
        </h1>
        <h2 className="text-center text-2xl max-w-[56rem] leading-loose font-light">
          Our vision at Grant Box is to become the leading scholarship finding
          service in the Philippines, transforming the way students access
          educational funding. We envision a future where financial constraints
          are no longer an obstacle to higher education, enabling every student
          to unlock their full potential
        </h2>
      </section>
    </main>
  );
};

export default AboutUsPage;
