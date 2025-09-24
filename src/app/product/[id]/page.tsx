import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 300 }, // Cache por 5 minutos
    });

    if (!response.ok) {
      return null;
    }

    const product: Product = await response.json();
    
    // Aplicar transformaciones como en el proxy
    const transformedProduct: Product = {
      ...product,
      localPrice: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(product.price),
      stockStatus: product.stock === 0 ? 'out_of_stock' : 
                   product.stock <= 5 ? 'low_stock' : 'in_stock',
      fetchedAt: new Date().toISOString(),
    };

    return transformedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto solicitado no existe o no está disponible.',
    };
  }

  return {
    title: `${product.title} - ${product.brand}`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
