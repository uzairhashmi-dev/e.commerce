"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/stores/cartStore";
import { formatPrice } from "@/utils/formatters";

export function CartItem({ item }: { item: CartItemType }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 border-b border-muted/10 py-5">
      <Link href={`/products/${item.productId}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${item.productId}`}>
            <h3 className="text-sm font-semibold text-text hover:text-secondary">{item.name}</h3>
          </Link>
          {(item.color || item.size) && (
            <p className="mt-1 text-xs text-muted">
              {item.color && `Color: ${item.color}`}
              {item.color && item.size && " · "}
              {item.size && `Size: ${item.size}`}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-muted/20">
            <button
              onClick={() => decreaseQuantity(item.productId, item.color, item.size)}
              aria-label="Decrease quantity"
              className="p-2 text-text hover:text-secondary"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-text">{item.quantity}</span>
            <button
              onClick={() => increaseQuantity(item.productId, item.color, item.size)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="p-2 text-text hover:text-secondary disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text">
             {formatPrice(item.price * item.quantity)}
                </span>
            <button
              onClick={() => removeItem(item.productId, item.color, item.size)}
              aria-label="Remove item"
              className="text-muted hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}