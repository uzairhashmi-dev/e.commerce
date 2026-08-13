"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some((item) => item.productId === product.id);
        if (exists) return;

        set((state) => ({
          items: [
            ...state.items,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images[0],
              category: product.category,
              rating: product.rating,
              stock: product.stock,
            },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.productId === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: "wishlist-storage" }
  )
);