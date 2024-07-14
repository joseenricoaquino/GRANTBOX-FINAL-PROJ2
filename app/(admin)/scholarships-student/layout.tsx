import getCurrentUser from "@/actions/getCurrentUser";
import PageHeader from "@/components/global/PageHeader";
import Sidebar from "@/components/sidebar/sidebar";
import { Metadata } from "next";
import ScholarshipsProvider from "./provider";

export const metadata: Metadata = {
  title: "GrantBox | Scholarship Finder | Scholarships",
  description: "Scholarship Page for GrantBox",
};

export default async function ScholarshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return (
    <Sidebar currentUser={currentUser as any}>
      <div className="w-full flex flex-col">
        <PageHeader title={"Scholarships"} currentUser={currentUser as any} />
        <div className="w-full min-h-[calc(100vh-64px)] flex">
          <div className="flex-1 flex justify-center items-start">
            <main className="w-full flex-1 h-full flex">
              <ScholarshipsProvider>{children}</ScholarshipsProvider>
            </main>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
