"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollegeScholarsContext } from "../provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function DeleteUserModal() {
  const { toggleDelete, setToggleDelete, selected, setSelected } =
    useCollegeScholarsContext();

  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  async function handleDelete() {
    if (!selected) return;
    setisLoading(true);
    axios
      .post(`/api/college-scholars/delete`, { email: selected.email })
      .then((d) => {
        if (d) {
          router.refresh();
          setSelected(undefined);
          setToggleDelete(false);
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  return (
    <AlertDialog open={toggleDelete} onOpenChange={setToggleDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-bold">{selected?.email}</span> account and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={isLoading} onClick={handleDelete}>
            Continue{" "}
            {isLoading && <Loader2 className="w-6 h-6 animate-spin ml-2" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
