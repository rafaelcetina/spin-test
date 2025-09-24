import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/dummy/products/route";

// Mock fetch for external API calls
global.fetch = jest.fn();

// Mock Request constructor
global.Request = class Request {
  constructor(public url: string, public init?: RequestInit) {}
} as any;

describe("/api/dummy/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/dummy/products", () => {
    it("fetches products successfully", async () => {
      const mockResponse = {
        products: [
          {
            id: 1,
            title: "iPhone 9",
            description: "An apple mobile which is nothing like apple",
            price: 549,
            discountPercentage: 12.96,
            rating: 4.69,
            stock: 94,
            brand: "Apple",
            category: "smartphones",
            thumbnail:
              "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
            images: ["https://cdn.dummyjson.com/product-images/1/1.jpg"],
          },
        ],
        total: 100,
        skip: 0,
        limit: 30,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toHaveLength(1);
      expect(data.products[0]).toHaveProperty("localPrice");
      expect(data.products[0]).toHaveProperty("stockStatus");
      expect(data.products[0]).toHaveProperty("fetchedAt");
    });

    it("handles query parameters correctly", async () => {
      const mockResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products?q=iPhone&category=smartphones&page=2&sort=price&order=desc&limit=10&delay=1000&retries=3"
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("dummyjson.com/products"),
        expect.objectContaining({
          method: "GET",
          headers: expect.any(Object),
        })
      );
    });

    it("handles delay parameter", async () => {
      const mockResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const startTime = Date.now();
      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products?delay=100"
      );
      const response = await GET(request);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it("handles retry logic on failure", async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              products: [],
              total: 0,
              skip: 0,
              limit: 10,
            }),
        });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products?retries=3"
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("returns error after max retries", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products?retries=2"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to fetch products");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("handles API error responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: "Not found" }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("API error");
    });

    it("adds proper transformations to products", async () => {
      const mockResponse = {
        products: [
          {
            id: 1,
            title: "iPhone 9",
            price: 549,
            stock: 94,
            category: "smartphones",
            thumbnail:
              "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
            images: ["https://cdn.dummyjson.com/product-images/1/1.jpg"],
          },
        ],
        total: 1,
        skip: 0,
        limit: 30,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products[0]).toHaveProperty("localPrice");
      expect(data.products[0]).toHaveProperty("stockStatus");
      expect(data.products[0]).toHaveProperty("fetchedAt");
      expect(data.products[0].localPrice).toContain("MXN");
      expect(data.products[0].stockStatus).toBe("in_stock");
    });

    it("sets proper cache headers", async () => {
      const mockResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 30,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products"
      );
      const response = await GET(request);

      expect(response.headers.get("Cache-Control")).toBe("public, max-age=300");
    });
  });

  describe("POST /api/dummy/products", () => {
    it("fetches categories successfully", async () => {
      const mockCategories = [
        { slug: "smartphones", name: "Smartphones" },
        { slug: "laptops", name: "Laptops" },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products",
        {
          method: "POST",
          body: JSON.stringify({ action: "categories" }),
        }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCategories);
    });

    it("handles categories fetch error", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products",
        {
          method: "POST",
          body: JSON.stringify({ action: "categories" }),
        }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to fetch categories");
    });

    it("returns error for invalid action", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/dummy/products",
        {
          method: "POST",
          body: JSON.stringify({ action: "invalid" }),
        }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid action");
    });
  });
});
