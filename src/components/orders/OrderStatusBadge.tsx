import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-secondary/10 text-secondary",
  Shipped: "bg-accent/10 text-accent",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-error/10 text-error",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}