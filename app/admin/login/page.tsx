import { SiteHeader } from "@/components/layout/site-header";

export default function AdminLoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-10">
        <form className="w-full max-w-md space-y-4 rounded-lg border border-[color:var(--color-border)] bg-white p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Backoffice
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Ingresar</h1>
          </div>
          <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Password"
            type="password"
          />
          <button className="rise-action w-full rounded-md bg-[color:var(--color-primary)] px-4 py-2 font-semibold text-white">
            Iniciar sesión
          </button>
        </form>
      </main>
    </>
  );
}
