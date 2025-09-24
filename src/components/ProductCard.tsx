"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    title,
    description,
    price,
    localPrice,
    rating,
    stock,
    stockStatus,
    thumbnail,
    brand,
    category,
    discountPercentage,
    fetchedAt,
  } = product;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch {
      return "Fecha no disponible";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const getStockBadgeVariant = () => {
    switch (stockStatus) {
      case "in_stock":
        return "default";
      case "low_stock":
        return "secondary";
      case "out_of_stock":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStockText = () => {
    switch (stockStatus) {
      case "in_stock":
        return "En stock";
      case "low_stock":
        return "Poco stock";
      case "out_of_stock":
        return "Sin stock";
      default:
        return `${stock} unidades`;
    }
  };

  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercentage.toFixed(0)}%
            </Badge>
          )}
          <Badge
            variant={getStockBadgeVariant()}
            className="absolute top-2 right-2"
          >
            {getStockText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {brand}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              {rating.toFixed(1)} ({stock} unidades)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(price)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(price / (1 - discountPercentage / 100))}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/product/${id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalles
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={stockStatus === "out_of_stock"}
            className="shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>

      {fetchedAt && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground">
            Actualizado: {formatDate(fetchedAt)}
          </p>
        </div>
      )}
    </Card>
  );
}
