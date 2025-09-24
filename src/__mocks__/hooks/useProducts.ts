export const useProducts = jest.fn(() => ({
  products: [],
  loading: false,
  error: null,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  refetch: jest.fn(),
}));
