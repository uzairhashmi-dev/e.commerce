"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { EmptyState } from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love so you can find them easily later."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">
        My Wishlist <span className="text-base font-normal text-muted">({items.length})</span>
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <WishlistCard
            key={item.productId}
            item={item}
            onRemove={() => {
              removeItem(item.productId);
              showToast(`${item.name} removed from wishlist`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WishlistCard({
  item,
  onRemove,
}: {
  item: ReturnType<typeof useWishlistStore.getState>["items"][number];
  onRemove: () => void;
}) {
  const addToCart = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  function handleMoveToCart() {
    addToCart(
      {
        id: item.productId,
        name: item.name,
        description: "",
        category: item.category,
        price: item.price,
        originalPrice: item.originalPrice,
        rating: item.rating,
        reviews: 0,
        images: [item.image],
        stock: item.stock,
        sku: "",
      },
      1
    );
    onRemove();
    showToast(`${item.name} moved to cart`);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-muted/10 bg-card shadow-sm">
      <Link href={`/products/${item.productId}`} className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-muted">{item.category}</span>
        <Link href={`/products/${item.productId}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-text hover:text-secondary">
            {item.name}
          </h3>
        </Link>
        <span className="text-base font-bold text-text">${item.price.toFixed(2)}</span>

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleMoveToCart}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-background hover:opacity-90"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Move to Cart
          </button>
          <button
            onClick={onRemove}
            aria-label="Remove from wishlist"
            className="rounded-full border border-muted/20 p-2 text-muted hover:text-error"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}