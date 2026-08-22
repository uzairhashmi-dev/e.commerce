export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/api/products";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body.name?.trim() || !body.category || !body.price) {
    return NextResponse.json(
      { error: "Name, category, and price are required" },
      { status: 400 }
    );
  }

  const price = Number(body.price);
  const originalPrice = body.originalPrice ? Number(body.originalPrice) : undefined;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  const updated = await updateProduct(id, {
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    category: body.category,
    price,
    originalPrice,
    discount,
    images: body.images,
    stock: Number(body.stock) || 0,
    colors: body.colors
      ? body.colors.split(",").map((c: string) => c.trim()).filter(Boolean)
      : undefined,
    sizes: body.sizes
      ? body.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
      : undefined,
    sku: body.sku?.trim() ?? "",
    fabric: body.fabric?.trim() || undefined,
    pieceCount: body.pieceCount ? Number(body.pieceCount) : undefined,
    stitched: body.stitched ?? undefined,
    isBestSeller: !!body.isBestSeller,
    isNewArrival: !!body.isNewArrival,
  });

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}