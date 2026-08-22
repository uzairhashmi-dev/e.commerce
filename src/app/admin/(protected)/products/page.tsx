import { getAllProducts } from "@/lib/api/products";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Products</h1>
      <p className="mt-1 text-sm text-muted">Manage your product catalog.</p>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}