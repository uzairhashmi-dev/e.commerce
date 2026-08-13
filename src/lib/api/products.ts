import { products } from "@/data/products";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  return products
    .filter((p) => p.id !== productId && p.category === category)
    .slice(0, limit);
}