import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductsPage } from "@/components/ProductsPage";
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

describe("Search Flow Integration", () => {
  const _user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ProductsPage component", () => {
    render(
      <SearchFiltersProvider>
        <ProductsPage />
      </SearchFiltersProvider>,
    );

    expect(screen.getByText("Filtros de búsqueda")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(
      <SearchFiltersProvider>
        <ProductsPage />
      </SearchFiltersProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Buscar por nombre, marca o descripción...",
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("renders category filter", () => {
    render(
      <SearchFiltersProvider>
        <ProductsPage />
      </SearchFiltersProvider>,
    );

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThan(0);
  });
});
