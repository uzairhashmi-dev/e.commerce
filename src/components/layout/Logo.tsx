import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80"
    >
      Shop<span className="text-secondary">Ease</span>
    </Link>
  );
}