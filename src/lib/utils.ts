import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export price utilities for convenience
export {
  convertUSDToMXN,
  formatPrice,
  formatPriceMXN,
  getExchangeRate,
} from "./priceUtils";
