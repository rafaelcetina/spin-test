import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "@/hooks/useProducts";
import {
  setupFetchMock,
  resetFetchMock,
  mockFetch,
} from "@/__tests__/__mocks__/fetchMock";

// Mock the useDebouncedSearch hook
jest.mock("@/hooks/useDebouncedSearch", () => ({
  useDebouncedSearch: (value: string) => ({
    debouncedValue: value,
    isDebouncing: false,
    cancel: jest.fn(),
  }),
}));

describe("useProducts", () => {
  beforeEach(() => {
    resetFetchMock();
    jest.clearAllMocks();
  });

  it("fetches products successfully", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(3);
    expect(result.current.error).toBeNull();
    expect(result.current.total).toBe(100);
  });

  it("handles loading state", () => {
    setupFetchMock(mockFetch.delayedSuccess(1000));

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
  });

  it("handles error state", async () => {
    setupFetchMock(mockFetch.error());

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toEqual([]);
  });

  it("handles network error", async () => {
    setupFetchMock(mockFetch.networkError());

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toEqual([]);
  });

  it("constructs correct API URL with all parameters", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 2,
        sort: "price",
        order: "desc",
        limit: 20,
        retries: 3,
        delay: 1000,
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/dummy/products"),
        expect.any(Object)
      );
    });

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const url = fetchCall[0];

    expect(url).toContain("q=iPhone");
    expect(url).toContain("category=smartphones");
    expect(url).toContain("page=2");
    expect(url).toContain("sort=price");
    expect(url).toContain("order=desc");
    expect(url).toContain("limit=20");
    expect(url).toContain("retries=3");
    expect(url).toContain("delay=1000");
  });

  it("omits undefined parameters from URL", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    renderHook(() =>
      useProducts({
        q: undefined,
        category: undefined,
        page: 1,
        sort: undefined,
        order: undefined,
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const url = fetchCall[0];

    expect(url).not.toContain("q=");
    expect(url).not.toContain("category=");
    expect(url).not.toContain("sort=");
    expect(url).not.toContain("order=");
    expect(url).toContain("page=1");
  });

  it("calculates pagination correctly", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 3,
        sort: "price",
        order: "asc",
        limit: 10,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it("handles first page correctly", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
        limit: 10,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("handles last page correctly", async () => {
    // Mock response with last page
    const lastPageResponse = {
      ...mockFetch.productsSuccess(),
      json: () =>
        Promise.resolve({
          products: [],
          total: 30,
          skip: 30,
          limit: 30,
        }),
    };
    setupFetchMock(lastPageResponse);

    const { result } = renderHook(() =>
      useProducts({
        q: "iPhone",
        category: "smartphones",
        page: 2,
        sort: "price",
        order: "asc",
        limit: 30,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("refetches when parameters change", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    const { result, rerender } = renderHook(
      ({ params }) => useProducts(params),
      {
        initialProps: {
          params: {
            q: "iPhone",
            category: "smartphones",
            page: 1,
            sort: "price",
            order: "asc",
          },
        },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change parameters
    rerender({
      params: {
        q: "Samsung",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have made two fetch calls
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("cancels previous request when new one is made", async () => {
    const abortController = new AbortController();
    const abortSpy = jest.spyOn(abortController, "abort");

    // Mock AbortController
    global.AbortController = jest.fn(() => abortController) as any;

    setupFetchMock(mockFetch.delayedSuccess(1000));

    const { rerender } = renderHook(({ params }) => useProducts(params), {
      initialProps: {
        params: {
          q: "iPhone",
          category: "smartphones",
          page: 1,
          sort: "price",
          order: "asc",
        },
      },
    });

    // Change parameters before first request completes
    rerender({
      params: {
        q: "Samsung",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      },
    });

    // Should have aborted the previous request
    expect(abortSpy).toHaveBeenCalled();
  });

  it("caches results for same parameters", async () => {
    setupFetchMock(mockFetch.productsSuccess());

    const { result, rerender } = renderHook(
      ({ params }) => useProducts(params),
      {
        initialProps: {
          params: {
            q: "iPhone",
            category: "smartphones",
            page: 1,
            sort: "price",
            order: "asc",
          },
        },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender with same parameters
    rerender({
      params: {
        q: "iPhone",
        category: "smartphones",
        page: 1,
        sort: "price",
        order: "asc",
      },
    });

    // Should not make another fetch call
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
