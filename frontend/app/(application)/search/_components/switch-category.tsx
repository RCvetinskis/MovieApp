"use client";
import BtnSkeleton from "@/components/skeletons/btn-skeleton";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SwtichCategory = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "multi";
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="max-w-[300px] mx-1">
      <ul className="flex items-center justify-between">
        {categories.map((category, i) => (
          <li key={i}>
            <Button
              className="capitalize"
              onClick={() => handleClick(category)}
              variant={
                categoryParam?.toLowerCase() === category.toLocaleLowerCase()
                  ? "shimmer"
                  : "secondary"
              }
            >
              {category}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SwtichCategory;

export const SwitchCategorySkeleton = () => {
  return (
    <div className="max-w-[300px] mx-1">
      <ul className="flex items-center justify-between gap-2">
        {[...Array(4)].map((_, i) => (
          <BtnSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
};
