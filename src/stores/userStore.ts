"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const mockUser: User = {
  firstName: "Uzair",
  lastName: "Ahmed",
  email: "uzair@example.com",
  phone: "+92 300 1234567",
  address: "123 Main Street",
  city: "Lahore",
  country: "Pakistan",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      login: (email) => {
        set({
          user: { ...mockUser, email },
          isLoggedIn: true,
        });
      },

      logout: () => set({ user: null, isLoggedIn: false }),

      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: "user-storage" }
  )
);