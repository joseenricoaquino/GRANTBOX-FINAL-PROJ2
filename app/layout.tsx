import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "@/context/AuthContextProvider";
import { QueryProvider } from "@/context/QueryProvider";
import SidebarProvider from "@/context/SidebarProvider";

import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GrantBox | Scholarship Finder",
  description: "GrantBox | Scholarship Finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen h-full bg-white`}>
        <AuthContextProvider>
          <QueryProvider>
            <SidebarProvider>
              {children}
              <Toaster />
            </SidebarProvider>
          </QueryProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
