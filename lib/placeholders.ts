import type { AdaptationCase, Category, MapCase } from "@/types/cases";
import type { CountryProfile } from "@/types/country-profiles";
import type { ResilienceStory } from "@/types/stories";
import { projectCountries } from "@/lib/rise-content";

export const placeholderCategories: Category[] = [
  {
    id: "water",
    name: "Gestión comunitaria del agua",
    slug: "gestion-del-agua",
    description: "Placeholder de categoría.",
  },
  {
    id: "cities",
    name: "Infraestructura verde",
    slug: "ciudades-resilientes",
    description: "Placeholder de categoría.",
  },
  {
    id: "food",
    name: "Agricultura resiliente",
    slug: "sistemas-alimentarios",
    description: "Placeholder de categoría.",
  },
];

export const placeholderCases: AdaptationCase[] = [
  {
    id: "andes-water",
    title: "Gestión comunitaria del agua en contexto de sequía",
    slug: "gestion-comunitaria-agua-sequia",
    shortDescription:
      "Caso placeholder sobre gobernanza local del agua y resiliencia hídrica en territorios expuestos a sequía.",
    fullDescription:
      "Contenido placeholder. Esta página quedará conectada al backoffice para mostrar información completa, imágenes, fuentes y datos complementarios del caso.",
    severity: "high",
    status: "published",
    latitude: -32.88,
    longitude: -71.25,
    country: "Chile",
    region: "Región de Valparaiso",
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
      "Caso placeholder sobre infraestructura verde urbana y adaptación frente al calor extremo.",
    fullDescription:
      "Contenido placeholder. Luego se reemplazará por el relato completo del caso, ubicación, imágenes y datos institucionales.",
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
      "Caso placeholder sobre prácticas productivas resilientes ante inundaciones y variabilidad climática.",
    fullDescription:
      "Contenido placeholder. El backoffice permitirá editar esta información y administrar múltiples imágenes.",
    severity: "critical",
    status: "published",
    latitude: 14.08,
    longitude: -87.21,
    country: "Honduras",
    region: "Francisco Morazán",
    sourceUrl: null,
    category: placeholderCategories[2],
    images: [
      {
        id: "coastal-food-cover",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        altText: "Campo agrícola usado como imagen placeholder.",
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
      "Caso placeholder sobre prácticas productivas resilientes ante inundaciones y variabilidad climática.",
    fullDescription:
      "Contenido placeholder. El backoffice permitirá editar esta información y administrar múltiples imágenes.",
    severity: "critical",
    status: "published",
    latitude: 14.08,
    longitude: -88.21,
    country: "Honduras",
    region: "Francisco Morazán",
    sourceUrl: null,
    category: placeholderCategories[2],
    images: [
      {
        id: "coastal-food-cover",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        altText: "Campo agrícola usado como imagen placeholder.",
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

export const placeholderCountryProfiles: CountryProfile[] = projectCountries.map((country) => ({
  id: `country-profile-${country.slug}`,
  name: country.name,
  slug: country.slug,
  summary: country.summary,
  status: "published",
  mainRisk: country.mainRisk,
  territory: country.territory,
  sector: country.sector,
  measuresCount: country.measuresCount,
  storyTitle: country.storyTitle,
  risks: [...country.risks],
  heroImageUrl: null,
  profilePdfUrl: null,
  riskAnalysis: null,
  climateThreats: null,
  exposureAndVulnerabilities: null,
  adaptationMeasures: null,
  featuredStory: null,
  sources: null,
}));

export const placeholderResilienceStories: ResilienceStory[] = projectCountries.map((country) => ({
  id: `story-${country.slug}`,
  title: country.storyTitle,
  slug: country.slug,
  summary: `${country.summary} Historia enfocada en ${country.mainRisk.toLowerCase()} en ${country.territory.toLowerCase()}.`,
  content: [
    `Esta historia documenta aprendizajes territoriales sobre ${country.mainRisk.toLowerCase()} en ${country.territory.toLowerCase()}.`,
    "El relato completo podrá cargarse desde el backoffice con detalles del proceso, protagonistas, recursos audiovisuales y fuentes.",
  ].join("\n\n"),
  status: "published",
  country: country.name,
  territory: country.territory,
  mainRisk: country.mainRisk,
  mediaUrl: null,
  mediaAlt: null,
  sourceUrl: null,
}));
