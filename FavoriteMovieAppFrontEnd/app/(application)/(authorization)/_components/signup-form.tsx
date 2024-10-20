"use client";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomGradient } from "@/components/ui/bottom-gradient";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { onRegister } from "@/actions/backend/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ButtonLink from "@/components/buttons/button-link";

const formSchema = z
  .object({
    userName: z.string().min(4, {
      message: "Username must be at least 4 characters.",
    }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .min(4, {
        message: "Email must be at least 4 characters.",
      }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    repeatPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });
export const SignUp = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values) return null;

    const data = {
      email: values.email,
      password: values.password,
      userName: values.userName,
    };

    startTransition(() => {
      onRegister(data)
        .then((res) => {
          toast.success(res.message);

          router.push("/login");
        })
        .catch((e) => {
          toast.error(e?.message || "Something went wrong!");
        });
    });
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-xl p-4 md:p-8 shadow-input bg-card">
      <h2 className="font-bold text-xl mb-4">
        Welcome to Favorite Movie Application
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabelInputContainer>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      className="w-full"
                      id="username"
                      placeholder="Tyler"
                      type="text"
                      autoComplete="username"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      className="w-full"
                      id="email"
                      placeholder="email@email.com"
                      type="email"
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
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
                      {...field}
                    />
                  </LabelInputContainer>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            className="w-full"
            variant="shimmer"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-1 flex-wrap">
        <p className=" text-sm  ">Already have an account?</p>

        <ButtonLink
          location="/login"
          title="Login"
          className="text-muted-foreground"
        />
      </div>
    </div>
  );
};

export default SignUp;
