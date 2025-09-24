module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/*.spec.{js,jsx,ts,tsx}",
    "!src/__tests__/**",
    "!src/**/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for critical components
    "./src/components/": {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    "./src/hooks/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/contexts/": {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: ["text", "lcov", "html", "json"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  verbose: true,
};
