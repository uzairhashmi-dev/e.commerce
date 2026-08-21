export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shopease");
    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = await createAdminToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}