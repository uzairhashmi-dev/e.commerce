"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  increaseQuantity: (productId: string, color?: string, size?: string) => void;
  decreaseQuantity: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function sameLine(a: CartItem, productId: string, color?: string, size?: string) {
  return a.productId === productId && a.color === color && a.size === size;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, color, size) => {
        set((state) => {
          const existing = state.items.find((item) =>
            sameLine(item, product.id, color, size)
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                sameLine(item, product.id, color, size)
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, item.stock),
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                color,
                size,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
          };
        });
      },

      removeItem: (productId, color, size) => {
        set((state) => ({
          items: state.items.filter((item) => !sameLine(item, productId, color, size)),
        }));
      },

      increaseQuantity: (productId, color, size) => {
        set((state) => ({
          items: state.items.map((item) =>
            sameLine(item, productId, color, size)
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item
          ),
        }));
      },

      decreaseQuantity: (productId, color, size) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              sameLine(item, productId, color, size)
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);