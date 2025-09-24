import "@testing-library/jest-dom";

// Mocks are automatically loaded from __mocks__ directories

// Mock fetch globally
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
