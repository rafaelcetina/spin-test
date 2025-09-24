import { render, screen } from '@/__tests__/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/components/Pagination'

describe('Pagination', () => {
  const user = userEvent.setup()
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows current page as active', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    expect(currentPageButton).toHaveClass('bg-primary')
  })

  it('calls onPageChange when page is clicked', async () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const pageButton = screen.getByText('2')
    await user.click(pageButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('shows previous button when not on first page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const prevButton = screen.getByLabelText('Ir a la página anterior')
    expect(prevButton).toBeInTheDocument()
    expect(prevButton).not.toBeDisabled()
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const prevButton = screen.getByLabelText('Ir a la página anterior')
    expect(prevButton).toBeDisabled()
  })

  it('shows next button when not on last page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const nextButton = screen.getByLabelText('Ir a la página siguiente')
    expect(nextButton).toBeInTheDocument()
    expect(nextButton).not.toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const nextButton = screen.getByLabelText('Ir a la página siguiente')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange with previous page when prev button is clicked', async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const prevButton = screen.getByLabelText('Ir a la página anterior')
    await user.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when next button is clicked', async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const nextButton = screen.getByLabelText('Ir a la página siguiente')
    await user.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('shows ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={240}
      />
    )

    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('shows correct page range for current page in middle', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={240}
      />
    )

    // Should show pages around current page
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('shows first and last pages when in middle range', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={240}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('handles single page gracefully', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={5}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Ir a la página anterior')).toBeDisabled()
    expect(screen.getByLabelText('Ir a la página siguiente')).toBeDisabled()
  })

  it('shows correct items count information', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    expect(screen.getByText('Mostrando 25-36 de 120 productos')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const pageButton = screen.getByText('4')
    pageButton.focus()

    await user.keyboard('{Enter}')
    expect(mockOnPageChange).toHaveBeenCalledWith(4)

    await user.keyboard(' ')
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('has proper accessibility attributes', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={12}
        totalItems={120}
      />
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Paginación de productos')

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })
})
