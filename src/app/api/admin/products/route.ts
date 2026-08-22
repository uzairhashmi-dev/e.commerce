export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { getAllProducts, createProduct } from "@/lib/api/products";
import type { Product } from "@/types";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  if (!body.name?.trim() || !body.category || !body.price) {
    return NextResponse.json(
      { error: "Name, category, and price are required" },
      { status: 400 }
    );
  }

  if (!body.images || body.images.length === 0) {
    return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
  }

  const price = Number(body.price);
  const originalPrice = body.originalPrice ? Number(body.originalPrice) : undefined;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  const product: Product & { createdAt: Date } = {
    id: `prod-${Date.now().toString(36)}`,
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    category: body.category,
    price,
    originalPrice,
    discount,
    rating: 0,
    reviews: 0,
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
    createdAt: new Date(),
  };

  await createProduct(product);

  return NextResponse.json({ success: true, product });
}