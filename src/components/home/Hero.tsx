import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            New Season Arrivals
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            Shopping made
            <span className="text-secondary"> effortless.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted">
            Discover curated electronics, fashion, and home essentials —
            handpicked quality, delivered to your door.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl">
            <Image
              src="https://picsum.photos/seed/hero-shopping/800/800"
              alt="Featured products"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="absolute -left-4 bottom-6 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-lg sm:-left-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20">
              <Star className="h-4 w-4 fill-accent text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">4.8/5</p>
              <p className="text-xs text-muted">12k+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}