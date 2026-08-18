import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Truck, RotateCcw, Wallet } from "lucide-react";

const trustPoints = [
  { icon: Truck, label: "Free shipping over Rs. 3,000" },
  { icon: RotateCcw, label: "7-day easy returns" },
  { icon: Wallet, label: "Cash on delivery available" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Festive edit — New In
            </span>
          </div>

          <h1 className="mt-5 font-serif text-5xl leading-[1.1] text-text sm:text-6xl">
            Elegance,
            <br />
            <span className="italic text-secondary">tailored</span> for you.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
            Shirts, Ladies suits, and lawn essentials — hand-picked fabrics
            and detailing, made for comfort that doesn't compromise on style.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Shop the Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=lawn"
              className="text-sm font-semibold text-text underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-secondary"
            >
              Explore Lawn edit
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-muted/10 pt-6 sm:grid-cols-3">
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-secondary" />
                <span className="text-xs text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-accent/10 blur-2xl" />

          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl sm:max-w-lg lg:ml-auto">
            <Image
              src="https://images.unsplash.com/photo-1733209590486-4ed0bfcbc52a?w=800&h=1000&q=80&auto=format&fit=crop"
              alt="Ladies fashion collection"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-2xl bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20">
                <Star className="h-4 w-4 fill-accent text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">4.8/5</p>
                <p className="text-xs text-muted">14k+ happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}