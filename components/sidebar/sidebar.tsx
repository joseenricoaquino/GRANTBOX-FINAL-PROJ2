import React from "react";
import DesktopSidebar from "./desktop-sidebar";
import MobileSidebar from "./mobile-sidebar";
import { User } from "@prisma/client";

const Sidebar = async ({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) => {
  if (!currentUser) return null;

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileSidebar currentUser={currentUser!} />
      <main className="lg:pl-56 h-full">{children}</main>
    </div>
  );
};

export default Sidebar;
