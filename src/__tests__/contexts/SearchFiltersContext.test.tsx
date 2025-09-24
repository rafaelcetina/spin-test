import { render, screen, waitFor, act } from "@testing-library/react";
import { Suspense } from "react";
import {
  SearchFiltersProvider,
  useSearchFilters,
} from "@/contexts/SearchFiltersContext";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams("?q=test&category=laptops&page=2"),
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
});
