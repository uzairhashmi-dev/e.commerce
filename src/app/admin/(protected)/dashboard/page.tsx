import Link from "next/link";
import { Package, ShoppingBag, Layers, TrendingUp } from "lucide-react";
import { getAllOrders } from "@/lib/api/orders";
import { formatPrice } from "@/utils/formatters";

export default async function AdminDashboard() {
  const orders = await getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const processingCount = orders.filter((o) => o.status === "Processing").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Overview of your store's activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <div className="flex items-center gap-2 text-muted">
            <Package className="h-4 w-4" />
            <p className="text-xs">Total Orders</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-text">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <div className="flex items-center gap-2 text-muted">
            <TrendingUp className="h-4 w-4" />
            <p className="text-xs">Total Revenue</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-text">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <div className="flex items-center gap-2 text-muted">
            <Package className="h-4 w-4" />
            <p className="text-xs">Processing</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-text">{processingCount}</p>
        </div>
        <div className="rounded-2xl border border-muted/10 bg-card p-5">
          <div className="flex items-center gap-2 text-muted">
            <ShoppingBag className="h-4 w-4" />
            <p className="text-xs">Products</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-text">—</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold text-text">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl border border-muted/10 bg-card p-4 hover:shadow-md"
          >
            <Package className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-text">Manage Orders</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-xl border border-muted/10 bg-card p-4 hover:shadow-md"
          >
            <ShoppingBag className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-text">Manage Products</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-xl border border-muted/10 bg-card p-4 hover:shadow-md"
          >
            <Layers className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-text">Manage Categories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}