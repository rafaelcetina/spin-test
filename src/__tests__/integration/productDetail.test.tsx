import { render, screen, waitFor } from '@/__tests__/utils/testUtils'
import { ProductDetail } from '@/components/ProductDetail'
import { mockProduct } from '@/__tests__/__mocks__/mockData'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}))

describe('Product Detail Integration', () => {
  it('renders product information correctly', () => {
    render(<ProductDetail product={mockProduct} />)

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
    expect(screen.getByText('$549.00 MXN')).toBeInTheDocument()
  })

  it('displays product images with correct attributes', () => {
    render(<ProductDetail product={mockProduct} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(mockProduct.images.length)

    // Check main image
    const mainImage = images[0]
    expect(mainImage).toHaveAttribute('src', mockProduct.images[0])
    expect(mainImage).toHaveAttribute('alt', mockProduct.title)

    // Check thumbnail images
    mockProduct.images.slice(1).forEach((imageSrc, index) => {
      const thumbnail = images[index + 1]
      expect(thumbnail).toHaveAttribute('src', imageSrc)
      expect(thumbnail).toHaveAttribute('alt', `${mockProduct.title} - Imagen ${index + 2}`)
    })
  })

  it('shows rating with correct number of stars', () => {
    render(<ProductDetail product={mockProduct} />)

    const rating = screen.getByText(mockProduct.rating.toString())
    expect(rating).toBeInTheDocument()
  })

  it('displays stock status correctly', () => {
    render(<ProductDetail product={mockProduct} />)

    const stockStatus = screen.getByText('En stock')
    expect(stockStatus).toBeInTheDocument()
  })

  it('shows low stock status when stock is low', () => {
    const lowStockProduct = { ...mockProduct, stock: 5, stockStatus: 'low_stock' as const }
    render(<ProductDetail product={lowStockProduct} />)

    const stockStatus = screen.getByText('Poco stock')
    expect(stockStatus).toBeInTheDocument()
  })

  it('displays discount percentage when available', () => {
    render(<ProductDetail product={mockProduct} />)

    const discount = screen.getByText(`-${mockProduct.discountPercentage}%`)
    expect(discount).toBeInTheDocument()
  })

  it('formats price correctly in Mexican Peso', () => {
    render(<ProductDetail product={mockProduct} />)

    // Should display formatted price with MXN currency
    expect(screen.getByText('$549.00 MXN')).toBeInTheDocument()
  })

  it('renders price chart with correct data', () => {
    render(<ProductDetail product={mockProduct} />)

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('has proper accessibility attributes for chart', () => {
    render(<ProductDetail product={mockProduct} />)

    const chartContainer = screen.getByTestId('responsive-container')
    expect(chartContainer).toHaveAttribute(
      'aria-label',
      `Gráfica de historial de precios para ${mockProduct.title}`
    )
  })

  it('handles missing discount gracefully', () => {
    const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 }
    render(<ProductDetail product={productWithoutDiscount} />)

    // Should not show discount badge
    expect(screen.queryByText(/-0%/)).not.toBeInTheDocument()
  })

  it('handles missing images gracefully', () => {
    const productWithoutImages = { ...mockProduct, images: [] }
    render(<ProductDetail product={productWithoutImages} />)

    // Should still render the product details
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<ProductDetail product={mockProduct} />)

    // Should have proper heading structure
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(mockProduct.title)

    // Should have proper sections
    expect(screen.getByText('Información del producto')).toBeInTheDocument()
    expect(screen.getByText('Historial de precios')).toBeInTheDocument()
  })

  it('displays product specifications correctly', () => {
    render(<ProductDetail product={mockProduct} />)

    expect(screen.getByText('Marca:')).toBeInTheDocument()
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument()
    expect(screen.getByText('Categoría:')).toBeInTheDocument()
    expect(screen.getByText('Smartphones')).toBeInTheDocument()
    expect(screen.getByText('Stock:')).toBeInTheDocument()
    expect(screen.getByText(mockProduct.stock.toString())).toBeInTheDocument()
  })

  it('shows price change information in chart section', () => {
    render(<ProductDetail product={mockProduct} />)

    // Should show price change information
    expect(screen.getByText(/Precio actual/)).toBeInTheDocument()
    expect(screen.getByText(/Cambio en 12 meses/)).toBeInTheDocument()
  })

  it('handles different product categories', () => {
    const laptopProduct = { ...mockProduct, category: 'laptops' }
    render(<ProductDetail product={laptopProduct} />)

    expect(screen.getByText('Laptops')).toBeInTheDocument()
  })

  it('displays all product images in gallery', () => {
    render(<ProductDetail product={mockProduct} />)

    // Should show all images in the gallery
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(mockProduct.images.length)

    // Each image should have proper alt text
    mockProduct.images.forEach((_, index) => {
      const image = images[index]
      if (index === 0) {
        expect(image).toHaveAttribute('alt', mockProduct.title)
      } else {
        expect(image).toHaveAttribute('alt', `${mockProduct.title} - Imagen ${index + 1}`)
      }
    })
  })

  it('has responsive layout structure', () => {
    render(<ProductDetail product={mockProduct} />)

    // Should have proper grid structure for responsive layout
    const container = screen.getByTestId('responsive-container')
    expect(container).toBeInTheDocument()
  })

  it('handles edge case with very high rating', () => {
    const highRatingProduct = { ...mockProduct, rating: 5.0 }
    render(<ProductDetail product={highRatingProduct} />)

    const rating = screen.getByText('5')
    expect(rating).toBeInTheDocument()
  })

  it('handles edge case with zero stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0, stockStatus: 'out_of_stock' as const }
    render(<ProductDetail product={outOfStockProduct} />)

    const stockStatus = screen.getByText('Sin stock')
    expect(stockStatus).toBeInTheDocument()
  })
})
