"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Package, Heart, LogOut } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const orders = useOrderStore((state) => state.orders);
  const wishlistItems = useWishlistStore((state) => state.items);

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <User className="h-12 w-12 text-muted" />
        <h1 className="mt-4 text-xl font-bold text-text">You're not logged in</h1>
        <p className="mt-2 text-sm text-muted">Log in to view your profile.</p>
        <Link
          href="/login"
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  function handleLogout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-muted/10 bg-card p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <User className="h-7 w-7 text-secondary" />
            </div>
            <p className="mt-3 font-semibold text-text">{session.user.name}</p>
            <p className="text-xs text-muted">{session.user.email}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-muted/10 bg-card p-4">
            <Link
              href="/orders"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-text hover:bg-background"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-secondary" />
                Order History
              </span>
              <span className="text-xs text-muted">{orders.length}</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-text hover:bg-background"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-secondary" />
                Wishlist
              </span>
              <span className="text-xs text-muted">{wishlistItems.length}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/10"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </aside>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-muted/10 bg-card p-6">
            <h2 className="text-sm font-bold text-text">Account Information</h2>
            <p className="mt-1 text-xs text-muted">
              Editable fields (phone, address) will be added in a future update.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Name</label>
                <input
                  value={session.user.name ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-muted outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Email</label>
                <input
                  value={session.user.email ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-muted outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}