"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/types";

const ratingOptions = [4, 3, 2];

export function FilterSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCategory = searchParams.get("category") ?? "";
  const activeRating = searchParams.get("rating") ?? "";
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-full border border-muted/20 px-4 py-2 text-sm font-medium text-text lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <aside
        className={`fixed inset-0 z-40 overflow-y-auto bg-background p-6 lg:static lg:z-auto lg:block lg:w-64 lg:shrink-0 lg:bg-transparent lg:p-0 ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold text-text">Filters</h2>
          <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
            <X className="h-5 w-5 text-text" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    updateParam("category", activeCategory === cat.slug ? null : cat.slug)
                  }
                  className={`block text-sm ${
                    activeCategory === cat.slug
                      ? "font-semibold text-secondary"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value || null)}
                className="w-full rounded-lg border border-muted/20 bg-card px-2 py-1.5 text-sm text-text outline-none focus:border-secondary"
              />
              <span className="text-muted">–</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value || null)}
                className="w-full rounded-lg border border-muted/20 bg-card px-2 py-1.5 text-sm text-text outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Rating</h3>
            <div className="space-y-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    updateParam("rating", activeRating === String(rating) ? null : String(rating))
                  }
                  className={`block text-sm ${
                    activeRating === String(rating)
                      ? "font-semibold text-secondary"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {rating}★ & up
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
                className="h-4 w-4 rounded border-muted/40 accent-secondary"
              />
              In Stock Only
            </label>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="mt-8 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-background lg:hidden"
        >
          Show Results
        </button>
      </aside>
    </>
  );
}