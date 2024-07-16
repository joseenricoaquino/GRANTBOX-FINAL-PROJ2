"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { BasicHeader } from "@/components/global/TableHeaders";
import { useCollegeScholarsContext } from "../provider";

const ActionCell = ({ row }: { row: User }) => {
  const { setSelected, setToggleEdit, setToggleDelete } =
    useCollegeScholarsContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            console.log(row);
            setSelected(row);
            setToggleDelete(true);
          }}
        >
          Remove Account
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={() => {
            setSelected(row);
            setToggleEdit(true);
          }}
        >
          Edit Account
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <BasicHeader title="Name" align="left" />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="text-left font-semibold w-48  flex gap-2 items-center justify-start">
          <Avatar className="w-8 h-8 border-2 border-black shadow-sm">
            <AvatarImage
              src={data?.image || ""}
              alt={data.name || "profile pic"}
            />
            <AvatarFallback>{data.name?.charAt(0) || "T"}</AvatarFallback>
          </Avatar>
          <span className="">{data.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <BasicHeader title="Email" />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span className="flex justify-center items-center text-center">
          {data.email}
        </span>
      );
    },
  },
  {
    accessorKey: "contact",
    header: () => <BasicHeader title="Contact" />,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span className="flex justify-center items-center text-center">
          {data.contact}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell row={row.original} />;
    },
  },
];
