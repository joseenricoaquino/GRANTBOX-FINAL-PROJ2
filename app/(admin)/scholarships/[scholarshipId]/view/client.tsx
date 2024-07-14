"use client";
import { FullScholarshipType } from "@/utils/interfaces";
import React from "react";

// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "../../components/delete-modal";
import { useScholarshipsContext } from "../../provider";

const ViewScholarshipClient = ({
  scholarship,
}: {
  scholarship: FullScholarshipType;
}) => {
  const { toggleDelete, selected, setToggleDelete, setSelected } =
    useScholarshipsContext();
  return (
    <div className="w-full py-2 grid grid-cols-7 gap-6">
      {selected && toggleDelete && <DeleteModal />}
      <View scholarship={scholarship} />
      <div className="col-span-7 flex justify-start items-center gap-2">
        <Link href={`/scholarships/${scholarship.id}/edit`}>
          <Button type="button">Edit Details</Button>
        </Link>
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => {
            setSelected(scholarship);
            setToggleDelete(true);
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ViewScholarshipClient;

const View = ({ scholarship }: { scholarship: FullScholarshipType }) => {
  const criteria = scholarship.criteria;
  const college = scholarship.college;
  return (
    <>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Scholarship Details</CardTitle>
          <CardDescription>{scholarship.details}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="type">Type</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                {scholarship.scholarshipType}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Coverage</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                {scholarship.coverageType}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Deadline</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                {scholarship.deadline?.toLocaleDateString()}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Link</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center line-clamp-1">
                <Button variant={"link"} className="p-0 text-xs text-black">
                  <Link href={scholarship.formLink || ""} target="_blank">
                    {scholarship.formLink}
                  </Link>
                </Button>
              </p>
            </div>

            {/* CRITERIA */}
            <Separator className="mt-4" />
            <Label className="uppercase text-base font-normal">Criteria</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="type">Minimum Grade</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.grades ? criteria.grades : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Financial</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.financialStatus ? criteria.financialStatus : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Previous School</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.prevSchool ? criteria.prevSchool : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Residency</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.location ? criteria?.location : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Citizenship</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.citizenship ? criteria?.citizenship : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Field of Study</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.courseInterest ? criteria?.courseInterest : "N/A"}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">Club Involved in</Label>
                <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                  {criteria?.extracurricularActivities
                    ? criteria?.extracurricularActivities
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>College Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Avatar className="w-32 h-32 mx-auto border-2 border-black shadow-sm">
              <AvatarImage
                src={college?.image || ""}
                alt={college?.name || "profile pic"}
              />
              <AvatarFallback>{college?.name?.charAt(0) || "T"}</AvatarFallback>
            </Avatar>
            <div className="grid gap-3">
              <Label htmlFor="type">Name</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                {college.name}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs min-h-10 flex justify-normal items-center">
                {college.details}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Location</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center">
                {college.location}
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Link</Label>
              <p className="px-3 py-1 bg-slate-100 rounded-md text-xs h-10 flex justify-normal items-center line-clamp-1">
                <Button variant={"link"} className="p-0 text-xs text-black">
                  <Link href={college.webLink || ""} target="_blank">
                    {college.webLink}
                  </Link>
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
