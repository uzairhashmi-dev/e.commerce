export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateOrderStatus } from "@/lib/api/orders";

const VALID_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status);

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}