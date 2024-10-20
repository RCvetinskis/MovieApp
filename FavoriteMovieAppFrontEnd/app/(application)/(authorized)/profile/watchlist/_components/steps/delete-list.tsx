"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { deleteWatchlist } from "@/actions/backend/watchlist";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
type Props = {
  watclistId: string;
};

const DeleteList = ({ watclistId }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTranstion] = useTransition();
  const { toast } = useToast();
  const token = Cookies.get("auth_token");
  const userId = Cookies.get("userId");
  const router = useRouter();
  const handleDelete = () => {
    if (!token || !userId) return;
    setOpen(false);

    startTranstion(() => {
      deleteWatchlist(userId, watclistId, token)
        .then(() => {
          toast({
            title: "Success",
            description: "Succesfully delete watchlist",
          });
          router.refresh();
        })
        .catch((e) => {
          toast({
            title: "Failure",
            description: e.message,
            variant: "destructive",
          });
        });
    });
  };
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Click the button below if you are sure you want to delete this list.
      </h1>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"}>Delete </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              list and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              disabled={isPending}
              onClick={handleDelete}
              variant={"destructive"}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteList;
