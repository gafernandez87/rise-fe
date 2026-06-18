import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { projectCountries } from "@/lib/rise-content";

const findings = [
  "Los riesgos climaticos prioritarios se intensifican cuando coinciden con desigualdad territorial.",
  "Las medidas con mayor potencial combinan soluciones basadas en la naturaleza, gobernanza local y educacion climatica.",
  "Las juventudes cumplen un rol clave para comunicar riesgos, activar redes y sostener aprendizajes comunitarios.",
];

export default function RegionalReportPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Informe regional
              </p>
              <h1 className="mt-2 text-4xl font-semibold">RISE: riesgo, adaptacion y resiliencia juvenil</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">
                El informe regional RISE reune los principales hallazgos del analisis de riesgo y
                vulnerabilidad climatica en seis paises de America Latina, junto con medidas de
                adaptacion e historias de resiliencia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Descargar PDF
                </a>
                <a
                  href="#resumen"
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  Leer online
                </a>
              </div>
            </div>
            <div className="grid aspect-[3/4] place-items-center rounded-lg bg-[color:var(--color-surface-muted)] p-8 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  Portada
                </p>
                <p className="mt-3 text-3xl font-semibold">Informe Regional RISE</p>
              </div>
            </div>
          </div>
        </section>

        <section id="resumen" className="page-shell grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-semibold">Resumen ejecutivo</h2>
            <p className="mt-4 text-sm leading-6 text-[color:var(--color-muted)]">
              Esta version web deja preparada la lectura online del informe, sus principales
              hallazgos, visualizaciones clave, enlaces a perfiles nacionales e historias
              multimedia.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {findings.map((finding) => (
              <article key={finding} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">{finding}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-10">
          <div className="page-shell space-y-5">
            <h2 className="text-2xl font-semibold">Perfiles vinculados</h2>
            <div className="flex flex-wrap gap-3">
              {projectCountries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/perfiles/${country.slug}`}
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
