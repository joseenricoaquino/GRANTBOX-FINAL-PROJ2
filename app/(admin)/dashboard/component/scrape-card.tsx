"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ScrapeCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleScrape() {
    setIsLoading(true);
    axios
      .post("/api/scrape", {})
      .then((d: any) => {
        if (d.data) {
          toast({
            title: "Created Successfully!",
            description: "Successfully Scraped Data",
          });
          window.localStorage.setItem(
            `webScrape:${new Date().toLocaleDateString()}`,
            "Have Webscraped today!"
          );
          router.refresh();
        }
      })
      .catch((error) => {
        console.log(error.request.response);
        toast({
          title: "Unexpected error!",
          variant: "destructive",
          description: `${error.request.response}!`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader>
        <CardTitle>Scrape New Scholarships</CardTitle>
        <CardDescription>
          Here you can manually scrape new scholarships!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleScrape} disabled={isLoading} type="button">
          Scrape Data
          {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScrapeCard;
