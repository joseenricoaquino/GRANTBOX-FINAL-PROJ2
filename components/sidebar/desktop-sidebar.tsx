"use client";
import React from "react";
import DesktopItem from "./desktop-item";
import { User } from "@prisma/client";
import { UserAvatar } from "@/components/global/UserAvatar";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import useRoutes from "@/actions/useRoutes";

const DesktopSidebar = ({ currentUser }: { currentUser: User }) => {
  const routes = useRoutes();
  const getVisible = (item: any): boolean => {
    if (
      currentUser.role === "STUDENT" &&
      (item.role === "ANY" || item.role === "STUDENT")
    )
      return true;
    if (
      currentUser.role === "ADMINISTRATOR" &&
      (item.role === "ANY" || item.role === "ADMINISTRATOR")
    )
      return true;

    return false;
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-56 lg:overflow-y-auto lg:bg-main-500 lg:pb-4 lg:flex lg:flex-col justify-between lg:shadow-xl border-r">
      <nav className="flex flex-col justify-between items-center h-full">
        <div className="flex flex-col justify-normal items-center gap-8 w-full">
          <div className="bg-white w-full h-60 py-4 flex flex-col justify-center items-center gap-2">
            <div className="font-bold text-2xl">
              <span className="text-main-500">GRANT</span>BOX
            </div>
            <UserAvatar data={currentUser} />
            <p className="font-bold text-base">
              {currentUser.role === "STUDENT" ? currentUser.name : "ADMIN"}
            </p>
          </div>
          <ul
            className="flex flex-col items-start space-y-1 w-full px-2"
            role="list"
          >
            {routes.map((item) => {
              const isVisible = getVisible(item);
              if (isVisible)
                return (
                  <DesktopItem
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
          <DesktopItem
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

export default DesktopSidebar;
