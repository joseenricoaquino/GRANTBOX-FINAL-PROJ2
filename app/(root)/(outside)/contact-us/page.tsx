import Image from "next/image";
import React from "react";
import MAP from "@/public/contact-map.png";
import ContactForm from "./form";
const ContactUsPage = () => {
  return (
    <main className="flex min-h-screen -mt-20 flex-col justify-center pt-12 px-6 items-center relative overflow-hidden">
      <article className="group w-screen h-screen flex justify-center items-center">
        <div className="absolute top-8 left-0 w-screen h-screen -z-10">
          <Image
            src={MAP}
            alt="map.png"
            fill
            className="object-cover object-center -z-10 opacity-30"
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full max-w-2xl relative z-10">
          <h2 className="text-4xl font-semibold">Get in touch</h2>
          <h4 className="text-center mt-2">
            We&apos;d love to hear from you. Please fill out this form.
          </h4>
          <ContactForm />
        </div>
      </article>
    </main>
  );
};

export default ContactUsPage;
