import { SiteHeader } from "@/components/layout/site-header";
import { methodologySteps, projectCountries } from "@/lib/rise-content";

const criteria = [
  "Paises analizados: Chile, Argentina, Colombia, Mexico, Brasil y Honduras.",
  "Riesgos seleccionados a partir de fuentes nacionales, multilaterales y tecnicas.",
  "Medidas identificadas por relevancia territorial, potencial de aprendizaje y evidencia disponible.",
  "Historias priorizadas por protagonismo juvenil, diversidad geografica y claridad narrativa.",
  "Limitaciones: disponibilidad de datos, comparabilidad regional y actualizacion periodica del contenido.",
];

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell space-y-10 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            Metodologia
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Como se construye RISE</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            La metodologia organiza el proceso de revision, analisis, identificacion de medidas y
            produccion multimedia para que los perfiles, fichas e historias sean comparables.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {methodologySteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <p className="text-sm font-semibold text-[color:var(--color-primary)]">Etapa {index + 1}</p>
              <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{step.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-lg border border-[color:var(--color-border)] bg-white p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-semibold">Criterios y alcance</h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
              Estos criterios resumen que se analiza, como se seleccionan los casos y que limites
              debe transparentar la plataforma.
            </p>
          </div>
          <ul className="grid gap-3 text-sm leading-6 text-[color:var(--color-muted)]">
            {criteria.map((item) => (
              <li key={item} className="rounded-md bg-[color:var(--color-surface-muted)] p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Paises incluidos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectCountries.map((country) => (
              <div key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
                <h3 className="font-semibold">{country.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">{country.mainRisk}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
