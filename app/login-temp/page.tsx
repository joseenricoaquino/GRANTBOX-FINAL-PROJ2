"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import React, { FormEvent, useState } from "react";

const LoginTempPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signIn("credentials", { email: email, password: password, redirect: false })
      .then((d) => {
        window.location.assign("/dashboard");
      })
      .catch((e) => console.log(e))
      .finally();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center w-full h-screen container"
    >
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="email"
        className=""
        placeholder="enter email"
      />
      <Input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        className=""
        placeholder="enter password"
      />
      <Button type="submit">login</Button>
    </form>
  );
};

export default LoginTempPage;
