import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { projectCountries } from "@/lib/rise-content";

export default function CountryProfilesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-8 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            Perfiles de pais
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Riesgo y vulnerabilidad climatica</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            Cada perfil funciona como una visualizacion nacional con riesgos prioritarios, sectores
            criticos, medidas identificadas e historia destacada.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectCountries.map((country) => (
            <article key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {country.territory}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{country.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{country.summary}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold">Riesgo principal</dt>
                  <dd className="text-[color:var(--color-muted)]">{country.mainRisk}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Sector mas afectado</dt>
                  <dd className="text-[color:var(--color-muted)]">{country.sector}</dd>
                </div>
              </dl>
              <Link
                href={`/perfiles/${country.slug}`}
                className="mt-5 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Ver perfil
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
