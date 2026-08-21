"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  User,
  Sun,
  Moon,
  LogOut,
  Package,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "@/hooks/useTheme";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
];

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, toggleTheme } = useTheme();

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = searchValue.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMobileOpen(false);
  }

  function handleLogout() {
    setProfileMenuOpen(false);
    signOut({ callbackUrl: "/login" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-muted/10 bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text transition-colors hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-sm md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-muted/20 bg-background py-2 pl-9 pr-4 text-sm text-text outline-none transition-colors focus:border-secondary"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-text transition-colors hover:bg-background"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden rounded-full p-2 text-text transition-colors hover:bg-background sm:block"
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-primary">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-text transition-colors hover:bg-background"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-primary">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative hidden sm:block" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label="Account menu"
                className="flex items-center gap-1 rounded-full p-2 text-text transition-colors hover:bg-background"
              >
                <User className="h-5 w-5" />
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-muted/10 bg-card p-2 shadow-lg">
                  <div className="border-b border-muted/10 px-3 py-2">
                    <p className="line-clamp-1 text-sm font-semibold text-text">
                      {session.user?.name}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted">{session.user?.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-background"
                  >
                    <User className="h-4 w-4 text-secondary" />
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-background"
                  >
                    <Package className="h-4 w-4 text-secondary" />
                    My Orders
                  </Link>
                  {session.user?.role === "admin" && (
                   <Link
                       href="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                         className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-background"
                          >
                         <Shield className="h-4 w-4 text-secondary" />
                       Admin Panel
                     </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-muted/10 px-3 py-2 pt-3 text-left text-sm text-error transition-colors hover:bg-error/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="hidden rounded-full p-2 text-text transition-colors hover:bg-background sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-text transition-colors hover:bg-background md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-muted/10 bg-card px-4 pb-4 pt-2 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-muted/20 bg-background py-2 pl-9 pr-4 text-sm text-text outline-none focus:border-secondary"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
            >
              Wishlist
            </Link>
            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error transition-colors hover:bg-error/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}