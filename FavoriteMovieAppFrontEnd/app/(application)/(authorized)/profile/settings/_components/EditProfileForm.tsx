"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import { useTransition } from "react";
import { patchUser } from "@/actions/backend/user";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";

type Props = {
  userId: string;
  userName: string;
};

const formSchema = z
  .object({
    userName: z
      .string()
      .min(4, {
        message: "Username must be at least 4 characters.",
      })
      .optional()
      .or(z.literal("")),
    currentPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .optional()
      .or(z.literal("")),
    repeatPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // If the user has entered a new password, they must enter the current password
      if (data.password && !data.currentPassword) {
        return false;
      }

      // Ensure repeatPassword matches password when both are provided
      if (data.password && data.repeatPassword) {
        return data.password === data.repeatPassword;
      }

      return true;
    },
    {
      message:
        "New password requires current password and both passwords must match.",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // Ensure passwords match
      if (data.password || data.repeatPassword) {
        return data.password === data.repeatPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match.",
      path: ["repeatPassword"],
    }
  );
const EditProfileForm = ({ userId, userName }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: userName || "",
      currentPassword: "",
      password: "",
      repeatPassword: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const { mutate } = useUser();
  function onSubmit(values: z.infer<typeof formSchema>) {
    const body = new FormData();

    if (values.password && values.currentPassword) {
      body.append("currentPassword", values.currentPassword);
      body.append("password", values.password);
      console.log("Updating password:", values.password);
    }

    if (values.userName) {
      body.append("userName", values.userName);
    }
    startTransition(() => {
      patchUser(userId, body)
        .then((res) => {
          toast.success(res.message);
          mutate();
        })
        .catch((e) => toast.error(e.message));
    });

    return null;
  }

  const isFormFilled = !!(
    form.watch("userName") ||
    form.watch("password") ||
    form.watch("repeatPassword") ||
    isPending
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  autoComplete="username"
                  placeholder="Username"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="currentPassword"
                    disabled={isPending}
                    {...field}
                  />
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="repeatPassword">Repeat password</Label>
                  <Input
                    id="repeatPassword"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size={"lg"}
          className="w-full"
          variant={"shimmer"}
          type="submit"
          disabled={!isFormFilled}
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
