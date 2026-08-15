import Link from "next/link";
import { CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <CompassIcon className="h-12 w-12 text-muted" />
      <h1 className="mt-4 text-3xl font-bold text-text">404</h1>
      <h2 className="mt-1 text-lg font-semibold text-text">Page not found</h2>
      <p className="mt-2 text-sm text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-muted/20 px-6 py-2.5 text-sm font-semibold text-text hover:bg-card"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}