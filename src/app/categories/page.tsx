import Link from "next/link";
import { getAllCategories } from "@/lib/api/categories";
import { getAllProducts } from "@/lib/api/products";
import { categoryIcons, categoryColors } from "@/lib/categoryIcons";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  function countByCategory(categoryName: string) {
    return products.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Shop by Category</h1>
        <p className="mt-1 text-sm text-muted">
          Browse our full range of products by category.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon];
          const count = countByCategory(category.name);

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-muted/10 bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${categoryColors[category.icon]}`}
              >
                <Icon className="h-9 w-9" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text">{category.name}</h3>
                <p className="text-xs text-muted">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}