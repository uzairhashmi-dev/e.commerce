import { getAllCategories } from "@/lib/api/categories";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Categories</h1>
      <p className="mt-1 text-sm text-muted">Manage product categories shown on the storefront.</p>

      <div className="mt-6">
        <CategoriesManager initialCategories={categories} />
      </div>
    </div>
  );
}