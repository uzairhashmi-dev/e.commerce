"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring our products."
          actionLabel="Continue Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm font-medium text-error hover:underline"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}