import type { ReactNode } from "react";
import { BookOpen, FileText, Loader2, Plus } from "lucide-react";

function LoadingSidebarItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[color:var(--color-muted)]">
      {icon}
      <span className="truncate">{label}</span>
      <span className="h-5 w-7 rounded-md bg-[color:var(--color-surface-muted)]" />
    </div>
  );
}

function LoadingLine({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-[color:var(--color-surface-muted)] ${className}`} />;
}

export default function BackofficeLoading() {
  return (
    <main className="min-h-screen bg-[color:var(--color-background)] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-[color:var(--color-border)] bg-white p-3 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-4">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            Backoffice
          </p>
          <p className="mt-1 text-lg font-semibold">Contenido RISE</p>
        </div>

        <nav aria-label="Secciones del backoffice" className="mt-3 grid gap-1">
          <LoadingSidebarItem icon={<Plus size={17} aria-hidden="true" />} label="Medidas" />
          <LoadingSidebarItem icon={<FileText size={17} aria-hidden="true" />} label="Perfiles" />
          <LoadingSidebarItem icon={<BookOpen size={17} aria-hidden="true" />} label="Historias" />
        </nav>
      </aside>

      <section className="min-w-0 px-4 py-6 md:px-6 lg:min-h-screen lg:px-8">
        <div className="mx-auto max-w-[1120px] space-y-5" aria-busy="true" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Cargando backoffice
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Loader2 className="animate-spin text-[color:var(--color-primary)]" size={20} aria-hidden="true" />
                <h1 className="text-3xl font-semibold">Preparando contenido</h1>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <LoadingLine className="h-6 w-20" />
                <LoadingLine className="h-6 w-28" />
                <LoadingLine className="h-6 w-28" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <LoadingLine className="h-10 w-full" />
            <LoadingLine className="h-40 w-full" />
            <LoadingLine className="h-40 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
