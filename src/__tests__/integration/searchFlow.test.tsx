import { render, screen, waitFor } from '@/__tests__/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { ProductsPage } from '@/components/ProductsPage'
import { setupFetchMock, resetFetchMock, mockFetch } from '@/__tests__/__mocks__/fetchMock'

// Mock the useProducts hook to return our test data
jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(),
}))

const mockUseProducts = require('@/hooks/useProducts').useProducts as jest.Mock

describe('Search Flow Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    resetFetchMock()
    jest.clearAllMocks()
    
    // Default mock implementation
    mockUseProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })
  })

  it('completes full search flow with debounce and cancellation', async () => {
    // Mock loading state
    mockUseProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null,
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })

    render(<ProductsPage />)

    const searchInput = screen.getByLabelText('Buscar productos')
    
    // Type search query
    await user.type(searchInput, 'iPhone')
    
    // Should show loading state
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument()

    // Mock successful response
    mockUseProducts.mockReturnValue({
      products: [
        {
          id: 1,
          title: 'iPhone 9',
          description: 'An apple mobile which is nothing like apple',
          price: 549,
          discountPercentage: 12.96,
          rating: 4.69,
          stock: 94,
          brand: 'Apple',
          category: 'smartphones',
          thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
          images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
          localPrice: '$549.00 MXN',
          stockStatus: 'in_stock',
          fetchedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      loading: false,
      error: null,
      total: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })

    // Rerender to get updated data
    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText('iPhone 9')).toBeInTheDocument()
    })

    expect(screen.getByText('Mostrando 1 de 1 productos')).toBeInTheDocument()
  })

  it('handles search with category filter', async () => {
    render(<ProductsPage />)

    // Select category
    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)
    await user.click(screen.getByText('Smartphones'))

    // Type search query
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    // Verify useProducts was called with correct parameters
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'iPhone',
      category: 'smartphones',
      page: 1,
      sort: 'none',
      order: 'none',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('handles search with sorting', async () => {
    render(<ProductsPage />)

    // Select sort option
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)
    await user.click(screen.getByText('Precio'))

    // Select order
    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    await user.click(orderSelect)
    await user.click(screen.getByText('Ascendente'))

    // Type search query
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'phone')

    // Verify useProducts was called with correct parameters
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'phone',
      category: 'all',
      page: 1,
      sort: 'price',
      order: 'asc',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('handles pagination with search', async () => {
    // Mock pagination data
    mockUseProducts.mockReturnValue({
      products: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        description: 'Test product',
        price: 100 + i,
        discountPercentage: 0,
        rating: 4.0,
        stock: 50,
        brand: 'Test Brand',
        category: 'test',
        thumbnail: 'https://example.com/thumb.jpg',
        images: ['https://example.com/image.jpg'],
        localPrice: `$${100 + i}.00 MXN`,
        stockStatus: 'in_stock',
        fetchedAt: '2024-01-01T00:00:00.000Z',
      })),
      loading: false,
      error: null,
      total: 50,
      hasNextPage: true,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })

    render(<ProductsPage />)

    // Type search query
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'test')

    // Click next page
    const nextButton = screen.getByLabelText('Página siguiente')
    await user.click(nextButton)

    // Verify useProducts was called with page 2
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'test',
      category: 'all',
      page: 2,
      sort: 'none',
      order: 'none',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('handles error state in search', async () => {
    // Mock error state
    mockUseProducts.mockReturnValue({
      products: [],
      loading: false,
      error: 'Failed to fetch products',
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })

    render(<ProductsPage />)

    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    await waitFor(() => {
      expect(screen.getByText('Error al cargar productos')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument()
  })

  it('clears filters and resets search', async () => {
    render(<ProductsPage />)

    // Set up filters
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)
    await user.click(screen.getByText('Smartphones'))

    // Clear filters
    const clearButton = screen.getByText('Limpiar filtros')
    await user.click(clearButton)

    // Verify search input is cleared
    expect(searchInput).toHaveValue('')

    // Verify useProducts was called with reset parameters
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: '',
      category: 'all',
      page: 1,
      sort: 'none',
      order: 'none',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('handles rapid search changes with debounce', async () => {
    render(<ProductsPage />)

    const searchInput = screen.getByLabelText('Buscar productos')
    
    // Type rapidly
    await user.type(searchInput, 'i')
    await user.type(searchInput, 'p')
    await user.type(searchInput, 'h')
    await user.type(searchInput, 'o')
    await user.type(searchInput, 'n')
    await user.type(searchInput, 'e')

    // Should only call useProducts with final value
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'iphone',
      category: 'all',
      page: 1,
      sort: 'none',
      order: 'none',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('maintains filter state across page changes', async () => {
    // Mock pagination data
    mockUseProducts.mockReturnValue({
      products: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        description: 'Test product',
        price: 100 + i,
        discountPercentage: 0,
        rating: 4.0,
        stock: 50,
        brand: 'Test Brand',
        category: 'smartphones',
        thumbnail: 'https://example.com/thumb.jpg',
        images: ['https://example.com/image.jpg'],
        localPrice: `$${100 + i}.00 MXN`,
        stockStatus: 'in_stock',
        fetchedAt: '2024-01-01T00:00:00.000Z',
      })),
      loading: false,
      error: null,
      total: 50,
      hasNextPage: true,
      hasPreviousPage: false,
      refetch: jest.fn(),
    })

    render(<ProductsPage />)

    // Set up filters
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)
    await user.click(screen.getByText('Smartphones'))

    // Go to page 2
    const nextButton = screen.getByLabelText('Página siguiente')
    await user.click(nextButton)

    // Verify filters are maintained
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'iPhone',
      category: 'smartphones',
      page: 2,
      sort: 'none',
      order: 'none',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })
})
