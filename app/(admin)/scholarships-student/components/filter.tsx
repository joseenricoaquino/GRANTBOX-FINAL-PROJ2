"use client";
import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, X } from "lucide-react";
import { DateRange } from "react-day-picker";

// UI
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Half1CoverageTypeEnum,
  Half1ScholarshipTypeEnum,
  Half2CoverageTypeEnum,
  Half2ScholarshipTypeEnum,
} from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 20),
  });

  const [isOpenCoverage, setIsOpenCoverage] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);

  const [name, setName] = useState(searchParams.get("name") || "");
  const [checkedCoverages, setCheckedCoverages] = useState<string[]>(
    searchParams.get("coverage")?.split(",") || []
  );
  const [checkedCategories, setCheckedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",") || []
  );

  const handleCoverageChange = (coverage: string) => {
    if (checkedCoverages.includes(coverage)) {
      setCheckedCoverages(checkedCoverages.filter((c) => c !== coverage));
    } else {
      setCheckedCoverages([...checkedCoverages, coverage]);
    }
  };
  const handleCategoryChange = (category: string) => {
    if (checkedCategories.includes(category)) {
      setCheckedCategories(checkedCategories.filter((c) => c !== category));
    } else {
      setCheckedCategories([...checkedCategories, category]);
    }
  };

  function handleFilter() {
    const coverageFilters = checkedCoverages.join(",");
    const categoryFilters = checkedCategories.join(",");

    let queryParams = "";

    if (date && date.from && date.to) {
      queryParams = new URLSearchParams({
        name: name || "",
        coverage: coverageFilters || "",
        category: categoryFilters || "",
        from: date.from.toLocaleDateString(),
        to: date.to.toLocaleDateString(),
      }).toString();
    } else {
      queryParams = new URLSearchParams({
        name: name || "",
        coverage: coverageFilters || "",
        category: categoryFilters || "",
      }).toString();
    }

    window.location.assign(`${pathname}?${queryParams}`);
  }

  return (
    <div className="w-[22rem] h-[calc(100vh-4rem)] fixed z-[10] right-6 flex justify-center items-center pb-6">
      <div className="w-full h-full bg-white rounded-md shadow-lg py-4 px-6 border flex flex-col overflow-y-auto relative">
        <div className="flex gap-2 items-center justify-between">
          <div className="text-xl font-bold">Filters</div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleFilter}
              type="button"
              variant={"default"}
              size={"sm"}
              className="flex gap-2 justify-center items-center"
            >
              <h3 className="">Submit</h3>
              <FilterIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                window.location.assign(`${pathname}`);
              }}
              type="button"
              variant={"outline"}
              size={"sm"}
              className="flex gap-2 justify-center items-center"
            >
              <h3 className="">Clear</h3>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search a college..."
            className="border-2 rounded-full border-black"
          />
        </div>

        <Separator className="my-4" />

        {/* DEADLINE RANGE */}
        {/* <div className="flex justify-center items-center w-full flex-col gap-1">
          <Label className="w-full text-left">Deadline Range</Label>
          <div className={cn("grid gap-2 w-full")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div> */}

        {/* Coverage */}
        <div className="mt-0 w-full">
          <Collapsible
            open={isOpenCoverage}
            onOpenChange={setIsOpenCoverage}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4">
              <h4 className="text-sm font-semibold">Coverage</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            {Half1CoverageTypeEnum.map((c) => {
              return (
                <div
                  key={c}
                  className="text-sm flex justify-start items-center gap-2"
                >
                  <Checkbox
                    id={c}
                    checked={checkedCoverages.includes(c)}
                    onCheckedChange={(e) => {
                      handleCoverageChange(c);
                    }}
                  />{" "}
                  <label
                    htmlFor={c}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {c}
                  </label>
                </div>
              );
            })}
            <CollapsibleContent className="space-y-2">
              {Half2CoverageTypeEnum.map((c) => {
                return (
                  <div
                    key={c}
                    className="text-sm flex justify-start items-center gap-2"
                  >
                    <Checkbox
                      id={c}
                      checked={checkedCoverages.includes(c)}
                      onCheckedChange={(e) => {
                        handleCoverageChange(c);
                      }}
                    />{" "}
                    <label
                      htmlFor={c}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {c}
                    </label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* TYPE/CATEGORIES */}
        <div className="mt-6 w-full">
          <Collapsible
            open={isOpenType}
            onOpenChange={setIsOpenType}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4">
              <h4 className="text-sm font-semibold">Categories</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            {Half1ScholarshipTypeEnum.map((c) => {
              return (
                <div
                  key={c}
                  className="text-sm flex justify-start items-center gap-2"
                >
                  <Checkbox
                    id={c}
                    checked={checkedCategories.includes(c)}
                    onCheckedChange={(e) => {
                      handleCategoryChange(c);
                    }}
                  />{" "}
                  <label
                    htmlFor={c}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {c}
                  </label>
                </div>
              );
            })}
            <CollapsibleContent className="space-y-2">
              {Half2ScholarshipTypeEnum.map((c) => {
                return (
                  <div
                    key={c}
                    className="text-sm flex justify-start items-center gap-2"
                  >
                    <Checkbox
                      id={c}
                      checked={checkedCategories.includes(c)}
                      onCheckedChange={(e) => {
                        handleCategoryChange(c);
                      }}
                    />{" "}
                    <label
                      htmlFor={c}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {c}
                    </label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default Filter;
