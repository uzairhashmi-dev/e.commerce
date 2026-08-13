import { categories } from "@/data/categories";
import type { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  return categories;
}