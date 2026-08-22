"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: { name: string; email: string };
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const showLabels = mobileOpen || !collapsed;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-background">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-muted/10 bg-primary text-background transition-all duration-200 lg:static lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 items-center border-b border-background/10 ${
            showLabels ? "justify-between px-4" : "justify-center px-2"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 shrink-0 text-accent" />
            {showLabels && <span className="font-bold">ShopEase Admin</span>}
          </div>

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden rounded-lg p-1.5 text-background/70 hover:bg-background/10 hover:text-background lg:block ${
              !showLabels ? "hidden" : ""
            }`}
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-background/70 hover:bg-background/10 hover:text-background lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!showLabels && (
          <div className="hidden justify-center border-b border-background/10 py-2 lg:flex">
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="rounded-lg p-1.5 text-background/70 hover:bg-background/10 hover:text-background"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                title={!showLabels ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  !showLabels ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-background/10 text-background"
                    : "text-background/70 hover:bg-background/5 hover:text-background"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {showLabels && item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-muted/10 bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-text hover:bg-background lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{admin.name}</p>
              <p className="truncate text-xs text-muted">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-full border border-muted/20 px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}