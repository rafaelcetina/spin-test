import { render, screen, waitFor } from '@/__tests__/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { SearchFilters } from '@/components/SearchFilters'
import { mockCategories } from '@/__tests__/__mocks__/mockData'

// Mock the useProducts hook
jest.mock('@/hooks/useProducts', () => ({
  useProducts: () => ({
    products: [],
    loading: false,
    error: null,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    refetch: jest.fn(),
  }),
}))

describe('SearchFilters', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all filter controls', () => {
    render(<SearchFilters categories={mockCategories} />)

    expect(screen.getByLabelText('Buscar productos')).toBeInTheDocument()
    expect(screen.getByText('Categoría')).toBeInTheDocument()
    expect(screen.getByText('Ordenar por')).toBeInTheDocument()
    expect(screen.getByText('Orden')).toBeInTheDocument()
  })

  it('displays all categories in the select', async () => {
    render(<SearchFilters categories={mockCategories} />)

    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)

    // Check that all categories are present
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
    expect(screen.getByText('Smartphones')).toBeInTheDocument()
    expect(screen.getByText('Laptops')).toBeInTheDocument()
    expect(screen.getByText('Fragrances')).toBeInTheDocument()
  })

  it('updates search input when user types', async () => {
    render(<SearchFilters categories={mockCategories} />)

    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    expect(searchInput).toHaveValue('iPhone')
  })

  it('shows clear filters button when filters are active', async () => {
    render(<SearchFilters categories={mockCategories} />)

    // Initially, clear button should not be visible
    expect(screen.queryByText('Limpiar filtros')).not.toBeInTheDocument()

    // Type in search input
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'test')

    // Clear button should now be visible
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', async () => {
    render(<SearchFilters categories={mockCategories} />)

    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'test')

    const clearButton = screen.getByText('Limpiar filtros')
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('disables order select when sort is not selected', () => {
    render(<SearchFilters categories={mockCategories} />)

    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    expect(orderSelect).toBeDisabled()
  })

  it('enables order select when sort is selected', async () => {
    render(<SearchFilters categories={mockCategories} />)

    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)

    const priceOption = screen.getByText('Precio')
    await user.click(priceOption)

    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    expect(orderSelect).not.toBeDisabled()
  })

  it('shows correct sort options', async () => {
    render(<SearchFilters categories={mockCategories} />)

    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)

    expect(screen.getByText('Sin ordenar')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()
    expect(screen.getByText('Título')).toBeInTheDocument()
  })

  it('shows correct order options', async () => {
    render(<SearchFilters categories={mockCategories} />)

    // First select a sort option
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)
    await user.click(screen.getByText('Precio'))

    // Then check order options
    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    await user.click(orderSelect)

    expect(screen.getByText('Seleccionar orden')).toBeInTheDocument()
    expect(screen.getByText('Ascendente')).toBeInTheDocument()
    expect(screen.getByText('Descendente')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<SearchFilters categories={mockCategories} />)

    const searchInput = screen.getByLabelText('Buscar productos')
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-help')

    const clearButton = screen.queryByText('Limpiar filtros')
    if (clearButton) {
      expect(clearButton).toHaveAttribute('aria-label', 'Limpiar todos los filtros')
    }
  })

  it('handles empty categories array gracefully', () => {
    render(<SearchFilters categories={[]} />)

    expect(screen.getByText('Categoría')).toBeInTheDocument()
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
  })

  it('maintains filter state consistency', async () => {
    render(<SearchFilters categories={mockCategories} />)

    // Set a category
    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)
    await user.click(screen.getByText('Smartphones'))

    // Set a sort option
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)
    await user.click(screen.getByText('Precio'))

    // Set an order
    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    await user.click(orderSelect)
    await user.click(screen.getByText('Ascendente'))

    // Verify all selections are maintained
    expect(categorySelect).toHaveTextContent('Smartphones')
    expect(sortSelect).toHaveTextContent('Precio')
    expect(orderSelect).toHaveTextContent('Ascendente')
  })
})
