"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    login(email);
    router.push("/profile");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-muted/10 bg-card p-8">
        <h1 className="text-2xl font-bold text-text">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">
          This is a frontend demo login — no real authentication is performed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-muted/20 bg-background py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-muted/20 bg-background py-2.5 pl-9 pr-9 text-sm text-text outline-none focus:border-secondary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-muted/40 accent-secondary"
              />
              Remember me
            </label>
            <button type="button" className="text-secondary hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link href="/login" className="font-medium text-secondary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}