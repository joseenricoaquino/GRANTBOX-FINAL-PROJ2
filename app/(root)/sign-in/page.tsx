import Image from "next/image";
import React from "react";

import LOGO from "@/public/logo.png";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AuthLoginForm from "./components/AuthForm";

const LoginPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser) redirect("/dashboard");
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <AuthLoginForm />
    </div>
  );
};

export default LoginPage;
