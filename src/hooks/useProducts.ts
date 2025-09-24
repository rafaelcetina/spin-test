import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ApiError,
  Product,
  ProductsResponse,
  SearchFilters,
} from "@/types/product";

interface UseProductsOptions extends SearchFilters {
  retries?: number;
  delay?: number;
}

interface UseProductsReturn {
  products: Product[];
  total: number;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

// Cache simple en memoria para la sesión
const cache = new Map<string, { data: ProductsResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function createCacheKey(options: UseProductsOptions): string {
  const { q, category, sort, order, page = 1, limit = 12 } = options;
  return JSON.stringify({ q, category, sort, order, page, limit });
}

export function useProducts(
  options: UseProductsOptions = {},
): UseProductsReturn {
  const {
    q,
    category,
    sort,
    order,
    page = 1,
    limit = 12,
    retries = 0,
    delay = 0,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const cacheKey = createCacheKey(options);

    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.data.products);
      setTotal(cached.data.total);
      setError(null);
      return;
    }

    // Cancelar petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    currentRequestRef.current = cacheKey;

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      if (q) searchParams.set("q", q);
      if (category) searchParams.set("category", category);
      if (sort) searchParams.set("sort", sort);
      if (order) searchParams.set("order", order);
      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());
      if (delay > 0) searchParams.set("delay", delay.toString());
      if (retries > 0) searchParams.set("retries", retries.toString());

      const url = `/api/dummy/products?${searchParams.toString()}`;

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Verificar si la petición fue cancelada
      if (currentRequestRef.current !== cacheKey) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ProductsResponse = await response.json();

      // Verificar nuevamente si la petición fue cancelada
      if (currentRequestRef.current !== cacheKey) {
        return;
      }

      setProducts(data.products);
      setTotal(data.total);
      setError(null);

      // Guardar en cache
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    } catch (err) {
      // Verificar si la petición fue cancelada
      if (currentRequestRef.current !== cacheKey) {
        return;
      }

      if (err instanceof Error && err.name === "AbortError") {
        // Petición cancelada, no actualizar estado
        return;
      }

      const apiError: ApiError = {
        message: err instanceof Error ? err.message : "Unknown error",
        status: 500,
        retries,
      };

      setError(apiError);
      setProducts([]);
      setTotal(0);
    } finally {
      if (currentRequestRef.current === cacheKey) {
        setLoading(false);
      }
    }
  }, [options, q, category, sort, order, page, limit, retries, delay]);

  const refetch = useCallback(() => {
    // Limpiar cache para forzar refetch
    const cacheKey = createCacheKey(options);
    cache.delete(cacheKey);
    fetchProducts();
  }, [fetchProducts, options]);

  useEffect(() => {
    fetchProducts();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [q, category, sort, order, page, limit, retries, delay]); // Dependencias directas en lugar de fetchProducts

  // Calcular paginación
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    products,
    total,
    loading,
    error,
    refetch,
    hasNextPage,
    hasPreviousPage,
    currentPage: page,
    totalPages,
  };
}
