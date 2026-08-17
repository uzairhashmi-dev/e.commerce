import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-10 w-full max-w-md rounded-full" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 shrink-0 space-y-6 lg:block">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-40 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}