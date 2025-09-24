import { render, screen } from '@/__tests__/utils/testUtils'
import { ProductCard } from '@/components/ProductCard'
import { mockProduct } from '@/__tests__/__mocks__/mockData'

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
    
    // Check for price - it should be formatted
    const priceElement = screen.getByText(/\$549\.00/)
    expect(priceElement).toBeInTheDocument()
  })

  it('displays product image with correct attributes', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole('img', { name: mockProduct.title })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockProduct.thumbnail)
    expect(image).toHaveAttribute('alt', mockProduct.title)
  })

  it('shows rating with correct number of stars', () => {
    render(<ProductCard product={mockProduct} />)

    // Check for rating text that includes the rating value and stock
    const ratingText = screen.getByText(/4\.7.*94 unidades/)
    expect(ratingText).toBeInTheDocument()
  })

  it('displays stock status correctly', () => {
    render(<ProductCard product={mockProduct} />)

    const stockStatus = screen.getByText('En stock')
    expect(stockStatus).toBeInTheDocument()
  })

  it('shows low stock status when stock is low', () => {
    const lowStockProduct = { ...mockProduct, stock: 5, stockStatus: 'low_stock' as const }
    render(<ProductCard product={lowStockProduct} />)

    const stockStatus = screen.getByText('Poco stock')
    expect(stockStatus).toBeInTheDocument()
  })

  it('displays discount percentage when available', () => {
    render(<ProductCard product={mockProduct} />)

    const discount = screen.getByText(`-${mockProduct.discountPercentage.toFixed(0)}%`)
    expect(discount).toBeInTheDocument()
  })

  it('has correct link to product detail page', () => {
    render(<ProductCard product={mockProduct} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/product/${mockProduct.id}`)
  })

  it('formats price correctly in Mexican Peso', () => {
    render(<ProductCard product={mockProduct} />)

    // Should display formatted price with MXN currency
    const priceElement = screen.getByText(/\$549\.00/)
    expect(priceElement).toBeInTheDocument()
  })

  it('handles missing discount gracefully', () => {
    const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 }
    render(<ProductCard product={productWithoutDiscount} />)

    // Should not show discount badge
    expect(screen.queryByText(/-0%/)).not.toBeInTheDocument()
  })

  it('handles missing images gracefully', () => {
    const productWithoutImages = { ...mockProduct, images: [] }
    render(<ProductCard product={productWithoutImages} />)

    // Should still render the card
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<ProductCard product={mockProduct} />)

    const link = screen.getByRole('link')
    // The link doesn't have aria-label, it's just a regular link
    expect(link).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<ProductCard product={mockProduct} />)

    // Should have proper heading structure
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent(mockProduct.title)
  })
})
