import { Shirt, Layers, Scissors, Sun, Flower2, type LucideIcon } from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  shirts: Shirt,
  suits: Layers,
  unstitched: Scissors,
  lawn: Sun,
  kurtis: Flower2,
};

export const categoryColors: Record<string, string> = {
  shirts: "bg-secondary/10 text-secondary",
  suits: "bg-accent/10 text-accent",
  unstitched: "bg-primary/10 text-primary",
  lawn: "bg-secondary/10 text-secondary",
  kurtis: "bg-accent/10 text-accent",
};