import Link from "next/link";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
      <PackageX className="h-12 w-12 text-muted" />
      <h1 className="mt-4 text-2xl font-bold text-text">Product not found</h1>
      <p className="mt-2 text-sm text-muted">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/products"
        className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90"
      >
        Browse Products
      </Link>
    </div>
  );
}