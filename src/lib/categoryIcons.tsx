import { Smartphone, Shirt, Footprints, Watch, Sofa, type LucideIcon } from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  electronics: Smartphone,
  fashion: Shirt,
  shoes: Footprints,
  accessories: Watch,
  home: Sofa,
};

export const categoryColors: Record<string, string> = {
  electronics: "bg-secondary/10 text-secondary",
  fashion: "bg-accent/10 text-accent",
  shoes: "bg-primary/10 text-primary",
  accessories: "bg-secondary/10 text-secondary",
  home: "bg-accent/10 text-accent",
};