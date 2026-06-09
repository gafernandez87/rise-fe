import { SiteHeader } from "@/components/layout/site-header";

export default function NewCasePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <h1 className="text-3xl font-semibold">Nuevo caso</h1>
        <p className="mt-3 text-[color:var(--color-muted)]">
          Formulario placeholder. En la siguiente etapa se conecta al endpoint administrativo.
        </p>
      </main>
    </>
  );
}
