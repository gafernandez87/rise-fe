import { SiteHeader } from "@/components/layout/site-header";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <h1 className="text-3xl font-semibold">Editar caso</h1>
        <p className="mt-3 text-[color:var(--color-muted)]">
          Formulario placeholder para el caso {id}. En la siguiente etapa se conecta al CRUD.
        </p>
      </main>
    </>
  );
}
