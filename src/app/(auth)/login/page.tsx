"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { validateEmail, validatePassword, validateSignupForm } from "@/lib/validation";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function resetErrors() {
    setFormError("");
    setFieldErrors({});
    setSuccessMessage("");
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetErrors();
    setPassword("");
    setConfirmPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();

    const emailError = validateEmail(email);
    const passwordError = !password ? "Password is required" : null;
    if (emailError || passwordError) {
      setFieldErrors({ email: emailError ?? "", password: passwordError ?? "" });
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setFormError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();

    const errors = validateSignupForm({ firstName, lastName, email, password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setFormError(data.error ?? "Something went wrong.");
      return;
    }

    setLoading(false);
    setSuccessMessage("Account created! Please log in.");
    switchMode("login");
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl });
  }

  const passwordHint = mode === "signup" && password ? validatePassword(password) : null;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — Branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-background lg:flex">
        <div className="absolute -inset-24 -z-10 rounded-full bg-accent/10 blur-3xl" />

        <Link href="/" className="text-xl font-bold tracking-tight">
          Shop<span className="text-accent">Ease</span>
        </Link>

        <div>
          <p className="font-serif text-4xl italic leading-tight">
            &quot;Elegance, tailored for you.&quot;
          </p>
          <p className="mt-4 max-w-sm text-sm text-background/70">
            Join thousands of customers who trust ShopEase for shirts, ladies
            suits, and lawn essentials — crafted with care, delivered with love.
          </p>
        </div>

        <p className="text-xs text-background/50">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 block text-xl font-bold text-primary lg:hidden">
            Shop<span className="text-secondary">Ease</span>
          </Link>

          <h1 className="text-2xl font-bold text-text">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "login"
              ? "Log in to continue shopping."
              : "Join ShopEase in just a minute."}
          </p>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-muted/20 bg-card py-2.5 text-sm font-semibold text-text transition-colors hover:bg-background"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-muted/15" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-muted/15" />
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {formError}
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {successMessage}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">First Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-muted/20 bg-card py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-secondary"
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-error">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-muted/20 bg-card px-3 py-2.5 text-sm text-text outline-none focus:border-secondary"
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-error">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-muted/20 bg-card py-2.5 pl-9 pr-9 text-sm text-text outline-none focus:border-secondary"
                />
                {email && !validateEmail(email) && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-error">{fieldErrors.email}</p>
              )}
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
                  className="w-full rounded-lg border border-muted/20 bg-card py-2.5 pl-9 pr-9 text-sm text-text outline-none focus:border-secondary"
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
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-error">{fieldErrors.password}</p>
              )}
              {mode === "signup" && !fieldErrors.password && (
                <p className="mt-1 text-xs text-muted">
                  {passwordHint ?? "8+ characters, uppercase, lowercase, number & symbol."}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Confirm Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-muted/20 bg-card py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-secondary"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-error">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-end text-sm">
                <button type="button" className="text-secondary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Log In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="font-medium text-secondary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="font-medium text-secondary hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}