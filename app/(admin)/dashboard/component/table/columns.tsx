"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Circle, MoreHorizontal } from "lucide-react";

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
import { BasicHeader } from "@/components/global/TableHeaders";
import { FullScholarshipType } from "@/utils/interfaces";
// import { useScholarshipsContext } from "../provider";
import { IsDatePassedToday } from "@/utils/helpers/date";
import { useRouter } from "next/navigation";

type wtEligibilityType = {
  scholarship: FullScholarshipType;
  eligibilityScore: number;
};

const ActionCell = ({ row }: { row: wtEligibilityType }) => {
  // const { setSelected, setToggleEdit, setToggleDelete, setToggleView } =
  //   useScholarshipsContext();
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
            router.push(`/scholarships-student/${row.scholarship.id}`);
          }}
        >
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<wtEligibilityType>[] = [
  {
    accessorKey: "name",
    filterFn: (row, _, filterVal) => {
      const data = row.original.scholarship;
      const collegeName = data.college.name;

      return collegeName.toLowerCase().includes(filterVal.toLowerCase());
    },
    header: () => <BasicHeader title="Name of University" align="left" />,
    cell: ({ row }) => {
      const data = row.original.scholarship.college;
      return (
        <div className="text-left font-semibold w-60  flex gap-2 items-center justify-start">
          <Avatar className="w-8 h-8 border-2 border-black shadow-sm">
            <AvatarImage
              src={data?.image || ""}
              alt={data?.name || "profile pic"}
            />
            <AvatarFallback>{data?.name?.charAt(0) || "T"}</AvatarFallback>
          </Avatar>
          <span className="">{data.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    filterFn: (row, _, filterVal) => {
      const data = row.original.scholarship;
      const title = data.title;

      return title.toLowerCase().includes(filterVal.toLowerCase());
    },
    header: () => <BasicHeader title="Title" align="left" />,
    cell: ({ row }) => {
      const data = row.original.scholarship.title;
      return (
        <div className="text-left w-60  flex gap-2 items-center justify-start">
          <span className="">{data}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "eligibility",
    header: () => <BasicHeader title="Eligiblity" />,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <span className="flex justify-center items-center text-center">
          {(data.eligibilityScore * 100).toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "scholarshipType",
    header: () => <BasicHeader title="Scholarship Type" />,
    cell: ({ row }) => {
      const data = row.original.scholarship;
      return (
        <span className="flex justify-center items-center text-center">
          {data.scholarshipType}
        </span>
      );
    },
  },
  {
    accessorKey: "coverageType",
    header: () => <BasicHeader title="Coverage Type" />,
    cell: ({ row }) => {
      const data = row.original.scholarship;
      return (
        <span className="flex justify-center items-center text-center">
          {data.coverageType}
        </span>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: () => <BasicHeader title="Deadline" />,
    cell: ({ row }) => {
      const data = row.original.scholarship;
      return (
        <span className="flex justify-center items-center text-center">
          {data.deadline?.toLocaleDateString()}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    header: () => <BasicHeader title="Status" />,
    cell: ({ row }) => {
      const data = row.original.scholarship;
      const isPassed = IsDatePassedToday(
        data.deadline ? data.deadline : new Date()
      );

      return (
        <span className="flex justify-center items-center text-center gap-1">
          {isPassed ? (
            <>
              <Circle className="w-4 h-4 bg-slate-300 text-slate-300 overflow-hidden rounded-full border-transparent" />
              <span className="">Inactive</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 bg-green-300 text-green-300 overflow-hidden rounded-full border-transparent" />
              <span className="">Active</span>
            </>
          )}
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
