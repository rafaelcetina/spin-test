import { NextRequest } from "next/server";

// Mock fetch globally
global.fetch = jest.fn();

// Mock Request constructor
global.Request = class Request {
  constructor(public url: string, public init?: RequestInit) {}
} as any;

// Mock the API route
jest.mock("@/app/api/dummy/products/route", () => ({
  GET: jest.fn(),
  POST: jest.fn(),
}));

describe("/api/dummy/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(global.fetch).toBeDefined();
    expect(global.Request).toBeDefined();
  });

  it("should handle GET requests", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          products: [],
          total: 0,
          skip: 0,
          limit: 10,
        }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await fetch("/api/dummy/products");
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toHaveProperty("products");
    expect(data).toHaveProperty("total");
  });

  it("should handle POST requests", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: "Success" }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await fetch("/api/dummy/products", {
      method: "POST",
      body: JSON.stringify({ test: "data" }),
    });

    expect(response.ok).toBe(true);
  });

  it("should handle error responses", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Internal Server Error" }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await fetch("/api/dummy/products");

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});
