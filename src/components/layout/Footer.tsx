import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const benefits = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over Rs. 3,000" },
  { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
  { icon: Headset, label: "24/7 Support", desc: "Dedicated support" },
];

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
];

const accountLinks = [
  { label: "My Profile", href: "/profile" },
  { label: "My Orders", href: "/orders" },
  { label: "Login", href: "/login" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-muted/10 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 border-b border-muted/10 pb-10 sm:grid-cols-4">
          {benefits.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="h-6 w-6 shrink-0 text-secondary" />
              <div>
                <p className="text-sm font-semibold text-text">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-primary">
              Shop<span className="text-secondary">Ease</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Elegance, tailored for you.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-text">Shop</p>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-text">Account</p>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-text">Company</p>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted/60">About Us (coming soon)</li>
              <li className="text-sm text-muted/60">Contact (coming soon)</li>
              <li className="text-sm text-muted/60">Careers (coming soon)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted/10 pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}