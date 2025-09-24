import { ProductsPage } from "@/components/ProductsPage";
import { SearchFiltersProvider } from "@/contexts/SearchFiltersContext";

export default function Home() {
  return (
    <SearchFiltersProvider>
      <ProductsPage />
    </SearchFiltersProvider>
  );
}
