import { type NextRequest, NextResponse } from "next/server";
import type { Product, ProductsResponse } from "@/types/product";

const DUMMY_JSON_BASE_URL = "https://dummyjson.com/products";

// Cache simple en memoria para la sesión
const cache = new Map<string, { data: ProductsResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getStockStatus(
  stock: number,
): "in_stock" | "low_stock" | "out_of_stock" {
  if (stock === 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "MXN",
  }).format(price);
}

function transformProduct(product: Product): Product {
  return {
    ...product,
    localPrice: formatPrice(product.price),
    stockStatus: getStockStatus(product.stock),
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchWithRetry(
  url: string,
  retries: number = 0,
  maxRetries: number = 3,
): Promise<Response> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Ecommerce-App/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (retries < maxRetries) {
      // Retry exponencial: 1s, 2s, 4s
      const delay = 2 ** retries * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries + 1, maxRetries);
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extraer parámetros
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort =
      (searchParams.get("sort") as "price" | "rating" | "title") || undefined;
    const order = (searchParams.get("order") as "asc" | "desc") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const delay = parseInt(searchParams.get("delay") || "0", 10);
    const retries = parseInt(searchParams.get("retries") || "0", 10);

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Construir URL para DummyJSON
    const dummyUrl = new URL(DUMMY_JSON_BASE_URL);

    if (q) {
      dummyUrl.pathname = "/products/search";
      dummyUrl.searchParams.set("q", q);
    } else if (category) {
      dummyUrl.pathname = `/products/category/${category}`;
    }

    // Añadir parámetros de paginación y ordenamiento
    dummyUrl.searchParams.set("limit", limit.toString());
    dummyUrl.searchParams.set("skip", skip.toString());

    if (sort && order) {
      dummyUrl.searchParams.set("sortBy", sort);
      dummyUrl.searchParams.set("order", order);
    }

    // Crear clave de cache
    const cacheKey = dummyUrl.toString();

    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, max-age=300",
          "X-Cache": "HIT",
        },
      });
    }

    // Simular delay si se especifica
    if (delay > 0 && delay <= 5000) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Fetch con reintentos
    const response = await fetchWithRetry(cacheKey, 0, retries);
    const data: ProductsResponse = await response.json();

    // Transformar productos
    const transformedData: ProductsResponse = {
      ...data,
      products: data.products.map(transformProduct),
    };

    // Guardar en cache
    cache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now(),
    });

    // Headers de respuesta
    const headers = new Headers({
      "Cache-Control": "public, max-age=300",
      "X-Cache": "MISS",
      "X-Fetched-At": new Date().toISOString(),
    });

    // Generar ETag simple
    const etag = `"${Buffer.from(JSON.stringify(transformedData))
      .toString("base64")
      .slice(0, 16)}"`;
    headers.set("ETag", etag);

    // Verificar If-None-Match
    const ifNoneMatch = request.headers.get("If-None-Match");
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers });
    }

    return NextResponse.json(transformedData, { headers });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Endpoint para obtener categorías
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "categories") {
      const response = await fetch(`${DUMMY_JSON_BASE_URL}/categories`);
      const categories = await response.json();

      return NextResponse.json(categories, {
        headers: {
          "Cache-Control": "public, max-age=3600", // Cache por 1 hora
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
