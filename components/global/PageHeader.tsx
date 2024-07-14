"use client";
import React from "react";
import { MenuIcon } from "lucide-react";
import ToolButton from "./ToolButton";
import { useSidebarContext } from "@/context/SidebarProvider";
import { User } from "@prisma/client";

const PageHeader = ({
  title,
  currentUser,
}: {
  title: string;
  currentUser: User;
}) => {
  const { toggleSidebar, setToggleSidebar } = useSidebarContext();

  return (
    <div className="w-full flex lg:pl-6 h-16 px-4 justify-between items-center gap-4">
      <div className="flex justify-center items-center gap-2">
        <div className="lg:hidden flex">
          <ToolButton
            icon={MenuIcon}
            handleClick={() => setToggleSidebar(!toggleSidebar)}
          />
        </div>
        <div className="flex flex-col w-full">
          <h3 className="lg:text-3xl text-2xl font-bold text-main-500">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
