import { CountryProfilePageView } from "@/components/pages/public-pages";
import { getPublishedCountryProfiles } from "@/lib/api";

type CountryProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const countries = await getPublishedCountryProfiles();

  return countries.map((country) => ({ slug: country.slug }));
}

export default async function CountryProfilePage({ params }: CountryProfilePageProps) {
  const { slug } = await params;

  return <CountryProfilePageView locale="es" currentPath={`/perfiles/${slug}`} slug={slug} />;
}
