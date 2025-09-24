export const useDebouncedSearch = jest.fn(
  (value: string, options: { delay?: number } = {}) => ({
    debouncedValue: value,
    isDebouncing: false,
    cancel: jest.fn(),
  })
);
