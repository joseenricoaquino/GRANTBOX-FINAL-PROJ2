"use client";

import clsx from "clsx";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebarContext } from "@/context/SidebarProvider";

interface MobileItemProps {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}
const MobileItem = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: MobileItemProps) => {
  const handleClick = () => {
    setToggleSidebar(false);
    if (onClick) {
      return onClick();
    }
  };

  const { setToggleSidebar } = useSidebarContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="" onClick={handleClick}>
            <Link
              href={href}
              className={clsx(
                `group flex gap-x-3 rounded-md p-3 text-lg leading-6 font-semibold text-gray-400 hover:text-main-800 hover:bg-main-100 transition`,
                active && "bg-main-100 text-main-800"
              )}
            >
              <Icon classname="h-6 w-6 shrink-0" />
              <span className="">{label}</span>
            </Link>
          </li>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MobileItem;
