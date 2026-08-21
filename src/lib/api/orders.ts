import clientPromise from "@/lib/mongodb";
import type { Order } from "@/types";

export async function createOrder(order: Order): Promise<void> {
  const client = await clientPromise;
  const db = client.db("shopease");
  await db.collection("orders").insertOne(order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const order = await db
    .collection("orders")
    .findOne({ id }, { projection: { _id: 0 } });
  return order as Order | null;
}

export async function getOrdersByUserEmail(email: string): Promise<Order[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const orders = await db
    .collection("orders")
    .find({ userEmail: email }, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .toArray();
    return orders as unknown as Order[];}

    export async function getAllOrders(): Promise<Order[]> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const orders = await db
    .collection("orders")
    .find({}, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .toArray();
    return orders as unknown as Order[];
  }
export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("shopease");
  const result = await db.collection("orders").updateOne({ id }, { $set: { status } });
  return result.modifiedCount > 0;
}