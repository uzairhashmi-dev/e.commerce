import { getAllCategories } from "@/lib/api/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Add Product</h1>
      <p className="mt-1 text-sm text-muted">Create a new product for your storefront.</p>

      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}