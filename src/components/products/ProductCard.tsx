"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useToastStore } from "@/stores/toastStore";
import { formatPrice } from "@/utils/formatters";


export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const showToast = useToastStore((state) => state.showToast);

  function handleAddToCart() {
    addItem(product, 1);
    showToast(`${product.name} added to cart`);
  }

  function handleToggleWishlist() {
    toggleWishlist(product);
    showToast(
      isInWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-muted/10 bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-background">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>

        {product.discount && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            -{product.discount}%
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 rounded-full bg-card/90 p-2 text-text shadow-sm transition-colors hover:text-error"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-error text-error" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-muted">{product.category}</span>

        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-text hover:text-secondary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-text">
  {formatPrice(product.price)}
</span>
{product.originalPrice && (
  <span className="text-sm text-muted line-through">
    {formatPrice(product.originalPrice)}
  </span>
)}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-2 w-full rounded-full bg-primary py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}