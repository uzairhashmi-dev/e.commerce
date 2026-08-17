"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, LogOut, Settings } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useOrderStore } from "@/stores/orderStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { user, isLoggedIn, logout, updateProfile } = useUserStore();
  const orders = useOrderStore((state) => state.orders);
  const wishlistItems = useWishlistStore((state) => state.items);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
      });
    }
  }, [user]);

  if (!mounted) return null;

  if (!isLoggedIn || !user) {
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

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    logout();
    router.push("/");
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
            <p className="mt-3 font-semibold text-text">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted">{user.email}</p>
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
          <form
            onSubmit={handleSave}
            className="rounded-2xl border border-muted/10 bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-secondary" />
              <h2 className="text-sm font-bold text-text">Account Settings</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">First Name</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Last Name</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted">Email</label>
                <input
                  value={user.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-muted outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Phone</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">City</label>
                <input
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted">Address</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Country</label>
                <input
                  value={formData.country}
                  onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                  className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}