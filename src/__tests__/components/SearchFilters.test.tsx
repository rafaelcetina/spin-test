import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchFilters } from '@/components/SearchFilters'
import { SearchFiltersProvider } from '@/contexts/SearchFiltersContext'
import { Category } from '@/types/product'

const mockCategories: Category[] = [
  { slug: "smartphones", name: "Smartphones", url: "/category/smartphones" },
  { slug: "laptops", name: "Laptops", url: "/category/laptops" },
  { slug: "fragrances", name: "Fragrances", url: "/category/fragrances" },
];

// Mock the useProducts hook
jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(() => ({
    products: [],
    loading: false,
    error: null,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    refetch: jest.fn(),
  })),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('SearchFilters', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    render(
      <SearchFiltersProvider>
        <SearchFilters categories={mockCategories} />
      </SearchFiltersProvider>
    )
    
    const searchInput = screen.getByPlaceholderText('Buscar por nombre, marca o descripción...')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders category filter', () => {
    render(
      <SearchFiltersProvider>
        <SearchFilters categories={mockCategories} />
      </SearchFiltersProvider>
    )
    
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThan(0)
  })

  it('renders sort options', () => {
    render(
      <SearchFiltersProvider>
        <SearchFilters categories={mockCategories} />
      </SearchFiltersProvider>
    )
    
    // Should have multiple comboboxes for different filters
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThan(1)
  })

  it('allows typing in search input', async () => {
    render(
      <SearchFiltersProvider>
        <SearchFilters categories={mockCategories} />
      </SearchFiltersProvider>
    )
    
    const searchInput = screen.getByPlaceholderText('Buscar por nombre, marca o descripción...')
    await user.type(searchInput, 'test search')
    
    expect(searchInput).toHaveValue('test search')
  })
})