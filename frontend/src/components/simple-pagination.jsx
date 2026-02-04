import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SimplePagination({
  pagination,
  onPageChange,
}) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  return (
    <div className="flex gap-2 items-center">
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={pagination.first}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      <div className="text-sm">
        Page {currentPage + 1} of {totalPages}
      </div>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={pagination.last}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
