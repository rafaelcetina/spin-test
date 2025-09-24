'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/product';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RotateCcw,
  Package,
  Weight,
  Ruler
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PriceChart } from '@/components/PriceChart';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const {
    id,
    title,
    description,
    price,
    localPrice,
    rating,
    stock,
    stockStatus,
    images,
    brand,
    category,
    discountPercentage,
    tags,
    reviews,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    minimumOrderQuantity,
    dimensions,
    weight,
    sku,
    fetchedAt,
  } = product;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const getStockBadgeVariant = () => {
    switch (stockStatus) {
      case 'in_stock':
        return 'default';
      case 'low_stock':
        return 'secondary';
      case 'out_of_stock':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStockText = () => {
    switch (stockStatus) {
      case 'in_stock':
        return 'En stock';
      case 'low_stock':
        return 'Poco stock';
      case 'out_of_stock':
        return 'Sin stock';
      default:
        return `${stock} unidades`;
    }
  };

  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : rating;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={images[0] || '/placeholder-product.jpg'}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            {discountPercentage > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-4 left-4 text-lg px-3 py-1"
              >
                -{discountPercentage.toFixed(0)}%
              </Badge>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg border">
                  <Image
                    src={image}
                    alt={`${title} ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{brand}</Badge>
              <Badge variant="secondary">{category}</Badge>
              <Badge variant={getStockBadgeVariant()}>
                {getStockText()}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews?.length || 0} reseñas)
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(price)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(price / (1 - discountPercentage / 100))}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-sm text-green-600 font-medium">
                Ahorras {formatPrice((price / (1 - discountPercentage / 100)) - price)}
              </p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              disabled={stockStatus === 'out_of_stock'}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {stockStatus === 'out_of_stock' ? 'Sin stock' : 'Añadir al carrito'}
            </Button>
            <Button variant="outline" size="lg">
              Comprar ahora
            </Button>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span>{shippingInformation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span>{warrantyInformation}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <span>{returnPolicy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>SKU: {sku}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Detalles técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Especificaciones técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Peso:</span>
                <div className="flex items-center gap-1">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <span>{weight} kg</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Dimensiones:</span>
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span>{dimensions.width} × {dimensions.height} × {dimensions.depth} cm</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Stock disponible:</span>
                <span className="ml-2">{stock} unidades</span>
              </div>
              <div>
                <span className="font-medium">Cantidad mínima:</span>
                <span className="ml-2">{minimumOrderQuantity} unidades</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardHeader>
            <CardTitle>Reseñas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.slice(0, 5).map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.reviewerName}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay reseñas disponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de precio histórico */}
      <div className="mt-8">
        <PriceChart 
          currentPrice={price} 
          productName={title}
          className="w-full"
        />
      </div>

      {fetchedAt && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Información actualizada: {formatDate(fetchedAt)}
        </div>
      )}
    </div>
  );
}
