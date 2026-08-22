"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { categoryIcons } from "@/lib/categoryIcons";
import type { Category } from "@/types";

const ICON_OPTIONS = ["shirts", "suits", "unstitched", "lawn", "kurtis"];

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("shirts");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function openCreate() {
    setEditing(null);
    setName("");
    setIcon("shirts");
    setError("");
    setShowForm(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setIcon(category.icon);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div>
      <button
        onClick={openCreate}
        className="mb-4 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </button>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-muted/10 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={() => setShowForm(false)} aria-label="Close">
              <X className="h-4 w-4 text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-muted/20 bg-background px-3 py-2 text-sm text-text outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((opt) => {
                  const Icon = categoryIcons[opt];
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIcon(opt)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                        icon === opt
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-muted/20 text-muted hover:border-text"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-xs text-error">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Saving..." : editing ? "Save Changes" : "Create Category"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {initialCategories.map((category) => {
          const Icon = categoryIcons[category.icon] ?? categoryIcons.shirts;
          return (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-2xl border border-muted/10 bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{category.name}</p>
                  <p className="text-xs text-muted">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(category)}
                  aria-label="Edit"
                  className="rounded-lg p-2 text-muted hover:bg-background hover:text-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-muted hover:bg-background hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}