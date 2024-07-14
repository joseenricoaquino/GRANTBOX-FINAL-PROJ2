import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import clsx from "clsx";

export const SortHeader = ({
  column,
  title,
}: {
  column: any;
  title: string;
}) => {
  return (
    <div className="flex justify-center items-center">
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export const BasicHeader = ({
  title,
  align = "center",
}: {
  title: string;
  align?: "center" | "left";
}) => {
  const alignClass = clsx(
    "",
    align === "center" ? "text-center" : "",
    align === "left" ? "text-left" : ""
  );
  return <div className={alignClass}>{title}</div>;
};
