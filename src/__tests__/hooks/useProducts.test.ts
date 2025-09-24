import { renderHook } from "@testing-library/react";

// Mock the useDebouncedSearch hook
jest.mock("@/hooks/useDebouncedSearch", () => ({
  useDebouncedSearch: (value: string) => ({
    debouncedValue: value,
    isDebouncing: false,
    cancel: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock the useProducts hook implementation
const mockUseProducts = jest.fn();

// Import the hook after mocking
import { useProducts } from "@/hooks/useProducts";

describe("useProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("should be defined", () => {
    expect(useProducts).toBeDefined();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useProducts({}));

    expect(result.current).toHaveProperty("products");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("totalPages");
    expect(result.current).toHaveProperty("hasNextPage");
    expect(result.current).toHaveProperty("hasPreviousPage");
    expect(result.current).toHaveProperty("refetch");
  });

  it("should handle empty options", () => {
    const { result } = renderHook(() => useProducts({}));

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(true); // Initially loading
    expect(result.current.error).toBeNull();
  });
});
