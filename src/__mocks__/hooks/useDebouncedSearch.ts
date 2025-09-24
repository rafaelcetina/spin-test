export const useDebouncedSearch = jest.fn(
  (value: string, _options: { delay?: number } = {}) => ({
    debouncedValue: value,
    isDebouncing: false,
    cancel: jest.fn(),
  }),
);
