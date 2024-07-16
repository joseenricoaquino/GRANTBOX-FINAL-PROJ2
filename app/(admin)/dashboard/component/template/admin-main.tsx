"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScrapeCard from "../scrape-card";
import useScholars from "../../(actions)/useScholars";

export default function AdminMainTemplate() {
  const scholars = useScholars();
  console.log(scholars);
  return (
    <main className="flex flex-1 flex-col gap-4 mb-4">
      <div className="grid gap-4 grid-cols-3">
        <Card className="col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>College Scholars</CardTitle>
              <CardDescription>
                Registered college scholars to GrantBox...
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/scholarships">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholar</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  {/* <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead> */}
                  {/* <TableHead className="text-right">Date</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholars.data?.map((sc) => {
                  return (
                    <div className="" key={sc.id}>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">{sc.name}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {sc.email}
                          </div>
                        </TableCell>
                      </TableRow>
                    </div>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="w-full flex flex-col gap-2">
          <ScrapeCard />

          {/* <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Near Deadline Scholarships</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">

            </CardContent>
          </Card> */}
        </div>
      </div>
    </main>
  );
}
