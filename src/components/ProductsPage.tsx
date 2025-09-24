"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { SearchFilters } from "@/components/SearchFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSearchFilters } from "@/contexts/SearchFiltersContext";
import { useProducts } from "@/hooks/useProducts";
import type { Category } from "@/types/product";

export function ProductsPage() {
  const { state } = useSearchFilters();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const {
    products,
    total,
    loading,
    error,
    refetch,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
  } = useProducts({
    q: state.q,
    category: state.category === "all" ? undefined : state.category,
    sort: state.sort === "none" ? undefined : state.sort,
    order: state.order === "none" ? undefined : state.order,
    page: state.page,
    limit: state.limit,
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/dummy/products?action=categories", {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Error fetching categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Error al cargar los productos: {error.message}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Filtros de búsqueda */}
      <SearchFilters categories={categories} className="sticky top-4 z-10" />

      {/* Resultados */}
      <div className="space-y-6">
        {/* Información de resultados */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {state.q ? `Resultados para "${state.q}"` : "Productos"}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Cargando..." : `${total} productos encontrados`}
            </p>
          </div>

          {!loading && products.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
          )}
        </div>

        {/* Grid de productos */}
        {loading ? (
          <ProductGridSkeleton count={state.limit} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar tus filtros de búsqueda o explorar otras
              categorías.
            </p>
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar productos
            </Button>
          </div>
        )}

        {/* Paginación */}
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={state.limit || 10}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            className="border-t pt-6"
          />
        )}
      </div>
    </div>
  );
}
