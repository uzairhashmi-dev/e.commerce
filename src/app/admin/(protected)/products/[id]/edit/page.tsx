import { notFound } from "next/navigation";
import { getProductById } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getAllCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Edit Product</h1>
      <p className="mt-1 text-sm text-muted">Update product details.</p>

      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} initialProduct={product} />
      </div>
    </div>
  );
}