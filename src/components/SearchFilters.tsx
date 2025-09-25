"use client";

import { Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchFilters } from "@/contexts/SearchFiltersContext";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import type { Category } from "@/types/product";

interface SearchFiltersProps {
  categories: Category[];
  className?: string;
}

export function SearchFilters({ categories, className }: SearchFiltersProps) {
  const {
    state,
    updateSearch,
    updateCategory,
    updateSort,
    updateOrder,
    resetFilters,
  } = useSearchFilters();
  const [searchInput, setSearchInput] = useState(state.q || "");
  const { debouncedValue, isDebouncing } = useDebouncedSearch(searchInput, {
    delay: 400,
  });

  // Estados locales para los Select para evitar bucles infinitos
  const [localCategory, setLocalCategory] = useState(state.category);
  const [localSort, setLocalSort] = useState(state.sort);
  const [localOrder, setLocalOrder] = useState(state.order);
  const [showFilters, setShowFilters] = useState(true);
  // Actualizar búsqueda cuando el valor debounced cambie
  useEffect(() => {
    updateSearch(debouncedValue);
  }, [debouncedValue, updateSearch]);

  // Sincronizar input con el estado del contexto
  useEffect(() => {
    setSearchInput(state.q || "");
  }, [state.q]);

  // Sincronizar estados locales con el contexto
  useEffect(() => {
    setLocalCategory(state.category);
  }, [state.category]);

  useEffect(() => {
    setLocalSort(state.sort);
  }, [state.sort]);

  useEffect(() => {
    setLocalOrder(state.order);
  }, [state.order]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    updateSearch("");
  };

  const handleCategoryChange = (value: string) => {
    setLocalCategory(value);
    updateCategory(value === "all" ? "" : value);
  };

  const handleSortChange = (value: string) => {
    setLocalSort(value as "none" | "price" | "rating" | "title");
    updateSort(value as "none" | "price" | "rating" | "title");
  };

  const handleOrderChange = (value: string) => {
    setLocalOrder(value as "none" | "asc" | "desc");
    updateOrder(value as "none" | "asc" | "desc");
  };

  const hasActiveFilters =
    state.q ||
    (state.category && state.category !== "all") ||
    (state.sort && state.sort !== "none") ||
    (state.order && state.order !== "none");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de búsqueda
          <div className="flex items-center gap-2 ml-auto">
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-auto w-fit">
                {
                  [state.q, state.category, state.sort, state.order].filter(
                    Boolean,
                  ).length
                }{" "}
                activos
              </Badge>
            )}
            <Button
              className="ml-auto"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 ${showFilters ? "block" : "hidden"}`}>
        <div className="space-y-2">
          <label htmlFor="search-input" className="text-sm font-medium">
            Buscar productos
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search-input"
              placeholder="Buscar por nombre, marca o descripción..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Buscar productos"
              aria-describedby="search-help"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {isDebouncing && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-live="polite"
              >
                <div
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span className="sr-only">Buscando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Filtros en grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Categoría */}
          <div className="space-y-2">
            <label htmlFor="category-select" className="text-sm font-medium">
              Categoría
            </label>
            <Select value={localCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenar por */}
          <div className="space-y-2">
            <label htmlFor="sort-select" className="text-sm font-medium">
              Ordenar por
            </label>
            <Select value={localSort} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-select">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin ordenar</SelectItem>
                <SelectItem value="title">Nombre</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="rating">Valoración</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orden */}
          <div className="space-y-2">
            <label htmlFor="order-select" className="text-sm font-medium">
              Orden
            </label>
            <Select
              value={localOrder}
              onValueChange={handleOrderChange}
              disabled={!localSort || localSort === "none"}
            >
              <SelectTrigger id="order-select">
                <SelectValue placeholder="Seleccionar orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seleccionar orden</SelectItem>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de reset */}
          <div className="space-y-2">
            {/* Botón de reset */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {state.q && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: "{state.q}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearch("")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {state.category && state.category !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Categoría: {state.category}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateCategory("")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {state.sort && state.sort !== "none" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Orden: {state.sort} ({state.order})
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateSort("none");
                      updateOrder("none");
                    }}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
