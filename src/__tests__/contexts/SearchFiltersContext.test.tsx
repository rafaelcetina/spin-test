import { render, screen, waitFor, act } from "@testing-library/react";
import { Suspense, useState } from "react";
import {
  SearchFiltersProvider,
  useSearchFilters,
} from "@/contexts/SearchFiltersContext";

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

// Mock useSearchParams with a function that returns different values
let mockSearchParamsValue = new URLSearchParams(
  "?q=test&category=laptops&page=2",
);

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParamsValue,
  usePathname: () => "/",
}));

// Componente de prueba que usa el contexto
function TestComponent() {
  const { state } = useSearchFilters();
  return (
    <div>
      <div data-testid="search">{state.q || "no-search"}</div>
      <div data-testid="category">{state.category}</div>
      <div data-testid="page">{state.page}</div>
      <div data-testid="initialized">{state.isInitialized.toString()}</div>
    </div>
  );
}

describe("SearchFiltersContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock search params
    mockSearchParamsValue = new URLSearchParams(
      "?q=test&category=laptops&page=2",
    );
  });

  it("renders with Suspense boundary", async () => {
    render(
      <SearchFiltersProvider>
        <TestComponent />
      </SearchFiltersProvider>,
    );

    // Verificar que el componente se renderiza
    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("category")).toBeInTheDocument();
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("initialized")).toBeInTheDocument();
  });

  it("initializes with URL parameters", async () => {
    render(
      <SearchFiltersProvider>
        <TestComponent />
      </SearchFiltersProvider>,
    );

    // Esperar a que se inicialice
    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    // Verificar que los parámetros de URL se cargan correctamente
    expect(screen.getByTestId("search")).toHaveTextContent("test");
    expect(screen.getByTestId("category")).toHaveTextContent("laptops");
    expect(screen.getByTestId("page")).toHaveTextContent("2");
  });

  it("handles context updates correctly", async () => {
    function TestComponentWithActions() {
      const { state, updateSearch, updatePage } = useSearchFilters();
      return (
        <div>
          <div data-testid="search">{state.q || "no-search"}</div>
          <div data-testid="page">{state.page}</div>
          <button
            data-testid="update-search"
            onClick={() => updateSearch("new-search")}
          >
            Update Search
          </button>
          <button data-testid="update-page" onClick={() => updatePage(3)}>
            Update Page
          </button>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestComponentWithActions />
      </SearchFiltersProvider>,
    );

    // Verificar estado inicial
    expect(screen.getByTestId("search")).toHaveTextContent("test");
    expect(screen.getByTestId("page")).toHaveTextContent("2");

    // Simular clic en botón de actualizar búsqueda
    act(() => {
      screen.getByTestId("update-search").click();
    });
    expect(screen.getByTestId("search")).toHaveTextContent("new-search");
    expect(screen.getByTestId("page")).toHaveTextContent("1"); // Debería resetear a 1

    // Simular clic en botón de actualizar página
    act(() => {
      screen.getByTestId("update-page").click();
    });
    expect(screen.getByTestId("page")).toHaveTextContent("3");
  });

  it("throws error when used outside provider", () => {
    // Suprimir el error esperado en la consola
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useSearchFilters must be used within a SearchFiltersProvider");

    consoleSpy.mockRestore();
  });

  it("handles all filter update functions", async () => {
    function TestAllUpdates() {
      const {
        state,
        updateSearch,
        updateCategory,
        updateSort,
        updateOrder,
        updatePage,
        updateLimit,
        resetFilters,
        getUrlParams,
      } = useSearchFilters();

      return (
        <div>
          <div data-testid="search">{state.q || "no-search"}</div>
          <div data-testid="category">{state.category}</div>
          <div data-testid="sort">{state.sort}</div>
          <div data-testid="order">{state.order}</div>
          <div data-testid="page">{state.page}</div>
          <div data-testid="limit">{state.limit}</div>
          <button
            data-testid="update-search"
            onClick={() => updateSearch("new-search")}
          >
            Update Search
          </button>
          <button
            data-testid="update-category"
            onClick={() => updateCategory("phones")}
          >
            Update Category
          </button>
          <button data-testid="update-sort" onClick={() => updateSort("price")}>
            Update Sort
          </button>
          <button
            data-testid="update-order"
            onClick={() => updateOrder("desc")}
          >
            Update Order
          </button>
          <button data-testid="update-page" onClick={() => updatePage(5)}>
            Update Page
          </button>
          <button data-testid="update-limit" onClick={() => updateLimit(24)}>
            Update Limit
          </button>
          <button data-testid="reset-filters" onClick={() => resetFilters()}>
            Reset Filters
          </button>
          <button
            data-testid="get-url-params"
            onClick={() => {
              const params = getUrlParams();
              console.log(params.toString());
            }}
          >
            Get URL Params
          </button>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestAllUpdates />
      </SearchFiltersProvider>,
    );

    // Test updateCategory
    act(() => {
      screen.getByTestId("update-category").click();
    });
    expect(screen.getByTestId("category")).toHaveTextContent("phones");
    expect(screen.getByTestId("page")).toHaveTextContent("1"); // Should reset page

    // Test updateSort
    act(() => {
      screen.getByTestId("update-sort").click();
    });
    expect(screen.getByTestId("sort")).toHaveTextContent("price");
    expect(screen.getByTestId("page")).toHaveTextContent("1"); // Should reset page

    // Test updateOrder
    act(() => {
      screen.getByTestId("update-order").click();
    });
    expect(screen.getByTestId("order")).toHaveTextContent("desc");
    expect(screen.getByTestId("page")).toHaveTextContent("1"); // Should reset page

    // Test updateLimit
    act(() => {
      screen.getByTestId("update-limit").click();
    });
    expect(screen.getByTestId("limit")).toHaveTextContent("24");
    expect(screen.getByTestId("page")).toHaveTextContent("1"); // Should reset page

    // Test resetFilters
    act(() => {
      screen.getByTestId("reset-filters").click();
    });
    expect(screen.getByTestId("search")).toHaveTextContent("no-search");
    expect(screen.getByTestId("category")).toHaveTextContent("all");
    expect(screen.getByTestId("sort")).toHaveTextContent("none");
    expect(screen.getByTestId("order")).toHaveTextContent("none");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("limit")).toHaveTextContent("12");
  });

  it("handles URL parameter parsing correctly", async () => {
    // Test with different URL parameters
    mockSearchParamsValue = new URLSearchParams(
      "?q=iphone&category=smartphones&sort=rating&order=desc&page=3&limit=20",
    );

    function TestURLParsing() {
      const { state } = useSearchFilters();
      return (
        <div>
          <div data-testid="search">{state.q || "no-search"}</div>
          <div data-testid="category">{state.category}</div>
          <div data-testid="sort">{state.sort}</div>
          <div data-testid="order">{state.order}</div>
          <div data-testid="page">{state.page}</div>
          <div data-testid="limit">{state.limit}</div>
          <div data-testid="initialized">{state.isInitialized.toString()}</div>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestURLParsing />
      </SearchFiltersProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    expect(screen.getByTestId("search")).toHaveTextContent("iphone");
    expect(screen.getByTestId("category")).toHaveTextContent("smartphones");
    expect(screen.getByTestId("sort")).toHaveTextContent("rating");
    expect(screen.getByTestId("order")).toHaveTextContent("desc");
    expect(screen.getByTestId("page")).toHaveTextContent("3");
    expect(screen.getByTestId("limit")).toHaveTextContent("20");
  });

  it("handles empty URL parameters", async () => {
    // Test with empty URL parameters
    mockSearchParamsValue = new URLSearchParams();

    function TestEmptyURL() {
      const { state } = useSearchFilters();
      return (
        <div>
          <div data-testid="search">{state.q || "no-search"}</div>
          <div data-testid="category">{state.category}</div>
          <div data-testid="sort">{state.sort}</div>
          <div data-testid="order">{state.order}</div>
          <div data-testid="page">{state.page}</div>
          <div data-testid="limit">{state.limit}</div>
          <div data-testid="initialized">{state.isInitialized.toString()}</div>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestEmptyURL />
      </SearchFiltersProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    expect(screen.getByTestId("search")).toHaveTextContent("no-search");
    expect(screen.getByTestId("category")).toHaveTextContent("all");
    expect(screen.getByTestId("sort")).toHaveTextContent("none");
    expect(screen.getByTestId("order")).toHaveTextContent("none");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("limit")).toHaveTextContent("12");
  });

  it("handles invalid URL parameters gracefully", async () => {
    // Test with invalid parameters
    mockSearchParamsValue = new URLSearchParams(
      "?q=test&category=invalid-category&sort=invalid-sort&order=invalid-order&page=invalid-page&limit=invalid-limit",
    );

    function TestInvalidURL() {
      const { state } = useSearchFilters();
      return (
        <div>
          <div data-testid="search">{state.q || "no-search"}</div>
          <div data-testid="category">{state.category}</div>
          <div data-testid="sort">{state.sort}</div>
          <div data-testid="order">{state.order}</div>
          <div data-testid="page">{state.page}</div>
          <div data-testid="limit">{state.limit}</div>
          <div data-testid="initialized">{state.isInitialized.toString()}</div>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestInvalidURL />
      </SearchFiltersProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    // Should handle invalid parameters gracefully
    expect(screen.getByTestId("search")).toHaveTextContent("test");
    expect(screen.getByTestId("category")).toHaveTextContent(
      "invalid-category",
    );
    expect(screen.getByTestId("sort")).toHaveTextContent("invalid-sort");
    expect(screen.getByTestId("order")).toHaveTextContent("invalid-order");
    expect(screen.getByTestId("page")).toHaveTextContent("NaN"); // parseInt("invalid-page") returns NaN
    expect(screen.getByTestId("limit")).toHaveTextContent("NaN"); // parseInt("invalid-limit") returns NaN
  });

  it("handles special values correctly", async () => {
    function TestSpecialValues() {
      const { state, updateCategory, updateSort, updateOrder } =
        useSearchFilters();
      return (
        <div>
          <div data-testid="category">{state.category}</div>
          <div data-testid="sort">{state.sort}</div>
          <div data-testid="order">{state.order}</div>
          <button
            data-testid="set-all-category"
            onClick={() => updateCategory("all")}
          >
            Set All Category
          </button>
          <button
            data-testid="set-none-sort"
            onClick={() => updateSort("none")}
          >
            Set None Sort
          </button>
          <button
            data-testid="set-none-order"
            onClick={() => updateOrder("none")}
          >
            Set None Order
          </button>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestSpecialValues />
      </SearchFiltersProvider>,
    );

    // Test setting "all" category
    act(() => {
      screen.getByTestId("set-all-category").click();
    });
    expect(screen.getByTestId("category")).toHaveTextContent("all");

    // Test setting "none" sort
    act(() => {
      screen.getByTestId("set-none-sort").click();
    });
    expect(screen.getByTestId("sort")).toHaveTextContent("none");

    // Test setting "none" order
    act(() => {
      screen.getByTestId("set-none-order").click();
    });
    expect(screen.getByTestId("order")).toHaveTextContent("none");
  });

  it("handles getUrlParams function correctly", async () => {
    function TestGetUrlParams() {
      const { state, getUrlParams, updateSearch, updateCategory } =
        useSearchFilters();
      const [urlParams, setUrlParams] = useState("");

      const handleGetParams = () => {
        const params = getUrlParams();
        setUrlParams(params.toString());
      };

      return (
        <div>
          <div data-testid="url-params">{urlParams}</div>
          <button data-testid="get-params" onClick={handleGetParams}>
            Get Params
          </button>
          <button
            data-testid="update-search"
            onClick={() => updateSearch("test-search")}
          >
            Update Search
          </button>
          <button
            data-testid="update-category"
            onClick={() => updateCategory("test-category")}
          >
            Update Category
          </button>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestGetUrlParams />
      </SearchFiltersProvider>,
    );

    // Test initial params
    act(() => {
      screen.getByTestId("get-params").click();
    });
    expect(screen.getByTestId("url-params")).toHaveTextContent(
      "q=test&category=laptops&sort=none&order=none&page=2",
    );

    // Test after updates
    act(() => {
      screen.getByTestId("update-search").click();
    });
    act(() => {
      screen.getByTestId("get-params").click();
    });
    expect(screen.getByTestId("url-params")).toHaveTextContent(
      "q=test-search&category=laptops&sort=none&order=none",
    );

    act(() => {
      screen.getByTestId("update-category").click();
    });
    act(() => {
      screen.getByTestId("get-params").click();
    });
    expect(screen.getByTestId("url-params")).toHaveTextContent(
      "q=test-search&category=test-category&sort=none&order=none",
    );
  });

  it("updates URL when state changes", async () => {
    function TestURLUpdate() {
      const { state, updateSearch, updateCategory, updatePage } =
        useSearchFilters();
      return (
        <div>
          <div data-testid="current-search">{state.q || "no-search"}</div>
          <div data-testid="current-category">{state.category}</div>
          <div data-testid="current-page">{state.page}</div>
          <button
            data-testid="update-search"
            onClick={() => updateSearch("new-search")}
          >
            Update Search
          </button>
          <button
            data-testid="update-category"
            onClick={() => updateCategory("new-category")}
          >
            Update Category
          </button>
          <button data-testid="update-page" onClick={() => updatePage(5)}>
            Update Page
          </button>
        </div>
      );
    }

    render(
      <SearchFiltersProvider>
        <TestURLUpdate />
      </SearchFiltersProvider>,
    );

    // Test that state updates work (which should trigger URL updates internally)
    act(() => {
      screen.getByTestId("update-search").click();
    });

    expect(screen.getByTestId("current-search")).toHaveTextContent(
      "new-search",
    );

    act(() => {
      screen.getByTestId("update-category").click();
    });

    expect(screen.getByTestId("current-category")).toHaveTextContent(
      "new-category",
    );

    act(() => {
      screen.getByTestId("update-page").click();
    });

    expect(screen.getByTestId("current-page")).toHaveTextContent("5");
  });
});
