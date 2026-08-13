import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-primary px-6 py-10 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="text-2xl font-bold text-background">
            Get 20% off your first order
          </h3>
          <p className="mt-1 text-sm text-background/70">
            Use code WELCOME20 at checkout. Limited time only.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
        >
          Shop the Sale
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}