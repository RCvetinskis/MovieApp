"use client";
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { postComment, replyComment } from "@/actions/backend/comment";
import { useToast } from "@/hooks/use-toast";
import { useSetAuthorizedDialog } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/store-user";

const FormSchema = z.object({
  message: z.string().min(1).max(300),
});
type Props = {
  postId?: string;
  commentId?: string;
  className?: string;
};

const CommentInput = ({ postId, commentId, className }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useUserStore();
  const { toast } = useToast();
  const { setOpen } = useSetAuthorizedDialog();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!user) {
      setOpen(true);
      return;
    }
    startTransition(() => {
      if (postId) {
        // if no comment id provided post comment else reply
        postComment(postId, data.message)
          .then(() => form.reset({ message: "" }))
          .catch((e) =>
            toast({
              title: "Failed to post comment",
              description: e.message,
            })
          );
      } else if (commentId) {
        replyComment(commentId, data.message)
          .then(() => form.reset({ message: "" }))
          .catch((e) =>
            toast({
              title: "Failed to reply comment",
              description: e.message,
            })
          );
      } else {
        return;
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="Add a comment..."
                  className={cn(
                    "w-full  focus-visible:ring-0 shadow-md  dark:shadow-black shadow-primary border-0 border-b border-secondary focus-visible:border-b-secondary-foreground resize-none",
                    className
                  )}
                  onFocus={() => setIsFocused(true)}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isFocused && (
          <div className="flex justify-end items-center gap-5">
            <Button
              type="button"
              onClick={() => setIsFocused(false)}
              variant={"ghost"}
              size={"sm"}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              variant={"secondary"}
              size={"sm"}
            >
              Comment
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CommentInput;

export const CommentInputSkeleton = () => {
  return <Skeleton className="w-full min-h-[60px] rounded-md  bg-gray-500" />;
};
