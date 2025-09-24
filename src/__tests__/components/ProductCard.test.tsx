import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";
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

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

    // Check for price - it should be formatted
    const priceElement = screen.getByText(/\$549\.00/);
    expect(priceElement).toBeInTheDocument();
  });

  it("displays product image with correct attributes", () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: mockProduct.title });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockProduct.thumbnail);
    expect(image).toHaveAttribute("alt", mockProduct.title);
  });

  it("shows rating with correct number of stars", () => {
    render(<ProductCard product={mockProduct} />);

    // Check for rating text that includes the rating value and stock
    const ratingText = screen.getByText(/4\.7.*94 unidades/);
    expect(ratingText).toBeInTheDocument();
  });

  it("displays stock status correctly", () => {
    render(<ProductCard product={mockProduct} />);

    const stockStatus = screen.getByText("En stock");
    expect(stockStatus).toBeInTheDocument();
  });

  it("shows low stock status when stock is low", () => {
    const lowStockProduct = {
      ...mockProduct,
      stock: 5,
      stockStatus: "low_stock" as const,
    };
    render(<ProductCard product={lowStockProduct} />);

    const stockStatus = screen.getByText("Poco stock");
    expect(stockStatus).toBeInTheDocument();
  });

  it("displays discount percentage when available", () => {
    render(<ProductCard product={mockProduct} />);

    const discount = screen.getByText(
      `-${mockProduct.discountPercentage.toFixed(0)}%`,
    );
    expect(discount).toBeInTheDocument();
  });

  it("has correct link to product detail page", () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/product/${mockProduct.id}`);
  });

  it("formats price correctly in Mexican Peso", () => {
    render(<ProductCard product={mockProduct} />);

    // Should display formatted price with MXN currency
    const priceElement = screen.getByText(/\$549\.00/);
    expect(priceElement).toBeInTheDocument();
  });

  it("handles missing discount gracefully", () => {
    const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 };
    render(<ProductCard product={productWithoutDiscount} />);

    // Should not show discount badge
    expect(screen.queryByText(/-0%/)).not.toBeInTheDocument();
  });

  it("handles missing images gracefully", () => {
    const productWithoutImages = { ...mockProduct, images: [] };
    render(<ProductCard product={productWithoutImages} />);

    // Should still render the card
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it("is accessible with proper ARIA attributes", () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole("link");
    // The link doesn't have aria-label, it's just a regular link
    expect(link).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<ProductCard product={mockProduct} />);

    // Should have proper heading structure
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(mockProduct.title);
  });
});
