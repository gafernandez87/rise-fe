import { MapPageView } from "@/components/pages/public-pages";
import { readMapInitialFilters, type SearchParamsRecord } from "@/lib/map-filters";

type MapPageProps = {
  searchParams: Promise<SearchParamsRecord>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const initialFilters = readMapInitialFilters(await searchParams);

  return <MapPageView locale="es" currentPath="/mapa" initialFilters={initialFilters} />;
}
