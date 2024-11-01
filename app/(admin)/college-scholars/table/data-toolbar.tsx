"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Plus, Search, XIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [levelFilter, setLevelFilter] = useState("");
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4 w-full">
      <div className="flex flex-1 items-center space-x-2">
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setLevelFilter("");
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <div className="flex gap-2">
        <Link href={"/transactions/add"}>
          <Button type="button">
            Add Transaction <Plus className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
