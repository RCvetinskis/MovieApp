import {
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import useMediaQuery from "@/hooks/useMediaQuery";

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const PaginationNumbers = ({
  totalPages,
  currentPage,
  onPageChange,
}: Props) => {
  const pageNumbers = [];
  const isMdSize = useMediaQuery("(max-width: 1054px)");
  const maxPagesToShow = !isMdSize ? 5 : 2;
  const maxLeftPages = Math.floor(maxPagesToShow / 2);
  const maxRightPages = maxPagesToShow - maxLeftPages - 1;

  let startPage = Math.max(currentPage - maxLeftPages, 1);
  let endPage = Math.min(currentPage + maxRightPages, totalPages);

  if (currentPage - maxLeftPages < 1) {
    endPage = Math.min(maxPagesToShow, totalPages);
  }

  if (currentPage + maxRightPages > totalPages) {
    startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
  }

  if (startPage > 1) {
    pageNumbers.push(
      <PaginationItem key={1} className="hover:cursor-pointer">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    if (startPage > 2) {
      pageNumbers.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <PaginationItem key={i} className="hover:cursor-pointer">
        <PaginationLink
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    pageNumbers.push(
      <PaginationItem key={totalPages} className="hover:cursor-pointer">
        <PaginationLink
          isActive={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return <>{pageNumbers}</>;
};

export default PaginationNumbers;
