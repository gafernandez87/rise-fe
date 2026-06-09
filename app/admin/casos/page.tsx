import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedCases } from "@/lib/api";

export default async function AdminCasesPage() {
  const cases = await getPublishedCases();

  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Backoffice
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Casos</h1>
          </div>
          <Link
            href="/admin/casos/nuevo"
            className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Nuevo caso
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color:var(--color-surface-muted)]">
              <tr>
                <th className="p-3">Titulo</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Severidad</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id} className="border-t border-[color:var(--color-border)]">
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">{item.category.name}</td>
                  <td className="p-3">{item.severity}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <Link href={`/admin/casos/${item.id}`} className="font-semibold">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
