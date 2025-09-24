/**
 * Utilidades para formateo de precios
 */

// Tasa de cambio USD a MXN (puede ser actualizada dinámicamente en el futuro)
const EXCHANGE_RATE = 19.5;

/**
 * Formatea un precio en USD a MXN usando el formato mexicano
 * @param price - Precio en USD
 * @returns Precio formateado en MXN (ej: "$1,234.56")
 */
export function formatPrice(price: number): string {
    const priceInMXN = price * EXCHANGE_RATE;
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(priceInMXN);
}

/**
 * Formatea un precio sin conversión de moneda (asume que ya está en MXN)
 * @param price - Precio en MXN
 * @returns Precio formateado en MXN (ej: "$1,234.56")
 */
export function formatPriceMXN(price: number): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(price);
}

/**
 * Obtiene la tasa de cambio actual
 * @returns Tasa de cambio USD a MXN
 */
export function getExchangeRate(): number {
    return EXCHANGE_RATE;
}

/**
 * Convierte un precio de USD a MXN
 * @param priceUSD - Precio en USD
 * @returns Precio en MXN
 */
export function convertUSDToMXN(priceUSD: number): number {
    return priceUSD * EXCHANGE_RATE;
}
