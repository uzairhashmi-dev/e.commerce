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

       {activeTab === "specifications" && (
  <dl className="grid max-w-md grid-cols-2 gap-y-3 text-sm">
    <dt className="text-muted">SKU</dt>
    <dd className="text-text">{product.sku}</dd>
    <dt className="text-muted">Category</dt>
    <dd className="text-text">{product.category}</dd>
    {product.fabric && (
      <>
        <dt className="text-muted">Fabric</dt>
        <dd className="text-text">{product.fabric}</dd>
      </>
    )}
    {product.pieceCount && (
      <>
        <dt className="text-muted">Pieces</dt>
        <dd className="text-text">{product.pieceCount}-Piece</dd>
      </>
    )}
    {product.stitched !== undefined && (
      <>
        <dt className="text-muted">Stitching</dt>
        <dd className="text-text">{product.stitched ? "Stitched" : "Unstitched"}</dd>
      </>
    )}
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
      </div>
    </div>
  );
}