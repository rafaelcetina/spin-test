"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceData {
  month: string;
  price: number;
  date: string;
}

interface PriceChartProps {
  currentPrice: number;
  productName: string;
  className?: string;
}

export function PriceChart({
  currentPrice,
  productName,
  className,
}: PriceChartProps) {
  // Generar datos simulados de precio histórico (últimos 12 meses)
  const generatePriceHistory = (): PriceData[] => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const data: PriceData[] = [];
    const basePrice = currentPrice;
    let currentMonthPrice = basePrice;

    // Usar un seed determinístico basado en el ID del producto para evitar diferencias SSR/CSR
    const seed = currentPrice
      .toString()
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);

    // Generar variaciones realistas de precio usando el seed
    for (let i = 11; i >= 0; i--) {
      // Función pseudo-aleatoria determinística
      const pseudoRandom = (seed + i) * 9301 + 49297;
      const normalized = (pseudoRandom % 233280) / 233280;

      const variation = (normalized - 0.5) * 0.3; // ±15% de variación
      const monthVariation = Math.sin(i * 0.5) * 0.1; // Variación estacional
      const finalVariation = variation + monthVariation;

      currentMonthPrice = basePrice * (1 + finalVariation);

      // Asegurar que el precio no sea negativo
      currentMonthPrice = Math.max(currentMonthPrice, basePrice * 0.7);

      const date = new Date();
      date.setMonth(date.getMonth() - i);

      data.push({
        month: months[date.getMonth()],
        price: Math.round(currentMonthPrice * 100) / 100,
        date: date.toISOString().split("T")[0],
      });
    }

    return data;
  };

  const priceData = generatePriceHistory();
  const firstPrice = priceData[0].price;
  const lastPrice = priceData[priceData.length - 1].price;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;

  const getTrendIcon = () => {
    if (priceChangePercent > 2)
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (priceChangePercent < -2)
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (priceChangePercent > 2) return "text-green-600";
    if (priceChangePercent < -2) return "text-red-600";
    return "text-gray-600";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: PriceData }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Precio: {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Historial de Precios</span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {priceChangePercent > 0 ? "+" : ""}
              {priceChangePercent.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              role="img"
              aria-label={`Gráfica de historial de precios para ${productName} en los últimos 12 meses`}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={["dataMin - 50", "dataMax + 50"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Información adicional accesible para lectores de pantalla */}
        <div className="sr-only">
          <p>
            Gráfica de historial de precios para {productName}. El precio actual
            es {formatPrice(currentPrice)}. En los últimos 12 meses, el precio
            ha {priceChangePercent > 0 ? "aumentado" : "disminuido"}
            un {Math.abs(priceChangePercent).toFixed(1)} por ciento.
          </p>
          <ul>
            {priceData.map((item, index) => (
              <li key={index}>
                {item.month}: {formatPrice(item.price)}
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen de datos */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Precio más alto:</span>
            <p className="font-medium">
              {formatPrice(Math.max(...priceData.map((d) => d.price)))}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Precio más bajo:</span>
            <p className="font-medium">
              {formatPrice(Math.min(...priceData.map((d) => d.price)))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
