"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  const firstPages = [1, 2, 3];
  const lastPages = [total - 2, total - 1, total];

  const pages = new Set<number | "...">();

  // Add first pages
  firstPages.forEach((p) => {
    if (p <= total) pages.add(p);
  });

  // Add last pages
  lastPages.forEach((p) => {
    if (p > 3 && p <= total) pages.add(p);
  });

  // Add current page and neighbors
  if (current > 3 && current < total - 2) {
    pages.add("...");
    pages.add(current - 1);
    pages.add(current);
    pages.add(current + 1);
    pages.add("...");
  }

  const sorted = Array.from(pages).sort((a, b) =>
    typeof a === "number" && typeof b === "number" ? a - b : typeof a === "number" ? -1 : 1
  );

  const deduped: (number | "...")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (
      i > 0 &&
      sorted[i] === "..." &&
      sorted[i - 1] === "..."
    ) {
      continue; // skip repeated ellipses
    }
    deduped.push(sorted[i]);
  }

  return deduped;
}

export default function TablePagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex justify-center pt-4">
      <Pagination>
        <PaginationContent className="gap-2">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Numbered Buttons with Ellipses */}
          {visiblePages.map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span className="px-3 py-1 text-gray-500 select-none">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
