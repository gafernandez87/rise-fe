import type { AdaptationCase, Category, MapCase } from "@/types/cases";

export const placeholderCategories: Category[] = [
  {
    id: "water",
    name: "Gestion del agua",
    slug: "gestion-del-agua",
    description: "Placeholder de categoria.",
  },
  {
    id: "cities",
    name: "Ciudades resilientes",
    slug: "ciudades-resilientes",
    description: "Placeholder de categoria.",
  },
  {
    id: "food",
    name: "Sistemas alimentarios",
    slug: "sistemas-alimentarios",
    description: "Placeholder de categoria.",
  },
];

export const placeholderCases: AdaptationCase[] = [
  {
    id: "andes-water",
    title: "Restauracion de humedales altoandinos",
    slug: "restauracion-humedales-altoandinos",
    shortDescription:
      "Caso placeholder sobre recuperacion de ecosistemas para mejorar resiliencia hidrica.",
    fullDescription:
      "Contenido placeholder. Esta pagina quedara conectada al backoffice para mostrar informacion completa, imagenes, fuentes y datos complementarios del caso.",
    severity: "high",
    status: "published",
    latitude: -16.5,
    longitude: -68.15,
    country: "Bolivia",
    region: "La Paz",
    sourceUrl: null,
    category: placeholderCategories[0],
    images: [
      {
        id: "andes-water-cover",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        altText: "Paisaje natural usado como imagen placeholder.",
        sortOrder: 0,
        isCover: true,
      },
    ],
  },
  {
    id: "urban-heat",
    title: "Corredores verdes contra islas de calor",
    slug: "corredores-verdes-islas-calor",
    shortDescription:
      "Caso placeholder sobre infraestructura verde urbana y adaptacion climatica.",
    fullDescription:
      "Contenido placeholder. Luego se reemplazara por el relato completo del caso, ubicacion, imagenes y datos institucionales.",
    severity: "medium",
    status: "published",
    latitude: -34.6,
    longitude: -58.38,
    country: "Argentina",
    region: "Buenos Aires",
    sourceUrl: null,
    category: placeholderCategories[1],
    images: [
      {
        id: "urban-heat-cover",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        altText: "Ciudad con arbolado usado como imagen placeholder.",
        sortOrder: 0,
        isCover: true,
      },
    ],
  },
  {
    id: "coastal-food",
    title: "Agricultura costera adaptada a sequias",
    slug: "agricultura-costera-adaptada-sequias",
    shortDescription:
      "Caso placeholder sobre practicas productivas resilientes ante variabilidad climatica.",
    fullDescription:
      "Contenido placeholder. El backoffice permitira editar esta informacion y administrar multiples imagenes.",
    severity: "critical",
    status: "published",
    latitude: -12.04,
    longitude: -77.03,
    country: "Peru",
    region: "Lima",
    sourceUrl: null,
    category: placeholderCategories[2],
    images: [
      {
        id: "coastal-food-cover",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        altText: "Campo agricola usado como imagen placeholder.",
        sortOrder: 0,
        isCover: true,
      },
    ],
  },
];

export const placeholderMapCases: MapCase[] = placeholderCases.map((item) => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  shortDescription: item.shortDescription,
  severity: item.severity,
  latitude: item.latitude,
  longitude: item.longitude,
  country: item.country,
  region: item.region,
  category: item.category,
  coverImageUrl: item.images.find((image) => image.isCover)?.url,
}));
