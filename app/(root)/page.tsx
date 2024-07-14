import Image from "next/image";
import React from "react";
import HERO from "@/public/hero.jpg";
import HERO_SVG from "@/public/hero-svg.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex min-h-screen -mt-20 flex-col justify-center pt-12 px-6 items-center relative overflow-hidden">
      <article className="group w-screen h-screen flex justify-center items-center">
        <div className="absolute top-8 left-0 w-screen h-screen -z-10">
          <Image
            src={HERO}
            alt="hero.png"
            fill
            className="object-cover -z-10"
          />
          <div className="w-full h-full bg-black/40 group-hover:backdrop-blur-sm transition-all ease-in-out duration-500" />
        </div>

        <div className="container text-center text-white drop-shadow-xl">
          <h1 className="text-6xl font-bold max-w-3xl text-center mx-auto">
            FIND <span className="text-main-500">SCHOLARSHIPS</span> THAT{" "}
            <span className="text-main-500">MATCH</span> WITH YOU
          </h1>
          <h3 className="max-w-3xl my-4 text-center mx-auto">
            Get financial aid to cater for you studies. We&apos;ll provide you a
            platform to collect and scholarships and recommend the best one for
            you!
          </h3>
          <Link href={"/sign-up"}>
            <Button size={"lg"} type="button">
              Find your Scholarship Now!
            </Button>
          </Link>
        </div>
      </article>
      <section className="w-screen container bg-transparent flex flex-col justify-center items-center py-32 px-8 relative">
        <h2 className="text-5xl text-center drop-shadow-lg">
          <span className="text-main-500 font-semibold">OPPORTUNITIES</span> ARE WAITING
        </h2>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="flex flex-col justify-start items-center">
            <div className="font-bold text-6xl text-main-500">200+</div>
            <p className="text-xs text-center w-40">
              Number of college schools waiting
            </p>
          </div>
          <div className="flex flex-col justify-start items-center">
            <div className="font-bold text-6xl text-main-500">3k+</div>
            <p className="text-xs text-center w-40">
              Number of scholarships being offered
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <Image src={HERO_SVG} alt="svg" fill className=" object-center object-contain"/>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
