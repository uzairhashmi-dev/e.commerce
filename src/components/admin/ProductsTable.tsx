"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import type { Product } from "@/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{products.length} products</p>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-muted/30 py-16 text-center text-sm text-muted">
          No products yet. Add your first product to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-muted/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-muted/10 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-muted/10 last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-background">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-text">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{product.category}</td>
                  <td className="px-4 py-3 font-semibold text-text">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-muted">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label="Edit"
                        className="text-muted hover:text-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        aria-label="Delete"
                        className="text-muted hover:text-error disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}