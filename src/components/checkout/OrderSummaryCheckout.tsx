"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import type { DeliveryMethod } from "@/types";
import { formatPrice } from "@/utils/formatters";

const SHIPPING_COST: Record<DeliveryMethod, number> = {
  standard: 200,
  express: 500,
};

const TAX_RATE = 0.08;

export function OrderSummaryCheckout({ deliveryMethod }: { deliveryMethod: DeliveryMethod }) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());

  const shipping = SHIPPING_COST[deliveryMethod];
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-2xl border border-muted/10 bg-card p-6">
      <h2 className="text-lg font-bold text-text">Order Summary</h2>

      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-background">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="line-clamp-1 text-xs font-medium text-text">{item.name}</p>
              <p className="text-xs text-muted">
                {item.color && item.color} {item.size && `· ${item.size}`}
              </p>
            </div>
           <span className="text-xs font-semibold text-text">
      {formatPrice(item.price * item.quantity)}
          </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-muted/10 pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>SubTotal</span>
          <span className="text-text">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping ({deliveryMethod})</span>
          <span className="text-text">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax (8%)</span>
          <span className="text-text">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-muted/10 pt-4 text-base font-bold text-text">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}