import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/Pagination";

// Mock the SearchFiltersContext
const mockUpdatePage = jest.fn();
const mockUpdateLimit = jest.fn();

jest.mock("@/contexts/SearchFiltersContext", () => ({
  useSearchFilters: () => ({
    updatePage: mockUpdatePage,
    updateLimit: mockUpdateLimit,
  }),
}));

describe("Pagination", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination controls", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={false}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows current page as active", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("calls updatePage when page is clicked", async () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={false}
      />,
    );

    const pageButton = screen.getByText("2");
    await user.click(pageButton);

    expect(mockUpdatePage).toHaveBeenCalledWith(2);
  });

  it("shows previous button when not on first page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const prevButton = screen.getByLabelText("Ir a la página anterior");
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={false}
      />,
    );

    const prevButton = screen.getByLabelText("Ir a la página anterior");
    expect(prevButton).toBeDisabled();
  });

  it("shows next button when not on last page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const nextButton = screen.getByLabelText("Ir a la página siguiente");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={false}
        hasPreviousPage={true}
      />,
    );

    const nextButton = screen.getByLabelText("Ir a la página siguiente");
    expect(nextButton).toBeDisabled();
  });

  it("calls updatePage with previous page when prev button is clicked", async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const prevButton = screen.getByLabelText("Ir a la página anterior");
    await user.click(prevButton);

    expect(mockUpdatePage).toHaveBeenCalledWith(2);
  });

  it("calls updatePage with next page when next button is clicked", async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const nextButton = screen.getByLabelText("Ir a la página siguiente");
    await user.click(nextButton);

    expect(mockUpdatePage).toHaveBeenCalledWith(4);
  });

  it("shows ellipsis when there are many pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        totalItems={240}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const ellipsisElements = screen.getAllByText("...");
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  it("shows correct page range for current page in middle", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        totalItems={240}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    // Should show pages around current page
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows first and last pages when in middle range", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        totalItems={240}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("handles single page gracefully", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={5}
        itemsPerPage={12}
        hasNextPage={false}
        hasPreviousPage={false}
      />,
    );

    // Should not render anything for single page
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("shows correct items count information", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    expect(
      screen.getByText("Mostrando 25-36 de 120 productos"),
    ).toBeInTheDocument();
  });

  it("handles keyboard navigation", async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const pageButton = screen.getByText("4");
    pageButton.focus();

    await user.keyboard("{Enter}");
    expect(mockUpdatePage).toHaveBeenCalledWith(4);

    await user.keyboard(" ");
    expect(mockUpdatePage).toHaveBeenCalledWith(4);
  });

  it("renders items per page selector", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={false}
      />,
    );

    // Check that the select component is rendered
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();

    // Note: Full interaction testing with Radix UI Select in JSDOM is complex
    // This test verifies the component renders correctly
    // The actual functionality would be tested in integration tests
  });

  it("has proper accessibility attributes", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        totalItems={120}
        itemsPerPage={12}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });
});
