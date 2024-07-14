"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthContextProvider;
