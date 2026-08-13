"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product, Review } from "@/types";

type Tab = "description" | "specifications" | "reviews";

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="mt-12">
      <div className="flex gap-6 border-b border-muted/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-secondary text-secondary"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {activeTab === "description" && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{product.description}</p>
        )}

        {activeTab === "specifications" && (
          <dl className="grid max-w-md grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted">SKU</dt>
            <dd className="text-text">{product.sku}</dd>
            <dt className="text-muted">Category</dt>
            <dd className="text-text">{product.category}</dd>
            <dt className="text-muted">Stock</dt>
            <dd className="text-text">{product.stock} units</dd>
            {product.colors && (
              <>
                <dt className="text-muted">Colors</dt>
                <dd className="text-text">{product.colors.join(", ")}</dd>
              </>
            )}
            {product.sizes && (
              <>
                <dt className="text-muted">Sizes</dt>
                <dd className="text-text">{product.sizes.join(", ")}</dd>
              </>
            )}
          </dl>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-2xl space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-muted/10 pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text">{review.author}</span>
                  <span className="text-xs text-muted">{review.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating ? "fill-accent text-accent" : "text-muted/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}