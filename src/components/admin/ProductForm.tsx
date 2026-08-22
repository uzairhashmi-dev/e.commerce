"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { Category, Product } from "@/types";

export function ProductForm({
  categories,
  initialProduct,
}: {
  categories: Category[];
  initialProduct?: Product;
}) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? categories[0]?.name ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");
  const [sku, setSku] = useState(initialProduct?.sku ?? "");
  const [colors, setColors] = useState(initialProduct?.colors?.join(", ") ?? "");
  const [sizes, setSizes] = useState(initialProduct?.sizes?.join(", ") ?? "");
  const [fabric, setFabric] = useState(initialProduct?.fabric ?? "");
  const [pieceCount, setPieceCount] = useState(initialProduct?.pieceCount?.toString() ?? "");
  const [stitched, setStitched] = useState(initialProduct?.stitched ?? true);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? false);

  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadImageToCloudinary(file))
      );
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name,
      description,
      category,
      price,
      originalPrice: originalPrice || undefined,
      stock,
      sku,
      colors,
      sizes,
      fabric,
      pieceCount: pieceCount || undefined,
      stitched,
      isBestSeller,
      isNewArrival,
      images,
    };

    const url = isEdit ? `/api/admin/products/${initialProduct!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</div>
      )}

      <section className="rounded-2xl border border-muted/10 bg-card p-5">
        <h2 className="text-sm font-bold text-text">Product Images</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-muted/20">
              <Image src={url} alt="Product" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-error p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-muted/30 text-muted hover:border-secondary hover:text-secondary">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <UploadCloud className="h-5 w-5" />
                <span className="text-[10px]">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-muted/10 bg-card p-5">
        <h2 className="text-sm font-bold text-text">Basic Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">Product Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">SKU</label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-muted/10 bg-card p-5">
        <h2 className="text-sm font-bold text-text">Pricing & Stock</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Price (Rs.)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Original Price (optional)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="For showing discount"
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-muted/10 bg-card p-5">
        <h2 className="text-sm font-bold text-text">Fashion Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Colors (comma separated)</label>
            <input
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Maroon, Navy, Black"
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Sizes (comma separated)</label>
            <input
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Fabric</label>
            <input
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="Lawn, Cotton, Chiffon..."
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Piece Count</label>
            <input
              type="number"
              value={pieceCount}
              onChange={(e) => setPieceCount(e.target.value)}
              placeholder="1, 2, or 3"
              className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stitched"
              checked={stitched}
              onChange={(e) => setStitched(e.target.checked)}
              className="h-4 w-4 rounded border-muted/40 accent-secondary"
            />
            <label htmlFor="stitched" className="text-sm text-text">Stitched</label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-muted/10 bg-card p-5">
        <h2 className="text-sm font-bold text-text">Visibility</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="h-4 w-4 rounded border-muted/40 accent-secondary"
            />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="h-4 w-4 rounded border-muted/40 accent-secondary"
            />
            New Arrival
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}