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
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
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
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`flex flex-col border-r border-muted/10 bg-primary text-background transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-background/10 px-4">
          <ShieldCheck className="h-6 w-6 shrink-0 text-accent" />
          {!collapsed && <span className="font-bold">ShopEase Admin</span>}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-background/10 text-background"
                    : "text-background/70 hover:bg-background/5 hover:text-background"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-background/10 p-3">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-background/70 hover:bg-background/5 hover:text-background"
          >
            {collapsed ? (
              <ChevronsRight className="h-4.5 w-4.5" />
            ) : (
              <>
                <ChevronsLeft className="h-4.5 w-4.5" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-muted/10 bg-card px-6">
          <div>
            <p className="text-sm font-semibold text-text">{admin.name}</p>
            <p className="text-xs text-muted">{admin.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-muted/20 px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}