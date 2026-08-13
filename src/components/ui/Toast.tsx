"use client";

import { CheckCircle2 } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

export function Toast() {
  const message = useToastStore((state) => state.message);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-background shadow-lg">
        <CheckCircle2 className="h-4 w-4 text-success" />
        {message}
      </div>
    </div>
  );
}