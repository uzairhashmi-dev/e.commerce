import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/api/products";
import { getProductReviews } from "@/lib/api/reviews";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ProductSection } from "@/components/home/ProductSection";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.id, product.category),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} reviews={reviews} />

      {relatedProducts.length > 0 && (
        <div className="mt-4 border-t border-muted/10">
          <ProductSection title="Related Products" products={relatedProducts} />
        </div>
      )}
    </div>
  );
}