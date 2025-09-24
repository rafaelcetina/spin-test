import { render, screen } from '@testing-library/react'
import { ProductSkeleton, ProductGridSkeleton } from '@/components/ProductSkeleton'

describe('ProductSkeleton', () => {
  it('renders skeleton elements correctly', () => {
    render(<ProductSkeleton />)

    // Check that skeleton elements are rendered
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders with correct structure', () => {
    render(<ProductSkeleton />)

    // Check for the main card structure using data-slot="card"
    const cards = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'card'
    )
    expect(cards.length).toBeGreaterThan(0)
    const card = cards[0]
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('h-full', 'flex', 'flex-col')
  })

  it('renders image skeleton', () => {
    render(<ProductSkeleton />)

    // Check for image skeleton in header
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders content skeletons', () => {
    render(<ProductSkeleton />)

    // Should have multiple skeleton elements for different content areas
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(5) // Multiple skeleton elements
  })

  it('renders rating skeletons', () => {
    render(<ProductSkeleton />)

    // Check for rating stars skeletons (5 stars)
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    // Should have at least 5 skeletons for rating stars
    expect(skeletons.length).toBeGreaterThanOrEqual(5)
  })

  it('renders footer skeletons', () => {
    render(<ProductSkeleton />)

    // Check for footer skeleton elements
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('ProductGridSkeleton', () => {
  it('renders default number of skeleton items', () => {
    render(<ProductGridSkeleton />)

    // Should render 12 skeleton items by default
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders custom number of skeleton items', () => {
    render(<ProductGridSkeleton count={6} />)

    // Should render 6 skeleton items
    const skeletons = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'skeleton'
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders with correct grid structure', () => {
    render(<ProductGridSkeleton count={4} />)

    // Check for grid container using getAllByRole to handle multiple elements
    const gridContainers = screen.getAllByRole('generic', { hidden: true })
    const gridContainer = gridContainers.find(container => 
      container.classList.contains('grid')
    )
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6')
  })

  it('renders multiple ProductSkeleton components', () => {
    render(<ProductGridSkeleton count={3} />)

    // Should render multiple ProductSkeleton components - check by data-slot="card"
    const cards = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.getAttribute('data-slot') === 'card'
    )
    expect(cards).toHaveLength(3)
  })

  it('handles zero count gracefully', () => {
    render(<ProductGridSkeleton count={0} />)

    // Should render empty grid - use getAllByRole to handle multiple elements
    const gridContainers = screen.getAllByRole('generic', { hidden: true })
    const gridContainer = gridContainers.find(container => 
      container.classList.contains('grid')
    )
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('grid')
  })
})
