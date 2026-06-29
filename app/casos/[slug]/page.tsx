import type { Metadata } from "next";
import { CasePageView } from "@/components/pages/public-pages";
import { getCaseBySlug, getPublishedCases } from "@/lib/api";
import { localizeCase } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = localizeCase(await getCaseBySlug(slug), "es");
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

  return <CasePageView locale="es" currentPath={`/casos/${slug}`} slug={slug} />;
}
