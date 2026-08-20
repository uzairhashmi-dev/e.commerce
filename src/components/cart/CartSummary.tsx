"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/utils/formatters";

const SHIPPING_FLAT = 200;
const TAX_RATE = 0.08;

export function CartSummary() {
  const subtotal = useCartStore((state) => state.subtotal());

  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-2xl border border-muted/10 bg-card p-6">
      <h2 className="text-lg font-bold text-text">Order Summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted">
  <span>Subtotal</span>
  <span className="text-text">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted">
      <span>Shipping</span>
       <span className="text-text">{formatPrice(shipping)}</span>
      </div>
      <div className="flex justify-between text-muted">
      <span>Tax (8%)</span>
      <span className="text-text">{formatPrice(tax)}</span>
      </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-muted/10 pt-4 text-base font-bold text-text">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/products"
        className="mt-3 block rounded-full border border-muted/20 py-3 text-center text-sm font-semibold text-text transition-colors hover:bg-background"
      >
        Continue Shopping
      </Link>
    </div>
  );
}