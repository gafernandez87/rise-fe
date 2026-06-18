import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { projectCountries } from "@/lib/rise-content";

export default function StoriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-8 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            Historias de resiliencia
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Conoce los 6 casos mas destacados de Latinoamerica</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            Relatos multimedia que conectan riesgos climaticos con respuestas concretas impulsadas
            por juventudes, comunidades y organizaciones territoriales.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectCountries.map((country) => (
            <article key={country.slug} className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
              <div className="grid aspect-video place-items-center bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
                Video + descripcion
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {country.name}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{country.storyTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  Historia destacada sobre {country.mainRisk.toLowerCase()} en {country.territory.toLowerCase()}.
                </p>
                <Link
                  href={`/historias/${country.slug}`}
                  className="mt-5 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Ver historia
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
