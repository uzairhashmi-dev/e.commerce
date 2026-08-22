import clientPromise from "@/lib/mongodb";
import type { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const categories = await db
    .collection("categories")
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray();
return categories as unknown as Category[];}

export async function getCategoryById(id: string): Promise<Category | null> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const category = await db
    .collection("categories")
    .findOne({ id }, { projection: { _id: 0 } });
return category as unknown as Category | null;}

export async function createCategory(category: Category): Promise<void> {
  const client = await clientPromise;
  const db = client.db("shopease");
  await db.collection("categories").insertOne(category);
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id">>
): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const result = await db.collection("categories").updateOne({ id }, { $set: data });
  return result.modifiedCount > 0;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const result = await db.collection("categories").deleteOne({ id });
  return result.deletedCount > 0;
}