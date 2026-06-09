import { SiteHeader } from "@/components/layout/site-header";
import { MapLoader } from "@/components/map/map-loader";
import { getCategories, getMapCases } from "@/lib/api";

export default async function MapPage() {
  const [cases, categories] = await Promise.all([getMapCases(), getCategories()]);

  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Mapa interactivo
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Casos de adaptacion</h1>
          </div>
          <p className="text-sm text-[color:var(--color-muted)]">{cases.length} casos publicados</p>
        </div>

        <aside className="grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-4 md:grid-cols-4">
          <input
            className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
            placeholder="Buscar por texto"
          />
          <select className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm">
            <option>Categoria</option>
            {categories.map((category) => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>
          <select className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm">
            <option>Severidad</option>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
            <option>Critica</option>
          </select>
          <select className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm">
            <option>Pais</option>
            {[...new Set(cases.map((item) => item.country).filter(Boolean))].map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </aside>

        <MapLoader cases={cases} />
      </main>
    </>
  );
}
