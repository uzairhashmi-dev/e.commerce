import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/lib/api/categories";

export async function FeaturedCategories() {
  const categories = await getAllCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-text">Shop by Category</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-muted/10 bg-card p-4 text-center transition-shadow hover:shadow-md"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="64px"
              />
            </div>
            <span className="text-sm font-medium text-text">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}