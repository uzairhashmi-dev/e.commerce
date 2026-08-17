"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PackageX } from "lucide-react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <PackageX className="h-12 w-12 text-error" />
      <h2 className="mt-4 text-xl font-bold text-text">Couldn't load this product</h2>
      <p className="mt-2 text-sm text-muted">Something went wrong while fetching this product.</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/products"
          className="rounded-full border border-muted/20 px-5 py-2.5 text-sm font-semibold text-text hover:bg-card"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}