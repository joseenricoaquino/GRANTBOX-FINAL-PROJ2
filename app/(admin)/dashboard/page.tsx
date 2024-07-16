import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import React from "react";
import StudentMainTemplate from "./component/template/student-main";
import AdminMainTemplate from "./component/template/admin-main";

const MainPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/");
  if(!currentUser.qna || !currentUser.answer)
    redirect("/security")
  if (
    (!currentUser.studentBackground || !currentUser.studentCriteria) &&
    currentUser.role === "STUDENT"
  )
    redirect("/onboarding");

  return (
    <main className="flex-1">
      <div className="container space-y-4">
        {currentUser.role === "STUDENT" ? (
          <StudentMainTemplate currentUser={currentUser as any} />
        ) : (
          <AdminMainTemplate />
        )}
      </div>
    </main>
  );
};

export default MainPage;
