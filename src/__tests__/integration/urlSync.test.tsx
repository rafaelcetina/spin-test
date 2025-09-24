import { render, screen } from "@testing-library/react";
import { SearchFiltersProvider } from "@/contexts/SearchFiltersContext";

// Mock the useProducts hook
jest.mock("@/hooks/useProducts", () => ({
  useProducts: jest.fn(() => ({
    products: [],
    loading: false,
    error: null,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    refetch: jest.fn(),
  })),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

describe("URL Sync Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SearchFiltersProvider", () => {
    render(
      <SearchFiltersProvider>
        <div>Test content</div>
      </SearchFiltersProvider>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
