"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Star, Heart, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useToastStore } from "@/stores/toastStore";
import { formatPrice } from "@/utils/formatters";

export function ProductInfo({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? undefined);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? undefined);
  const [quantity, setQuantity] = useState(1);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const showToast = useToastStore((state) => state.showToast);

  const inStock = product.stock > 0;

  function requireLogin() {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  function handleAddToCart() {
    if (!session?.user) {
      requireLogin();
      return;
    }
    addItem(product, quantity, selectedColor, selectedSize);
    showToast(`${product.name} added to cart`);
  }

  function handleBuyNow() {
    if (!session?.user) {
      requireLogin();
      return;
    }
    addItem(product, quantity, selectedColor, selectedSize);
    router.push("/cart");
  }

  function handleToggleWishlist() {
    if (!session?.user) {
      requireLogin();
      return;
    }
    toggleWishlist(product);
    showToast(
      isInWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`
    );
  }

  return (
    <div>
      <span className="text-sm font-medium text-muted">{product.category}</span>
      <h1 className="mt-1 text-2xl font-bold text-text sm:text-3xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-semibold text-text">{product.rating}</span>
        </div>
        <span className="text-sm text-muted">({product.reviews} reviews)</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-text">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
        )}
        {product.discount && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            -{product.discount}%
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

      {product.colors && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text">Color: {selectedColor}</h3>
          <div className="mt-2 flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selectedColor === color
                    ? "border-secondary bg-secondary/10 font-semibold text-secondary"
                    : "border-muted/20 text-muted hover:border-text"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-text">Size: {selectedSize}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-10 min-w-10 rounded-lg border px-3 text-sm transition-colors ${
                  selectedSize === size
                    ? "border-secondary bg-secondary/10 font-semibold text-secondary"
                    : "border-muted/20 text-muted hover:border-text"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text">Quantity</h3>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-muted/20">
            <button onClick={decreaseQty} aria-label="Decrease quantity" className="p-2.5 text-text hover:text-secondary">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-text">{quantity}</span>
            <button onClick={increaseQty} aria-label="Increase quantity" className="p-2.5 text-text hover:text-secondary">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className={`text-sm ${inStock ? "text-success" : "text-error"}`}>
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 rounded-full bg-secondary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className="flex items-center justify-center rounded-full border border-muted/20 p-3 text-text transition-colors hover:text-error"
        >
          <Heart className={`h-5 w-5 ${isInWishlist ? "fill-error text-error" : ""}`} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-muted/10 pt-4 text-xs text-muted">
        <span>SKU: {product.sku}</span>
        <span>Category: {product.category}</span>
      </div>
    </div>
  );
}