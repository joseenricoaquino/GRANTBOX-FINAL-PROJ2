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

import { BasicHeader } from "@/components/global/TableHeaders";
import { useRouter } from "next/navigation";
import { useHelpDeskContext } from "../provider";
import { FAQ } from "@prisma/client";

const ActionCell = ({ row }: { row: FAQ }) => {
  const { setSelected, setToggleEdit, setToggleDelete } = useHelpDeskContext();
  const router = useRouter();
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
            setSelected(row);
            setToggleEdit(true);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelected(row);
            setToggleDelete(true);
          }}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<FAQ>[] = [
  {
    accessorKey: "question",
    header: () => <BasicHeader title="Question" align="left" />,
    cell: ({ row }) => {
      const data = row.original.question;
      return (
        <div className="text-left font-semibold w-60  flex gap-2 items-center justify-start">
          <span className="">{data}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "response",
    header: () => <BasicHeader title="Response" align="left" />,
    cell: ({ row }) => {
      const data = row.original.response;
      return (
        <div className="text-left font-semibold w-60  flex gap-2 items-center justify-start">
          <span className="">{data}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <BasicHeader title="Date Created" align="left" />,
    cell: ({ row }) => {
      const data = row.original.createdAt;
      return (
        <div className="text-left font-semibold w-60  flex gap-2 items-center justify-start">
          <span className="">{data.toLocaleDateString()}</span>
        </div>
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
