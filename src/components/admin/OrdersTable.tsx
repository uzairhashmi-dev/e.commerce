import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatPrice } from "@/utils/formatters";
import type { Order } from "@/types";

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-muted/30 py-16 text-center text-sm text-muted">
        No orders placed yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-muted/10 bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-muted/10 text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-muted/10 last:border-0 hover:bg-background">
              <td className="px-4 py-3 font-medium text-text">{order.id}</td>
              <td className="px-4 py-3 text-muted">{new Date(order.date).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-text">
                {order.customer.firstName} {order.customer.lastName}
                {!order.userId && (
                  <span className="ml-2 rounded-full bg-muted/10 px-2 py-0.5 text-[10px] text-muted">
                    Guest
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-muted">{order.customer.email}</td>
              <td className="px-4 py-3 text-muted">{order.customer.phone}</td>
              <td className="px-4 py-3 text-muted">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </td>
              <td className="px-4 py-3 font-semibold text-text">{formatPrice(order.total)}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <Link href={`/orders/${order.id}`} className="text-secondary hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}