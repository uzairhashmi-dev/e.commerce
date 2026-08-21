import { getAllOrders } from "@/lib/api/orders";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Orders</h1>
      <p className="mt-1 text-sm text-muted">Manage and review all customer orders.</p>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}