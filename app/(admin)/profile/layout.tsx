import getCurrentUser from "@/actions/getCurrentUser";
import PageHeader from "@/components/global/PageHeader";
import Sidebar from "@/components/sidebar/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrantBox | Scholarship Finder | Student Profile",
  description: "Scholarship Page for GrantBox",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return (
    <Sidebar currentUser={currentUser as any}>
      <div className="w-full flex flex-col">
        <PageHeader title={"Student Profile"} currentUser={currentUser as any} />
        <div className="w-full min-h-[calc(100vh-64px)] flex">
          <div className="flex-1 flex justify-center items-start">
            <main className="w-full flex-1 h-full flex">{children}</main>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
