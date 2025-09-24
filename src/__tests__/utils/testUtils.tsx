import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SearchFiltersProvider } from '@/contexts/SearchFiltersContext'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <SearchFiltersProvider>{children}</SearchFiltersProvider>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Helper to wait for async operations
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0))

// Helper to advance timers
export const advanceTimers = (ms: number) => {
  jest.advanceTimersByTime(ms)
}

// Helper to mock URLSearchParams
export const mockSearchParams = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params)
  jest.mocked(require('next/navigation').useSearchParams).mockReturnValue(searchParams)
}

// Helper to mock router
export const mockRouter = (routerOverrides = {}) => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()
  const mockPrefetch = jest.fn()
  const mockBack = jest.fn()
  const mockForward = jest.fn()
  const mockRefresh = jest.fn()

  jest.mocked(require('next/navigation').useRouter).mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    ...routerOverrides,
  })

  return {
    mockPush,
    mockReplace,
    mockPrefetch,
    mockBack,
    mockForward,
    mockRefresh,
  }
}

// Helper to create mock product
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  category: 'test-category',
  thumbnail: 'https://example.com/thumbnail.jpg',
  images: ['https://example.com/image1.jpg'],
  localPrice: '$100.00 MXN',
  stockStatus: 'in_stock',
  fetchedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

// Helper to create mock products response
export const createMockProductsResponse = (products = [], overrides = {}) => ({
  products,
  total: products.length,
  skip: 0,
  limit: 30,
  ...overrides,
})

// Helper to simulate user typing with debounce
export const simulateTyping = async (input: HTMLElement, text: string, user: any) => {
  await user.type(input, text)
  // Wait for debounce
  await waitForAsync()
  advanceTimers(500)
  await waitForAsync()
}

// Helper to simulate select change
export const simulateSelectChange = async (select: HTMLElement, value: string, user: any) => {
  await user.click(select)
  const option = document.querySelector(`[data-value="${value}"]`)
  if (option) {
    await user.click(option)
  }
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
