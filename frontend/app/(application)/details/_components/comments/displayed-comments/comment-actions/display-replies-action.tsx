"use client";
import { IComment } from "@/types";
import Comments from "../comments";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import HiddenDropDownAnimated from "@/components/animated/hidden-dropdown-animated";
import { Button } from "@/components/ui/button";
import { getReplies } from "@/actions/backend/comment";
import LoaderSpinner from "@/components/animated/loader-spinner";
import { limit } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  commentId: string;
};

const DisplayRepliesAction = ({ commentId }: Props) => {
  const [replies, setReplies] = useState<IComment[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReplies = async () => {
      try {
        if (open) {
          setLoading(true);
          const res = await getReplies(commentId, 1, limit);
          if (isMounted) {
            setReplies(res.response.comments);
            setLoading(false);
          }
        }
      } catch (e) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReplies();
    return () => {
      isMounted = false;
    };
  }, [open, commentId]);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/comment/post/${commentId}`
      );

      ws.onmessage = (event) => {
        const newComment: IComment = JSON.parse(event.data);
        if (isMounted) {
          setReplies((prevComments) => [newComment, ...prevComments]);
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [open, commentId]);

  const Arrow = open ? ArrowUp : ArrowDown;

  return (
    <div>
      <Button
        className="space-x-1"
        onClick={() => setOpen(!open)}
        variant={"ghost"}
        size={"sm"}
      >
        <Arrow size={19} />
        <span>Replies</span>
      </Button>

      <HiddenDropDownAnimated open={open}>
        {loading ? (
          <div className="flex items-center justify-center">
            <LoaderSpinner />
          </div>
        ) : replies.length > 0 ? (
          <Comments
            postId={commentId}
            comments={replies}
            setComments={setReplies}
            isReply={true}
            commentId={commentId}
          />
        ) : (
          <p className="text-xs">No Replies Found</p>
        )}
      </HiddenDropDownAnimated>
    </div>
  );
};

export default DisplayRepliesAction;

export const DisplayRepliesActionSkeleton = () => {
  return <Skeleton className="bg-gray-500 w-12 h-3" />;
};
