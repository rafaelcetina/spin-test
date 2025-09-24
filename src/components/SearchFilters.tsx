'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearchFilters } from '@/contexts/SearchFiltersContext';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { Category } from '@/types/product';

interface SearchFiltersProps {
  categories: Category[];
  className?: string;
}

export function SearchFilters({ categories, className }: SearchFiltersProps) {
  const { state, updateSearch, updateCategory, updateSort, updateOrder, resetFilters } = useSearchFilters();
  const [searchInput, setSearchInput] = useState(state.q || '');
  const { debouncedValue, isDebouncing } = useDebouncedSearch(searchInput, { delay: 400 });

  // Estados locales para los Select para evitar bucles infinitos
  const [localCategory, setLocalCategory] = useState(state.category);
  const [localSort, setLocalSort] = useState(state.sort);
  const [localOrder, setLocalOrder] = useState(state.order);

  // Actualizar búsqueda cuando el valor debounced cambie
  useEffect(() => {
    updateSearch(debouncedValue);
  }, [debouncedValue, updateSearch]);

  // Sincronizar input con el estado del contexto
  useEffect(() => {
    setSearchInput(state.q || '');
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
    setSearchInput('');
    updateSearch('');
  };

  const handleCategoryChange = (value: string) => {
    setLocalCategory(value);
    updateCategory(value === 'all' ? '' : value);
  };

  const handleSortChange = (value: string) => {
    setLocalSort(value as any);
    updateSort(value as any);
  };

  const handleOrderChange = (value: string) => {
    setLocalOrder(value as any);
    updateOrder(value as any);
  };

  const hasActiveFilters = state.q || (state.category && state.category !== 'all') || (state.sort && state.sort !== 'none') || (state.order && state.order !== 'none');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de búsqueda
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-auto">
              {[state.q, state.category, state.sort, state.order].filter(Boolean).length} activos
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda por texto */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar productos</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Buscando...">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Filtros en grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Categoría */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select
              value={localCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
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
            <label className="text-sm font-medium">Ordenar por</label>
            <Select
              value={localSort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger>
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
            <label className="text-sm font-medium">Orden</label>
            <Select
              value={localOrder}
              onValueChange={handleOrderChange}
              disabled={!localSort || localSort === 'none'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seleccionar orden</SelectItem>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Filtros activos:</label>
            <div className="flex flex-wrap gap-2">
              {state.q && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: "{state.q}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearch('')}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {state.category && state.category !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Categoría: {state.category}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateCategory('')}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {state.sort && state.sort !== 'none' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Orden: {state.sort} ({state.order})
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateSort('none');
                      updateOrder('none');
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
