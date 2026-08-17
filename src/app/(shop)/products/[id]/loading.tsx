import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Skeleton className="aspect-square w-full" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}