import { Product, ProductsResponse, Category } from "@/types/product";

export const mockProduct: Product = {
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
};

export const mockProducts: Product[] = [
  mockProduct,
  {
    id: 2,
    title: "iPhone X",
    description:
      "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    stock: 34,
    brand: "Apple",
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
    images: [
      "https://cdn.dummyjson.com/product-images/2/1.jpg",
      "https://cdn.dummyjson.com/product-images/2/2.jpg",
      "https://cdn.dummyjson.com/product-images/2/3.jpg",
      "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
    ],
    localPrice: "$899.00 MXN",
    stockStatus: "low_stock",
    fetchedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Samsung Universe 9",
    description: "Samsung new variant which goes beyond Galaxy to the Universe",
    price: 1249,
    discountPercentage: 15.46,
    rating: 4.09,
    stock: 36,
    brand: "Samsung",
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
    images: ["https://cdn.dummyjson.com/product-images/3/1.jpg"],
    localPrice: "$1,249.00 MXN",
    stockStatus: "low_stock",
    fetchedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const mockProductsResponse: ProductsResponse = {
  products: mockProducts,
  total: 100,
  skip: 0,
  limit: 30,
};

export const mockCategories: Category[] = [
  { slug: "smartphones", name: "Smartphones" },
  { slug: "laptops", name: "Laptops" },
  { slug: "fragrances", name: "Fragrances" },
  { slug: "skincare", name: "Skincare" },
  { slug: "groceries", name: "Groceries" },
  { slug: "home-decoration", name: "Home Decoration" },
  { slug: "furniture", name: "Furniture" },
  { slug: "tops", name: "Tops" },
  { slug: "womens-dresses", name: "Women's Dresses" },
  { slug: "womens-shoes", name: "Women's Shoes" },
  { slug: "mens-shirts", name: "Men's Shirts" },
  { slug: "mens-shoes", name: "Men's Shoes" },
  { slug: "mens-watches", name: "Men's Watches" },
  { slug: "womens-watches", name: "Women's Watches" },
  { slug: "womens-bags", name: "Women's Bags" },
  { slug: "womens-jewellery", name: "Women's Jewellery" },
  { slug: "sunglasses", name: "Sunglasses" },
  { slug: "automotive", name: "Automotive" },
  { slug: "motorcycle", name: "Motorcycle" },
  { slug: "lighting", name: "Lighting" },
];

export const mockApiError = {
  message: "Failed to fetch products",
  status: 500,
};
