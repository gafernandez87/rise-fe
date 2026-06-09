import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getCaseBySlug, getPublishedCases } from "@/lib/api";
import { siteConfig } from "@/lib/site";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseBySlug(slug);
  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const url = `${siteConfig.siteUrl}/casos/${item.slug}`;

  return {
    title: item.title,
    description: item.shortDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: item.title,
      description: item.shortDescription,
      url,
      type: "article",
      images: cover ? [{ url: cover.url, alt: cover.altText }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.shortDescription,
      images: cover ? [cover.url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const cases = await getPublishedCases();
  return cases.map((item) => ({ slug: item.slug }));
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const item = await getCaseBySlug(slug);

  if (!item) {
    notFound();
  }

  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.shortDescription,
    image: cover?.url,
    spatialCoverage: [item.country, item.region].filter(Boolean).join(", "),
  };

  return (
    <>
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          {cover ? (
            <Image
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={cover.url}
              alt={cover.altText}
              width={960}
              height={720}
              priority
              unoptimized
            />
          ) : null}
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              {item.category.name} · {item.severity}
            </p>
            <h1 className="text-4xl font-semibold leading-tight">{item.title}</h1>
            <p className="text-lg leading-8 text-[color:var(--color-muted)]">
              {item.shortDescription}
            </p>
            <dl className="grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold">Pais</dt>
                <dd className="text-[color:var(--color-muted)]">{item.country ?? "TBD"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Region</dt>
                <dd className="text-[color:var(--color-muted)]">{item.region ?? "TBD"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Latitud</dt>
                <dd className="text-[color:var(--color-muted)]">{item.latitude}</dd>
              </div>
              <div>
                <dt className="font-semibold">Longitud</dt>
                <dd className="text-[color:var(--color-muted)]">{item.longitude}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="page-shell pb-14">
          <div className="rounded-lg bg-white p-6 leading-8 text-[color:var(--color-muted)]">
            {item.fullDescription}
          </div>
        </section>
      </main>
    </>
  );
}
