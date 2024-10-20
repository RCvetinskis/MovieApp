"use client";
import { Button } from "@/components/ui/button";
import CommentInput from "../../comment-input";
import { useState } from "react";
import HiddenDropDownAnimated from "@/components/animated/hidden-dropdown-animated";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  commentId: string;
};

const ReplyCommentAciton = ({ commentId }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button size={"sm"} variant={"secondary"} onClick={() => setOpen(!open)}>
        {open ? "Close" : "Reply"}
      </Button>

      <HiddenDropDownAnimated open={open}>
        <CommentInput commentId={commentId} />
      </HiddenDropDownAnimated>
    </div>
  );
};

export default ReplyCommentAciton;

export const ReplyCommentActionSkeleton = () => {
  return <Skeleton className="bg-gray-500 w-12 h-6" />;
};
