"use client";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const FormCard = ({
  title,
  tag,
  checked,
}: {
  title: string;
  tag: number;
  checked: boolean;
}) => {
  return (
    <Link href={`/scholarships-compass/form?tag=${tag}`}>
      <button
        type="button"
        className="w-full rounded-sm border bg-white shadow-sm h-40 flex flex-col justify-center items-center p-2 hover:bg-main-200 transition-all hover:scale-105 hover:shadow-lg relative"
      >
        {checked && (
          <div className="absolute top-4 right-4 w-8 h-8">
            <CheckCircle className="text-green-500" />
          </div>
        )}
        <h3 className="text-center font-bold text-main-500">{title}</h3>
      </button>
    </Link>
  );
};

export default FormCard;
