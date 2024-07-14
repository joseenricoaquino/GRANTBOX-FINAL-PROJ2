"use client";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const LINKS = [
    {
      label: "Home",
      href: "/",
      active: "",
    },
    // {
    //   label: "Scholarships",
    //   href: "/scholarships",
    //   active: "",
    // },
    {
      label: "About us",
      href: "/about-us",
      active: "",
    },
    {
      label: "Contact us",
      href: "/contact-us",
      active: "",
    },
  ];
  const router = useRouter();
  return (
    <header>
      <nav className="w-full sticky z-10 top-0 h-20 bg-main-500 flex justify-between items-center px-6 shadow-md">
        <div className="flex gap-8 items-center justify-start">
          <div className="">
            <h3 className="font-bold text-2xl text-white">
              GRANT<span className="text-black">BOX</span>
            </h3>
          </div>
          <ul className="flex space-x-4">
            {LINKS.map((link, idx) => {
              const active = false;
              const activeClassName = clsx(
                "text-sm font-medium transition-all",
                active
                  ? ""
                  : "text-white hover:underline hover:underline-offset-2"
              );
              return (
                <Link href={link.href} key={`${link.label}-${idx}`}>
                  <li className={activeClassName}>{link.label}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => {
              router.push("/sign-in");
            }}
            className="bg-main-500 text-white border-2 border-white rounded-xl hover:text-main-500 transition-all hover:scale-105"
          >
            Log In
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => {
              router.push("/sign-up");
            }}
            className="text-main-400 hover:bg-main-500 hover:text-white border-white border-2 rounded-xl transition-all hover:scale-105"
          >
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
