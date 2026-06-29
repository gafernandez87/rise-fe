import { CountryProfilePageView } from "@/components/pages/public-pages";
import { getLocalizedCountries } from "@/lib/i18n";

type CountryProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLocalizedCountries("es").map((country) => ({ slug: country.slug }));
}

export default async function CountryProfilePage({ params }: CountryProfilePageProps) {
  const { slug } = await params;

  return <CountryProfilePageView locale="es" currentPath={`/perfiles/${slug}`} slug={slug} />;
}
