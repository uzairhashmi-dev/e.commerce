import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PackageOpen } from "lucide-react";
import { auth } from "@/auth";
import { getOrdersByUserEmail } from "@/lib/api/orders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/utils/formatters";

export default async function OrdersPage() {
  const session = await auth();
  const orders = session?.user?.email ? await getOrdersByUserEmail(session.user.email) : [];

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see them here."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-2xl border border-muted/10 bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-text">{order.id}</p>
                <p className="text-xs text-muted">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex -space-x-3">
                {order.items.slice(0, 4).map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-card bg-background"
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-card bg-background text-xs font-semibold text-muted">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-xs text-muted">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
                <p className="text-lg font-bold text-text">{formatPrice(order.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}