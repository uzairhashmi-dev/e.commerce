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
        <div
          className={`flex h-16 items-center border-b border-background/10 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 shrink-0 text-accent" />
              <span className="font-bold">ShopEase Admin</span>
            </div>
          )}
          {collapsed && <ShieldCheck className="h-6 w-6 shrink-0 text-accent" />}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`rounded-lg p-1.5 text-background/70 hover:bg-background/10 hover:text-background ${
              collapsed ? "hidden" : ""
            }`}
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {collapsed && (
          <div className="flex justify-center border-b border-background/10 py-2">
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
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
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