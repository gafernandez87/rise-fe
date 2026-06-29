import { StoryPageView } from "@/components/pages/public-pages";
import { getLocalizedCountries } from "@/lib/i18n";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLocalizedCountries("es").map((country) => ({ slug: country.slug }));
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  return <StoryPageView locale="es" currentPath={`/historias/${slug}`} slug={slug} />;
}
