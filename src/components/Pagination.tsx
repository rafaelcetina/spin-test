"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchFilters } from "@/contexts/SearchFiltersContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNextPage,
  hasPreviousPage,
  className,
}: PaginationProps) {
  const { updatePage, updateLimit } = useSearchFilters();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updatePage(page);
    }
  };

  const handleLimitChange = (limit: string) => {
    updateLimit(parseInt(limit, 10));
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Información de resultados */}
      <div className="text-sm text-muted-foreground">
        Mostrando {startItem}-{endItem} de {totalItems} productos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botones de navegación rápida */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={!hasPreviousPage}
          className="hidden sm:flex"
          aria-label="Ir a la primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  className="w-10 h-10 p-0"
                  aria-label={`Ir a la página ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Ir a la página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={!hasNextPage}
          className="hidden sm:flex"
          aria-label="Ir a la última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Selector de elementos por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Mostrar:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
            <SelectItem value="96">96</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">por página</span>
      </div>
    </div>
  );
}
