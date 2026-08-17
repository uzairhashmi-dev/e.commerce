"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummaryCheckout } from "@/components/checkout/OrderSummaryCheckout";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DeliveryMethod } from "@/types";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const items = useCartStore((state) => state.items);

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
          description="Add some products to your cart before checking out."
          actionLabel="Continue Shopping"
          actionHref="/products"
        />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm deliveryMethod={deliveryMethod} onDeliveryChange={setDeliveryMethod} />
        </div>
        <div>
          <OrderSummaryCheckout deliveryMethod={deliveryMethod} />
        </div>
      </div>
    </div>
  );
}