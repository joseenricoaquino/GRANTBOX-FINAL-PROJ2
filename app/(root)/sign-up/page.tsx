import Image from "next/image";
import React from "react";

import LOGO from "@/public/logo.png";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AuthRegisterForm from "./components/AuthForm";

const RegisterPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser) redirect("/dashboard");
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <AuthRegisterForm />
    </div>
  );
};

export default RegisterPage;
