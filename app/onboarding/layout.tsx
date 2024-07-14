import type { Metadata } from "next";
import OnboardingProvider from "./provider";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding | GrantBox",
  description: "Onboarding page for GrantBox Scholarship Finder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  if (
    currentUser?.role === "STUDENT" &&
    currentUser.studentBackground &&
    currentUser.studentCriteria
  )
    redirect("/dashboard");

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <header className="w-full flex justify-start items-center p-4 px-6 sticky top-0 left-0">
        <div className="">
          <h3 className="font-bold text-2xl text-main-500">
            GRANT<span className="text-black">BOX</span>
          </h3>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <OnboardingProvider>{children}</OnboardingProvider>
      </main>
    </div>
  );
}
