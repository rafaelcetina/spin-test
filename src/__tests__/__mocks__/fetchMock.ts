import { mockProductsResponse, mockCategories, mockApiError } from "./mockData";

// Mock fetch responses
export const mockFetch = {
  // Successful products response
  productsSuccess: () => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockProductsResponse),
    });
  },

  // Successful categories response
  categoriesSuccess: () => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCategories),
    });
  },

  // Error response
  error: () => {
    return Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve(mockApiError),
    });
  },

  // Network error
  networkError: () => {
    return Promise.reject(new Error("Network error"));
  },

  // Delayed response for testing debounce
  delayedSuccess: (delay = 1000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockProductsResponse),
        });
      }, delay);
    });
  },
};

// Helper to setup fetch mock
export const setupFetchMock = (response: any) => {
  (global.fetch as jest.Mock).mockImplementation(() => response);
};

// Helper to reset fetch mock
export const resetFetchMock = () => {
  (global.fetch as jest.Mock).mockReset();
};

// Helper to verify fetch was called with specific parameters
export const verifyFetchCall = (url: string, options?: RequestInit) => {
  expect(global.fetch).toHaveBeenCalledWith(url, options);
};

// Helper to get fetch call arguments
export const getFetchCallArgs = (callIndex = 0) => {
  const calls = (global.fetch as jest.Mock).mock.calls;
  return calls[callIndex] || [];
};
