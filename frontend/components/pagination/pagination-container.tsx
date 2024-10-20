"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationNumbers from "./pagination-numbers";
import { Skeleton } from "../ui/skeleton";
type Props = {
  totalPages: number;
};

const PaginationContainer = ({ totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };
  return (
    <Pagination className="flex items-center justify-center md:justify-end ">
      <PaginationContent>
        <PaginationItem className="hover:cursor-pointer">
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        <PaginationNumbers
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <PaginationItem className="hover:cursor-pointer">
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationContainer;

export const PaginationContainerSkeleton = () => {
  return (
    <div className="flex items-center justify-center md:justify-end">
      <div className="flex items-center gap-5">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-8 rounded-lg bg-gray-500" />
        ))}
      </div>
    </div>
  );
};
