import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-main-500 text-white justify-center items-center flex flex-col py-6">
      <h4 className="text-4xl font-bold">GRANTBOX</h4>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <ul className="flex flex-col gap-4 items-center text-sm font-light">
          <Link href={"about-us"}>
            <li className="">About us</li>
          </Link>
          <Link href={"contact-us"}>
            <li className="">Contact us</li>
          </Link>
          <Link href={"sign-up"}>
            <li className="">Get Started</li>
          </Link>
        </ul>
        <ul className="flex flex-col gap-4 items-center text-sm font-light">
          <li className="">Terms & Conditions</li>
          <li className="">Privacy Policy</li>
          <li className="">Cookie Policy</li>
        </ul>
      </div>
      <span className="font-light text-xs mt-10">
        Copyright 2024 ScholarMe, Inc. All rights reserved
      </span>
    </footer>
  );
};

export default Footer;
