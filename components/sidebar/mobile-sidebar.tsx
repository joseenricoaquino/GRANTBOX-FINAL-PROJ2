"use client";
import React from "react";
import { User } from "@prisma/client";
import { useSidebarContext } from "@/context/SidebarProvider";
import ToolButton from "@/components/global/ToolButton";
import { LogOutIcon, X } from "lucide-react";
import MobileItem from "./mobile-item";
import { signOut } from "next-auth/react";
import useRoutes from "@/actions/useRoutes";

const MobileSidebar = ({ currentUser }: { currentUser: User }) => {
  const routes = useRoutes();

  const { toggleSidebar, setToggleSidebar } = useSidebarContext();

  const getVisible = (item: any): boolean => {
    return (
      (currentUser.role === "STUDENT" && item.role === "ANY") ||
      (currentUser.role === "ADMINISTRATOR" &&
        (item.role === "ANY" || item.role === "ADMINISTRATOR"))
    );
  };

  if (!toggleSidebar) return null;

  return (
    <div className="lg:hidden fixed w-full h-full bg-white z-10">
      <div className="absolute top-2 left-4">
        <ToolButton icon={X} handleClick={() => setToggleSidebar(false)} />
      </div>
      <nav className="py-20 flex flex-col justify-between items-center h-full">
        <div className="flex flex-col justify-normal items-center gap-8">
          {/* <UserAvatar data={currentUser} /> */}
          <ul className="flex flex-col items-center space-y-1" role="list">
            {routes.map((item) => {
              const isVisible = getVisible(item);
              if (isVisible)
                return (
                  <MobileItem
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={item.active}
                  />
                );
            })}
          </ul>
        </div>
        <ul className="flex flex-col items-center space-y-1" role="list">
          <MobileItem
            href={"#"}
            label={"Logout"}
            icon={LogOutIcon}
            onClick={() => {
              signOut({ redirect: true, callbackUrl: "/" });
            }}
          />
        </ul>
      </nav>
    </div>
  );
};

export default MobileSidebar;
