import { render, screen, waitFor } from '@/__tests__/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { ProductsPage } from '@/components/ProductsPage'
import { mockRouter, mockSearchParams } from '@/__tests__/utils/testUtils'

// Mock the useProducts hook
jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(),
}))

const mockUseProducts = require('@/hooks/useProducts').useProducts as jest.Mock

describe('URL Synchronization Integration', () => {
  const user = userEvent.setup()
  let mockPush: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock router
    const routerMocks = mockRouter()
    mockPush = routerMocks.mockPush

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

  it('initializes filters from URL parameters', () => {
    // Mock URL parameters
    mockSearchParams({
      q: 'iPhone',
      category: 'smartphones',
      page: '2',
      sort: 'price',
      order: 'desc',
    })

    render(<ProductsPage />)

    // Verify useProducts was called with URL parameters
    expect(mockUseProducts).toHaveBeenCalledWith({
      q: 'iPhone',
      category: 'smartphones',
      page: 2,
      sort: 'price',
      order: 'desc',
      limit: 12,
      retries: 3,
      delay: 0,
    })
  })

  it('updates URL when search query changes', async () => {
    render(<ProductsPage />)

    const searchInput = screen.getByLabelText('Buscar productos')
    await user.type(searchInput, 'iPhone')

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('q=iPhone')
      )
    })
  })

  it('updates URL when category changes', async () => {
    render(<ProductsPage />)

    const categorySelect = screen.getByRole('combobox', { name: /categoría/i })
    await user.click(categorySelect)
    await user.click(screen.getByText('Smartphones'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('category=smartphones')
      )
    })
  })

  it('updates URL when sort changes', async () => {
    render(<ProductsPage />)

    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)
    await user.click(screen.getByText('Precio'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sort=price')
      )
    })
  })

  it('updates URL when order changes', async () => {
    render(<ProductsPage />)

    // First select sort option
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i })
    await user.click(sortSelect)
    await user.click(screen.getByText('Precio'))

    // Then select order
    const orderSelect = screen.getByRole('combobox', { name: /orden/i })
    await user.click(orderSelect)
    await user.click(screen.getByText('Descendente'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('order=desc')
      )
    })
  })

  it('updates URL when page changes', async () => {
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

    const nextButton = screen.getByLabelText('Página siguiente')
    await user.click(nextButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      )
    })
  })

  it('removes URL parameters when filters are cleared', async () => {
    // Start with URL parameters
    mockSearchParams({
      q: 'iPhone',
      category: 'smartphones',
      page: '2',
      sort: 'price',
      order: 'desc',
    })

    render(<ProductsPage />)

    const clearButton = screen.getByText('Limpiar filtros')
    await user.click(clearButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('maintains URL parameters when navigating between pages', async () => {
    // Start with URL parameters
    mockSearchParams({
      q: 'iPhone',
      category: 'smartphones',
      sort: 'price',
      order: 'desc',
    })

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

    const nextButton = screen.getByLabelText('Página siguiente')
    await user.click(nextButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/q=iPhone.*category=smartphones.*sort=price.*order=desc.*page=2/)
      )
    })
  })

  it('handles invalid URL parameters gracefully', () => {
    // Mock invalid URL parameters
    mockSearchParams({
      q: 'iPhone',
      category: 'invalid-category',
      page: 'invalid-page',
      sort: 'invalid-sort',
      order: 'invalid-order',
    })

    render(<ProductsPage />)

    // Should still render without errors
    expect(screen.getByText('Productos')).toBeInTheDocument()
  })

  it('preserves URL parameters when only some filters change', async () => {
    // Start with URL parameters
    mockSearchParams({
      q: 'iPhone',
      category: 'smartphones',
      page: '2',
      sort: 'price',
      order: 'desc',
    })

    render(<ProductsPage />)

    // Change only the search query
    const searchInput = screen.getByLabelText('Buscar productos')
    await user.clear(searchInput)
    await user.type(searchInput, 'Samsung')

    await waitFor(() => {
      const pushCall = mockPush.mock.calls[mockPush.mock.calls.length - 1][0]
      expect(pushCall).toContain('q=Samsung')
      expect(pushCall).toContain('category=smartphones')
      expect(pushCall).toContain('sort=price')
      expect(pushCall).toContain('order=desc')
      // Page should reset to 1 when search changes
      expect(pushCall).toContain('page=1')
    })
  })

  it('handles empty URL parameters correctly', () => {
    // Mock empty URL parameters
    mockSearchParams({})

    render(<ProductsPage />)

    // Should use default values
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
})
