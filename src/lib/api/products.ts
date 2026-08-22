import clientPromise from "@/lib/mongodb";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const products = await db
    .collection("products")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return products as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const product = await db
    .collection("products")
    .findOne({ id }, { projection: { _id: 0 } });
  return (product as unknown as Product) ?? undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const products = await db
    .collection("products")
    .find({ category: { $regex: `^${category}$`, $options: "i" } }, { projection: { _id: 0 } })
    .toArray();
  return products as unknown as Product[];
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const products = await db
    .collection("products")
    .find({ id: { $ne: productId }, category }, { projection: { _id: 0 } })
    .limit(limit)
    .toArray();
  return products as unknown as Product[];
}

export async function createProduct(product: Product & { createdAt: Date }): Promise<void> {
  const client = await clientPromise;
  const db = client.db("shopease");
  await db.collection("products").insertOne(product);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const result = await db.collection("products").updateOne({ id }, { $set: data });
  return result.modifiedCount > 0;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const result = await db.collection("products").deleteOne({ id });
  return result.deletedCount > 0;
}