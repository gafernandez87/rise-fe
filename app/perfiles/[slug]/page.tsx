import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getCountryBySlug, projectCountries } from "@/lib/rise-content";

type CountryProfilePageProps = {
  params: Promise<{ slug: string }>;
};

const sections = [
  "Resumen ejecutivo",
  "Riesgos climaticos prioritarios",
  "Exposicion",
  "Vulnerabilidad",
  "Marco normativo e institucional",
  "Sectores criticos",
  "Zonas priorizadas",
  "Medidas de adaptacion identificadas",
  "Historia destacada",
  "Fuentes",
];

export function generateStaticParams() {
  return projectCountries.map((country) => ({ slug: country.slug }));
}

export default async function CountryProfilePage({ params }: CountryProfilePageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Perfil nacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{country.name}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">{country.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/mapa"
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Ver casos en el mapa
                </Link>
                <a
                  href="#"
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  Descargar perfil PDF
                </a>
              </div>
            </div>
            <dl className="grid gap-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold">Riesgo principal</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.mainRisk}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">Sector mas afectado</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.sector}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">Territorio priorizado</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.territory}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">Medidas identificadas</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.measuresCount}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="page-shell grid gap-5 py-10 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="text-xl font-semibold">{section}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                Contenido editorial por completar con datos del perfil de {country.name}. Esta
                estructura deja lista la version web navegable y el enlace al PDF descargable.
              </p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
