"use client";
import { z } from "zod";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import SearchOutPut from "./search-output";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import useOnClickOutside from "@/hooks/useClickOutSide";
import { useToggleSearchInput } from "@/store/store";
import CategoryPopover from "./category/category-popover";
import { categories } from "@/lib/constants";

const formSchema = z.object({
  query: z.string().max(50),
  category: z.string().max(50),
});
const Search = () => {
  const router = useRouter();
  const isMdSize = useMediaQuery("(max-width: 1054px)");
  const [currentQuery, setCurrentQuery] = useState<string | undefined>("");
  const [showSearchOutput, setShowSearchOutput] = useState<boolean>(false);
  // on mobile devices toggles search input
  const { isOpen, toggle } = useToggleSearchInput();
  const searchOutputRef = useRef<HTMLDivElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
      category: "multi",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { query, category } = values;
    if (!query) return null;

    const params = new URLSearchParams();
    params.append("category", category);
    if (query.trim()) {
      params.append("q", query.trim());
    }

    const searchString = params.toString();
    if (searchString) {
      router.push(`/search?${searchString}`);
      form.reset();
    }
  }

  // Hook for handling outside click
  useOnClickOutside(searchOutputRef, () => setShowSearchOutput(false));

  // Watch for changes in the query input
  useEffect(() => {
    const subscription = form.watch((value) => {
      setCurrentQuery(value.query);
      setShowSearchOutput(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const formContainerClass =
    isMdSize &&
    "fixed top-0 right-0 !mx-0  py-3 px-2 lg:px-6 lg:h-16 h-fit z-50 bg-secondary  shadow-2xl ";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          formContainerClass,
          "w-full flex flex-col sm:flex-row gap-2 md:justify-center items-center mx-6 "
        )}
      >
        {/* categories popover selector */}
        <div className="w-full md:w-1/2 flex items-center gap-2 ">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <CategoryPopover form={form} categories={categories}>
                <FormItem>
                  <FormControl>
                    <Button
                      role="combobox"
                      type="button"
                      className="text-xs flex flex-col sm:flex-row items-center gap-1 capitalize"
                      variant="outline"
                    >
                      {field.value
                        ? categories.find(
                            (category) => category === field.value
                          )
                        : "Select category"}
                    </Button>
                  </FormControl>
                </FormItem>
              </CategoryPopover>
            )}
          />

          {/* search input */}
          <div className="relative w-full">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full px-4 py-2"
                      placeholder="Search..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  {field.value && (
                    <Button
                      type="button"
                      className="absolute -top-[24%] right-0 h-full px-3"
                      variant={"outline"}
                      onClick={() => form.setValue("query", "")}
                    >
                      <X />
                    </Button>
                  )}
                </FormItem>
              )}
            />
            {/* Modal of searches */}
            {showSearchOutput && currentQuery && (
              <div ref={searchOutputRef}>
                <SearchOutPut query={currentQuery} />
              </div>
            )}
          </div>
        </div>
        {/* submit */}
        <div className={"flex items-center gap-2"}>
          <Button disabled={!currentQuery} type="submit" variant={"outline"}>
            Search
          </Button>
          {isOpen && isMdSize && (
            <Button type="button" onClick={toggle} variant={"outline"}>
              {<X />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default Search;

export const SearchSkeleton = () => {
  return (
    <div className=" w-full flex md:justify-center  gap-1 mx-6">
      <div className="relative w-full  md:w-1/2">
        <Skeleton className="w-full h-10 px-4 py-2 bg-gray-500 " />
        <Skeleton className="absolute top-0 right-0  px-3 bg-gray-500" />
      </div>
      <Skeleton className="bg-gray-500 w-16 h-10" />
    </div>
  );
};
