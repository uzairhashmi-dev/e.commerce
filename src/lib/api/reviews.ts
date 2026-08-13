import type { Review } from "@/types";

const sampleReviews: Review[] = [
  {
    id: "rev-1",
    author: "Ayesha K.",
    rating: 5,
    comment: "Exactly as described, great quality for the price. Fast delivery too.",
    date: "2026-06-12",
  },
  {
    id: "rev-2",
    author: "Bilal M.",
    rating: 4,
    comment: "Good product overall, packaging could be better.",
    date: "2026-05-28",
  },
  {
    id: "rev-3",
    author: "Sara A.",
    rating: 5,
    comment: "Loved it! Will definitely order again.",
    date: "2026-05-10",
  },
];

export async function getProductReviews(productId: string): Promise<Review[]> {
  return sampleReviews;
}