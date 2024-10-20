"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSetAuthorizedDialog } from "@/store/store";
import { useRouter } from "next/navigation";

const UnauthorizedDialog = () => {
  const { open, setOpen } = useSetAuthorizedDialog();
  const router = useRouter();

  const handleLogin = () => {
    setOpen(open);
    router.push("/login");
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="dark:bg-black/70  bg-primary-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Unauthorized</AlertDialogTitle>
          <AlertDialogDescription>
            This action requires authoriziation!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin}>Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnauthorizedDialog;
