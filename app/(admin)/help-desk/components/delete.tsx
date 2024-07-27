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
import { useHelpDeskContext } from "../provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DeleteModal() {
  const { toggleDelete, setToggleDelete, selected, setSelected } =
    useHelpDeskContext();

  const [isLoading, setisLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!selected) return;
    setisLoading(true);
    axios
      .post(`/api/help-desk/delete`, { id: selected.id })
      .then((d) => {
        if (d) {
          setSelected(undefined);
          setToggleDelete(false);

          toast({
            title: "Deleted Successfully!",
          });

          window.location.assign("/help-desk");
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
            This action cannot be undone. This will permanently delete the
            scholarship and remove the data from our servers.
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
