"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Card = ({ scholar }: { scholar: User }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  async function handleDelete() {
    console.log("clicked");
    console.log(scholar);

    axios
      .post(`/api/college-scholars/delete`, { email: scholar.email })
      .then((d) => {
        if (d) {
          console.log("sucessfully deleted");
          router.refresh();
        }
      });
  }
  async function handleEdit() {
    setisLoading(true);
    axios
      .post(`/api/college-scholars/edit`, { email: scholar.email })
      .then((d) => {
        if (d) {
          console.log("sucessfully edit");
          router.refresh();
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  return (
    <div className="flex gap-2 justify-start items-center my-2">
      <span className="">{scholar.name}</span>
      <span className="">{scholar.email}</span>
      <Button onClick={handleEdit} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Edit"}
      </Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
};

export default Card;
