import type { AdaptationCase, Category, MapCase } from "@/types/cases";

export const placeholderCategories: Category[] = [
  {
    id: "water",
    name: "Gestion comunitaria del agua",
    slug: "gestion-del-agua",
    description: "Placeholder de categoria.",
  },
  {
    id: "cities",
    name: "Infraestructura verde",
    slug: "ciudades-resilientes",
    description: "Placeholder de categoria.",
  },
  {
    id: "food",
    name: "Agricultura resiliente",
    slug: "sistemas-alimentarios",
    description: "Placeholder de categoria.",
  },
];

export const placeholderCases: AdaptationCase[] = [
  {
    id: "andes-water",
    title: "Gestion comunitaria del agua en contexto de sequia",
    slug: "gestion-comunitaria-agua-sequia",
    shortDescription:
      "Caso placeholder sobre gobernanza local del agua y resiliencia hidrica en territorios expuestos a sequia.",
    fullDescription:
      "Contenido placeholder. Esta pagina quedara conectada al backoffice para mostrar informacion completa, imagenes, fuentes y datos complementarios del caso.",
    severity: "high",
    status: "published",
    latitude: -32.88,
    longitude: -71.25,
    country: "Chile",
    region: "Region de Valparaiso",
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
      "Caso placeholder sobre infraestructura verde urbana y adaptacion frente al calor extremo.",
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
    title: "Agricultura resiliente frente a inundaciones",
    slug: "agricultura-resiliente-inundaciones",
    shortDescription:
      "Caso placeholder sobre practicas productivas resilientes ante inundaciones y variabilidad climatica.",
    fullDescription:
      "Contenido placeholder. El backoffice permitira editar esta informacion y administrar multiples imagenes.",
    severity: "critical",
    status: "published",
    latitude: 14.08,
    longitude: -87.21,
    country: "Honduras",
    region: "Francisco Morazan",
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
  {
    id: "coastal-food-2",
    title: "Agricultura resiliente frente a inundaciones",
    slug: "agricultura-resiliente-inundaciones",
    shortDescription:
      "Caso placeholder sobre practicas productivas resilientes ante inundaciones y variabilidad climatica.",
    fullDescription:
      "Contenido placeholder. El backoffice permitira editar esta informacion y administrar multiples imagenes.",
    severity: "critical",
    status: "published",
    latitude: 14.08,
    longitude: -88.21,
    country: "Honduras",
    region: "Francisco Morazan",
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
