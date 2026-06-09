import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-border)] bg-white/85 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Rise
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-[color:var(--color-muted)]">
          <Link href="/mapa" className="hover:text-[color:var(--color-primary)]">
            Mapa
          </Link>
          <Link href="/admin/casos" className="hover:text-[color:var(--color-primary)]">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
