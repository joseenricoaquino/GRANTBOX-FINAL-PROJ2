"use client";

import clsx from "clsx";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DektopItemProps {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}
const DesktopItem = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: DektopItemProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  const activeClassName = clsx(
    "group gap-x-3 rounded-md p-3 text-xs w-full leading-6 font-semibold transition-colors flex justify-start items-center",
    active
      ? "bg-white text-main-500"
      : "text-white hover:bg-main-100 hover:text-main-800"
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="w-full" onClick={handleClick}>
            <Link
              href={href}
              // className={clsx(
              //   `group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors text-main-500 hover:text-main-800 hover:bg-main-100`,
              //   active && "bg-main-100 text-main-800"
              // )}

              className={activeClassName}
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

export default DesktopItem;
