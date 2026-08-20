export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrder, getOrdersByUserEmail } from "@/lib/api/orders";
import type { Order } from "@/types";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const body = await request.json();
    const {
      items,
      customer,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customer?.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: session?.user?.id ?? null,
      userEmail: session?.user?.email ?? customer.email,
      date: new Date().toISOString(),
      items,
      customer,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "Processing",
    };

    await createOrder(order);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrdersByUserEmail(session.user.email);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}