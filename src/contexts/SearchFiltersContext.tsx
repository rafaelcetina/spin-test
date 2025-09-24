"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { SearchFilters } from "@/types/product";

// Tipos para el estado interno del contexto
type InternalSort = "price" | "rating" | "title" | "none";
type InternalOrder = "asc" | "desc" | "none";
type InternalCategory = string | "all";

interface SearchFiltersState {
  q?: string;
  category: InternalCategory;
  sort: InternalSort;
  order: InternalOrder;
  page: number;
  limit: number;
  isInitialized: boolean;
}

type SearchFiltersAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT"; payload: InternalSort }
  | { type: "SET_ORDER"; payload: InternalOrder }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "RESET_FILTERS" }
  | { type: "INITIALIZE"; payload: Partial<SearchFilters> }
  | { type: "UPDATE_URL" };

interface SearchFiltersContextType {
  state: SearchFiltersState;
  dispatch: React.Dispatch<SearchFiltersAction>;
  updateSearch: (search: string) => void;
  updateCategory: (category: string) => void;
  updateSort: (sort: InternalSort) => void;
  updateOrder: (order: InternalOrder) => void;
  updatePage: (page: number) => void;
  updateLimit: (limit: number) => void;
  resetFilters: () => void;
  getUrlParams: () => URLSearchParams;
}

const initialState: SearchFiltersState = {
  q: undefined,
  category: "all",
  sort: "none",
  order: "none",
  page: 1,
  limit: 12,
  isInitialized: false,
};

function searchFiltersReducer(
  state: SearchFiltersState,
  action: SearchFiltersAction,
): SearchFiltersState {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        q: action.payload,
        page: 1, // Reset page when search changes
      };
    case "SET_CATEGORY":
      return {
        ...state,
        category: action.payload,
        page: 1, // Reset page when category changes
      };
    case "SET_SORT":
      return {
        ...state,
        sort: action.payload,
        page: 1, // Reset page when sort changes
      };
    case "SET_ORDER":
      return {
        ...state,
        order: action.payload,
        page: 1, // Reset page when order changes
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_LIMIT":
      return {
        ...state,
        limit: action.payload,
        page: 1, // Reset page when limit changes
      };
    case "RESET_FILTERS":
      return {
        ...initialState,
        isInitialized: true,
      };
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
      };
    default:
      return state;
  }
}

const SearchFiltersContext = createContext<
  SearchFiltersContextType | undefined
>(undefined);

// Componente interno que maneja useSearchParams
function SearchFiltersProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(searchFiltersReducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar desde URL params
  useEffect(() => {
    if (!state.isInitialized) {
      const urlParams: Partial<SearchFilters> = {};

      const q = searchParams.get("q");
      const category = searchParams.get("category");
      const sort = searchParams.get("sort") as
        | "price"
        | "rating"
        | "title"
        | null;
      const order = searchParams.get("order") as "asc" | "desc" | null;
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");

      if (q) urlParams.q = q;
      if (category) urlParams.category = category;
      if (sort) urlParams.sort = sort;
      if (order) urlParams.order = order;
      if (page) urlParams.page = parseInt(page, 10);
      if (limit) urlParams.limit = parseInt(limit, 10);

      dispatch({ type: "INITIALIZE", payload: urlParams });
    }
  }, [searchParams, state.isInitialized]);

  // Actualizar URL cuando cambie el estado
  useEffect(() => {
    if (state.isInitialized) {
      const params = new URLSearchParams();

      if (state.q) params.set("q", state.q);
      if (state.category && state.category !== "all")
        params.set("category", state.category);
      if (state.sort && state.sort !== "none") params.set("sort", state.sort);
      if (state.order && state.order !== "none")
        params.set("order", state.order);
      if (state.page && state.page > 1)
        params.set("page", state.page.toString());
      if (state.limit && state.limit !== 12)
        params.set("limit", state.limit.toString());

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      const currentUrl = searchParams.toString()
        ? `?${searchParams.toString()}`
        : "";

      if (newUrl !== currentUrl) {
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [state, router, searchParams]);

  const updateSearch = useCallback((search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  }, []);

  const updateCategory = useCallback((category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  }, []);

  const updateSort = useCallback((sort: InternalSort) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  const updateOrder = useCallback((order: InternalOrder) => {
    dispatch({ type: "SET_ORDER", payload: order });
  }, []);

  const updatePage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const updateLimit = useCallback((limit: number) => {
    dispatch({ type: "SET_LIMIT", payload: limit });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const getUrlParams = () => {
    const params = new URLSearchParams();

    if (state.q) params.set("q", state.q);
    if (state.category) params.set("category", state.category);
    if (state.sort) params.set("sort", state.sort);
    if (state.order) params.set("order", state.order);
    if (state.page && state.page > 1) params.set("page", state.page.toString());
    if (state.limit && state.limit !== 12)
      params.set("limit", state.limit.toString());

    return params;
  };

  const value: SearchFiltersContextType = {
    state,
    dispatch,
    updateSearch,
    updateCategory,
    updateSort,
    updateOrder,
    updatePage,
    updateLimit,
    resetFilters,
    getUrlParams,
  };

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

// Componente de fallback para Suspense
function SearchFiltersFallback({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(searchFiltersReducer, {
    ...initialState,
    isInitialized: true, // Inicializar sin URL params
  });

  const updateSearch = useCallback((search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  }, []);

  const updateCategory = useCallback((category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  }, []);

  const updateSort = useCallback((sort: InternalSort) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  const updateOrder = useCallback((order: InternalOrder) => {
    dispatch({ type: "SET_ORDER", payload: order });
  }, []);

  const updatePage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const updateLimit = useCallback((limit: number) => {
    dispatch({ type: "SET_LIMIT", payload: limit });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const getUrlParams = () => {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category) params.set("category", state.category);
    if (state.sort) params.set("sort", state.sort);
    if (state.order) params.set("order", state.order);
    if (state.page && state.page > 1) params.set("page", state.page.toString());
    if (state.limit && state.limit !== 12)
      params.set("limit", state.limit.toString());
    return params;
  };

  const value: SearchFiltersContextType = {
    state,
    dispatch,
    updateSearch,
    updateCategory,
    updateSort,
    updateOrder,
    updatePage,
    updateLimit,
    resetFilters,
    getUrlParams,
  };

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

// Provider principal que envuelve con Suspense
export function SearchFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<SearchFiltersFallback>{children}</SearchFiltersFallback>}
    >
      <SearchFiltersProviderInner>{children}</SearchFiltersProviderInner>
    </Suspense>
  );
}

export function useSearchFilters() {
  const context = useContext(SearchFiltersContext);
  if (context === undefined) {
    throw new Error(
      "useSearchFilters must be used within a SearchFiltersProvider",
    );
  }
  return context;
}
