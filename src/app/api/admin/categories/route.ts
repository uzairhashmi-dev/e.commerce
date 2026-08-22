export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { getAllCategories, createCategory } from "@/lib/api/categories";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { name, icon } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  const id = `cat-${Date.now().toString(36)}`;

  await createCategory({ id, name: name.trim(), slug, icon: icon || "shirts" });

  return NextResponse.json({ success: true });
}