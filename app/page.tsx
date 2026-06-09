import Link from "next/link";
import { CaseCard } from "@/components/cases/case-card";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedCases } from "@/lib/api";

const videoPlaceholders = Array.from({ length: 6 }, (_, index) => ({
  title: `Video placeholder ${index + 1}`,
  description: "Descripcion TBD del video institucional o caso destacado.",
}));

export default async function Home() {
  const cases = await getPublishedCases();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Adaptacion climatica en Latinoamerica
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight">
              Rise
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
              Sitio web con mapa interactivo de casos de adaptacion al cambio climatico.
              Los textos definitivos estan pendientes y esta base deja preparada la
              estructura para contenido institucional, videos y casos destacados.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/mapa"
                className="rounded-md bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Explorar mapa
              </Link>
              <Link
                href="#videos"
                className="rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold"
              >
                Ver videos
              </Link>
            </div>
          </div>
          <div className="rounded-lg bg-[color:var(--color-surface-muted)] p-6 shadow-[var(--shadow-soft)]">
            <div className="aspect-[4/3] rounded-md bg-[linear-gradient(135deg,#dfeee0,#f8fbf6)] p-6">
              <div className="flex h-full flex-col justify-end rounded-md border border-white/80 p-5">
                <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                  Visual placeholder
                </p>
                <p className="mt-2 text-2xl font-semibold">Mapa regional de casos</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell grid gap-6 md:grid-cols-3">
            {["Problematicas", "Soluciones", "Territorios"].map((title) => (
              <div key={title} className="space-y-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                  Bloque de contenido placeholder para informacion institucional y
                  explicativa del proyecto.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Casos destacados
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Primeros casos de referencia</h2>
            </div>
            <Link href="/mapa" className="text-sm font-semibold text-[color:var(--color-primary)]">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cases.slice(0, 3).map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="videos" className="bg-[color:var(--color-primary-strong)] py-14 text-white">
          <div className="page-shell space-y-6">
            <h2 className="text-3xl font-semibold">Videos</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {videoPlaceholders.map((video) => (
                <article key={video.title} className="rounded-lg border border-white/15 p-4">
                  <div className="aspect-video rounded-md bg-white/10" />
                  <h3 className="mt-4 font-semibold">{video.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{video.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
