import Link from "next/link";
import { CaseCard } from "@/components/cases/case-card";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedCases } from "@/lib/api";
import { methodologySteps, organizations, projectCountries } from "@/lib/rise-content";

const introCards = [
  {
    title: "Historias de resiliencia",
    href: "/historias",
    text: "Relatos multimedia sobre comunidades, juventudes y soluciones locales.",
  },
  {
    title: "Medidas de adaptacion",
    href: "/mapa",
    text: "Documentacion de acciones que ya estan fortaleciendo la resiliencia.",
  },
  {
    title: "Riesgos climaticos",
    href: "/perfiles",
    text: "Identificacion de amenazas, exposicion y vulnerabilidades por pais.",
  },
];

const findings = [
  "Los impactos climaticos combinan amenazas fisicas con desigualdades territoriales preexistentes.",
  "Las juventudes aportan organizacion, comunicacion y aprendizaje comunitario en medidas de adaptacion.",
  "Las soluciones mas replicables conectan evidencia tecnica, saber local y alianzas institucionales.",
];

function LogoGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
        {title}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="grid min-h-20 place-items-center rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 text-center text-sm font-semibold"
            aria-label={`Logo de ${item}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const cases = await getPublishedCases();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Adaptacion climatica liderada por juventudes
              </p>
              <div className="space-y-3">
                <h1 className="text-5xl font-semibold leading-tight tracking-tight">RISE</h1>
                {/* <p className="text-xl font-medium text-[color:var(--color-primary)]">
                  Resilience Through Innovation, Science & Empowerment
                </p> */}
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
                Una plataforma regional para identificar, documentar y visibilizar medidas de
                adaptacion e historias de resiliencia lideradas por juventudes en America Latina.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mapa"
                  className="rounded-md bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Explorar el mapa
                </Link>
                <Link
                  href="/historias"
                  className="rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold"
                >
                  Ver historias de resiliencia
                </Link>
                <Link
                  href="/informe-regional"
                  className="rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold"
                >
                  Descargar informe regional
                </Link>
              </div>
            </div>
            <div className="rounded-lg bg-[color:var(--color-surface-muted)] p-4">
              <div className="relative grid aspect-[4/3] overflow-hidden rounded-md border border-white/80 bg-[linear-gradient(135deg,#d8ead6,#eef6e9_45%,#ffffff)] p-6">
                <div className="absolute left-10 top-10 h-24 w-24 rounded-full border border-[color:var(--color-accent)]/50" />
                <div className="absolute bottom-12 right-12 h-36 w-36 rounded-full border border-[color:var(--color-primary)]/25" />
                <div className="relative mt-auto max-w-sm rounded-md bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                    America Latina
                  </p>
                  <p className="mt-2 text-2xl font-semibold">Mapa regional de riesgos, medidas e historias</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre-rise" className="page-shell grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Que es RISE
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Conocimiento, territorio y resiliencia</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-8 text-[color:var(--color-muted)]">
              RISE es una iniciativa regional de CLAAC que busca fortalecer la accion climatica en
              America Latina mediante la generacion de conocimiento, documentacion de experiencias
              territoriales y visibilizacion de soluciones de adaptacion y resiliencia.
            </p>
            <p className="text-lg leading-8 text-[color:var(--color-muted)]">
              El proyecto trabaja en Chile, Argentina, Colombia, Mexico, Brasil y Honduras para
              desarrollar perfiles de riesgo y vulnerabilidad climatica, identificar medidas de
              adaptacion existentes y contar historias sobre juventudes frente al cambio climatico.
            </p>
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell grid gap-5 md:grid-cols-3">
            {introCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-lg border border-[color:var(--color-border)] p-5 transition hover:border-[color:var(--color-primary)]"
              >
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{card.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Perfiles de pais
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Seis diagnosticos nacionales</h2>
            </div>
            <Link href="/perfiles" className="text-sm font-semibold text-[color:var(--color-primary)]">
              Ver perfiles
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectCountries.map((country) => (
              <article key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {country.mainRisk}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{country.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{country.summary}</p>
                <Link
                  href={`/perfiles/${country.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[color:var(--color-primary)]"
                >
                  Ver perfil
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[color:var(--color-primary-strong)] py-14 text-white">
          <div className="page-shell space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  Historias de resiliencia
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Conoce los 6 casos mas destacados</h2>
              </div>
              <Link href="/historias" className="text-sm font-semibold text-white">
                Ver historias
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projectCountries.map((country) => (
                <article key={country.slug} className="rounded-lg border border-white/15 p-4">
                  <div className="aspect-video rounded-md bg-white/10" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/70">
                    {country.name}
                  </p>
                  <h3 className="mt-2 font-semibold">{country.storyTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{country.mainRisk}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Mapa interactivo
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Primeras fichas de casos</h2>
            </div>
            <Link href="/mapa" className="text-sm font-semibold text-[color:var(--color-primary)]">
              Explorar mapa
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cases.slice(0, 3).map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Informe regional
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Hallazgos regionales y metodologia</h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--color-muted)]">
                El informe regional RISE reune analisis de riesgo, medidas de adaptacion e historias
                de resiliencia de seis paises de America Latina.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/informe-regional"
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Leer online
                </Link>
                <Link
                  href="/metodologia"
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  Conocer metodologia
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {findings.map((finding) => (
                <div key={finding} className="rounded-lg bg-[color:var(--color-surface-muted)] p-4 text-sm leading-6">
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Metodologia
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Como se documenta RISE</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {methodologySteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
                <p className="text-sm font-semibold text-[color:var(--color-primary)]">Etapa {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                Organizaciones
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Esta iniciativa es impulsada por</h2>
            </div>
            <LogoGroup title="Impulsan" items={organizations.leading} />
            <LogoGroup title="Con el apoyo de" items={organizations.support} />
            <LogoGroup title="Organizaciones participantes" items={organizations.participants} />
          </div>
        </section>
      </main>
    </>
  );
}
