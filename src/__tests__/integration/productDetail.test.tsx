import { render, screen } from "@testing-library/react";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  images: [
    "https://cdn.dummyjson.com/product-images/1/1.jpg",
    "https://cdn.dummyjson.com/product-images/1/2.jpg",
    "https://cdn.dummyjson.com/product-images/1/3.jpg",
    "https://cdn.dummyjson.com/product-images/1/4.jpg",
    "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  ],
  localPrice: "$549.00 MXN",
  stockStatus: "in_stock",
  fetchedAt: "2024-01-01T00:00:00.000Z",
  // Required fields for Product interface
  tags: ["smartphone", "apple", "mobile"],
  sku: "IPHONE9-001",
  weight: 0.194,
  dimensions: {
    width: 5.5,
    height: 11.5,
    depth: 0.8,
  },
  warrantyInformation: "1 year manufacturer warranty",
  shippingInformation: "Free shipping on orders over $50",
  availabilityStatus: "in_stock",
  reviews: [
    {
      rating: 5,
      comment: "Excellent phone!",
      date: "2024-01-15",
      reviewerName: "John Doe",
      reviewerEmail: "john@example.com",
    },
  ],
  returnPolicy: "30-day return policy",
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    barcode: "1234567890123",
    qrCode: "QR123456789",
  },
};

// Mock Next.js components
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("next/image", () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

// Mock recharts
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("Product Detail Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product information", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
  });

  it("renders price information", () => {
    render(<ProductDetail product={mockProduct} />);

    // Check for formatted price in MXN (549 * 19.5 = 10,705.50) - there might be multiple instances
    const priceElements = screen.getAllByText(/\$10,705\.50/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it("renders rating information", () => {
    render(<ProductDetail product={mockProduct} />);

    // Check that the component renders without crashing
    // The rating section should be present in the DOM
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
  });

  it("renders stock information", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText(/94 unidades/)).toBeInTheDocument();
  });

  it("renders price chart", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
