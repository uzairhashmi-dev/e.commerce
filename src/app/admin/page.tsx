import { getAllOrders } from "@/lib/api/orders";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default async function AdminDashboard() {
  const orders = await getAllOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Orders Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Manage and review all customer orders.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <p className="text-xs text-muted">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-text">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <p className="text-xs text-muted">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-text">Rs. {totalRevenue.toLocaleString("en-PK")}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <p className="text-xs text-muted">Guest Orders</p>
          <p className="mt-1 text-2xl font-bold text-text">
            {orders.filter((o) => !o.userId).length}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}