import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ProductSection } from "@/components/home/ProductSection";
import { getAllProducts } from "@/lib/api/products";

export default async function Home() {
  const products = await getAllProducts();
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <ProductSection title="Featured Products" products={products.slice(0, 4)} />
      <PromoBanner />
      <ProductSection title="Best Sellers" products={bestSellers} />
      <ProductSection title="New Arrivals" products={newArrivals} />
    </>
  );
}