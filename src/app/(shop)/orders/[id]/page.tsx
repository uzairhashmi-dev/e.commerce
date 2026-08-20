import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { getOrderById } from "@/lib/api/orders";
import { formatPrice } from "@/utils/formatters";

const statusSteps = ["Processing", "Shipped", "Delivered"] as const;

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const currentStepIndex = statusSteps.indexOf(order.status as (typeof statusSteps)[number]);
  const estimatedDelivery = new Date(
    new Date(order.date).getTime() + (order.deliveryMethod === "express" ? 2 : 7) * 86400000
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center rounded-2xl border border-muted/10 bg-card p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="mt-3 text-2xl font-bold text-text">Order Confirmed!</h1>
        <p className="mt-1 text-sm text-muted">Thank you — your order has been placed.</p>

        <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted">Order Number</p>
            <p className="font-semibold text-text">{order.id}</p>
          </div>
          <div>
            <p className="text-muted">Order Date</p>
            <p className="font-semibold text-text">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-muted/10 bg-card p-6">
        <h2 className="text-sm font-bold text-text">Delivery Timeline</h2>
        <div className="mt-4 flex items-center justify-between">
          {["Ordered", ...statusSteps].map((step, index) => {
            const isDone = index <= currentStepIndex + 1;
            return (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isDone ? "bg-secondary text-background" : "bg-muted/20 text-muted"
                  }`}
                >
                  {index === 0 && <Package className="h-4 w-4" />}
                  {index === 1 && <CheckCircle2 className="h-4 w-4" />}
                  {index === 2 && <Truck className="h-4 w-4" />}
                  {index === 3 && <Home className="h-4 w-4" />}
                </div>
                <span className="mt-1 text-[11px] text-muted">{step}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted">
          Estimated delivery: {estimatedDelivery.toLocaleDateString()}
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-muted/10 bg-card p-6">
          <h2 className="text-sm font-bold text-text">Customer Information</h2>
          <p className="mt-2 text-sm text-muted">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-sm text-muted">{order.customer.email}</p>
          <p className="text-sm text-muted">{order.customer.phone}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-6">
          <h2 className="text-sm font-bold text-text">Shipping Address</h2>
          <p className="mt-2 text-sm text-muted">{order.shippingAddress.address}</p>
          <p className="text-sm text-muted">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-sm text-muted">{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-muted/10 bg-card p-6">
        <h2 className="text-sm font-bold text-text">Items</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{item.name}</p>
                <p className="text-xs text-muted">
                  Qty: {item.quantity} {item.color && `· ${item.color}`} {item.size && `· ${item.size}`}
                </p>
              </div>
              <span className="text-sm font-semibold text-text">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-muted/10 pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="text-text">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Shipping</span>
            <span className="text-text">{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span className="text-text">{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-muted/10 pt-2 text-base font-bold text-text">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-semibold text-background hover:opacity-90"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="flex-1 rounded-full border border-muted/20 py-3 text-center text-sm font-semibold text-text hover:bg-card"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}