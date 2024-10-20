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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWatchListStore } from "@/store/store-watchlist";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Title must contain at least 2 characters" })
    .max(50),
  public: z.boolean(),
  description: z.string().max(250).optional(),
  items: z
    .array(
      z.object({
        tmdbId: z.string().min(1).max(100),
        type: z.enum(["tv", "movie"]),
      })
    )
    .optional(),
  image: z.instanceof(File).optional(),
});

const EditList = () => {
  const {
    watchList,
    setWatchListName,
    setWatchListDescription,
    setWatchListPublic,
  } = useWatchListStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: watchList.name,
      public: watchList.public,
      description: watchList.description,
    },
  });

  useEffect(() => {
    form.reset({
      name: watchList.name,
      public: watchList.public,
      description: watchList.description,
    });
  }, [watchList, form]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("navStep", "addItems");
    router.push(`?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    className="w-full"
                    id="name"
                    placeholder="Name"
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setWatchListName(e.target.value);
                    }}
                  />
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    className="w-full h-28"
                    id="description"
                    placeholder="Description"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setWatchListDescription(e.target.value);
                    }}
                  />
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="public"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LabelInputContainer>
                  <Label htmlFor="public">Public List?</Label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "Yes");
                      setWatchListPublic(value === "Yes");
                    }}
                    defaultValue={field.value ? "Yes" : "No"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-secondary/70">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </LabelInputContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant={"secondary"} type="button" onClick={handleNavigate}>
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default EditList;
