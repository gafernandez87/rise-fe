import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getCountryBySlug, projectCountries } from "@/lib/rise-content";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

const storySections = [
  {
    title: "El desafio",
    text: "Describe que riesgo climatico enfrenta el territorio, a quienes afecta y que factores aumentan la vulnerabilidad.",
  },
  {
    title: "La respuesta",
    text: "Presenta la medida de adaptacion, quienes la impulsaron y como se organizo la comunidad.",
  },
  {
    title: "La historia",
    text: "Espacio para el relato periodistico o testimonial, fotografias, citas, audio y video.",
  },
  {
    title: "Resultados y aprendizajes",
    text: "Sintetiza cambios observados, beneficios, limitaciones y condiciones para replicar la experiencia.",
  },
];

export function generateStaticParams() {
  return projectCountries.map((country) => ({ slug: country.slug }));
}

export default async function StoryPage({ params }: StoryPageProps) {
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
                {country.name} · {country.territory}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{country.storyTitle}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">
                Una historia multimedia sobre juventudes, comunidades y medidas de adaptacion frente
                a {country.mainRisk.toLowerCase()}.
              </p>
            </div>
            <div className="grid aspect-video place-items-center rounded-lg bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
              Imagen o video principal
            </div>
          </div>
        </section>

        <section className="page-shell grid gap-5 py-10 md:grid-cols-2">
          {storySections.map((section) => (
            <article key={section.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{section.text}</p>
            </article>
          ))}
        </section>

        <section className="page-shell pb-12">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
            <h2 className="text-xl font-semibold">Ficha tecnica</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <dt className="font-semibold">Pais</dt>
                <dd className="text-[color:var(--color-muted)]">{country.name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Riesgo principal</dt>
                <dd className="text-[color:var(--color-muted)]">{country.mainRisk}</dd>
              </div>
              <div>
                <dt className="font-semibold">Actores involucrados</dt>
                <dd className="text-[color:var(--color-muted)]">Juventudes, comunidad local y organizaciones aliadas</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/perfiles/${country.slug}`} className="text-sm font-semibold text-[color:var(--color-primary)]">
                Ver perfil del pais
              </Link>
              <Link href="/historias" className="text-sm font-semibold text-[color:var(--color-primary)]">
                Ver otras historias
              </Link>
              <Link href="/mapa" className="text-sm font-semibold text-[color:var(--color-primary)]">
                Explorar mapa
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
