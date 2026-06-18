import { SiteHeader } from "@/components/layout/site-header";
import { MapExplorer } from "@/components/map/map-explorer";
import { getCategories, getMapCases } from "@/lib/api";

export default async function MapPage() {
  const [cases, categories] = await Promise.all([getMapCases(), getCategories()]);

  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Mapa interactivo
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Explora casos, paises y medidas</h1>
            <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
              Visualiza los seis paises del proyecto, las medidas de adaptacion identificadas,
              historias destacadas y enlaces a fichas completas.
            </p>
          </div>
          <p className="text-sm text-[color:var(--color-muted)]">{cases.length} casos publicados</p>
        </div>

        <MapExplorer cases={cases} categories={categories} />
      </main>
    </>
  );
}
