import Link from "next/link";
import { getAllProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { filterProducts, sortProducts, type SortOption } from "@/lib/filters";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { SearchInput } from "@/components/products/SearchInput";
import { SortDropdown } from "@/components/products/SortDropdown";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/products/Pagination";

type SearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  inStock?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const filtered = filterProducts(allProducts, {
    search: params.search,
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.rating ? Number(params.rating) : undefined,
    inStockOnly: params.inStock === "true",
  });

  const sorted = sortProducts(filtered, (params.sort as SortOption) ?? "default");

  const currentPage = Math.max(1, Number(params.page) || 1);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const paginated = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  const hasActiveFilters = Boolean(
    params.search || params.category || params.minPrice || params.maxPrice || params.rating || params.inStock
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">All Products</h1>
        <SearchInput />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar categories={categories} />

        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {sorted.length} {sorted.length === 1 ? "product" : "products"} found
            </p>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <Link href="/products" className="text-sm font-medium text-secondary hover:underline">
                  Clear Filters
                </Link>
              )}
              <SortDropdown />
            </div>
          </div>

          <ProductGrid products={paginated} />

          {totalPages > 1 && <Pagination currentPage={safePage} totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
}