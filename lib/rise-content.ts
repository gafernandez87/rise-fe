export const projectCountries = [
  {
    name: "Chile",
    slug: "chile",
    risks: ["Sequía", "crisis hídrica", "incendios"],
    mainRisk: "Sequía y estrés hídrico",
    territory: "Zona centro-norte",
    sector: "Agua y agricultura",
    measuresCount: 4,
    storyTitle: "Gestión comunitaria del agua en contexto de sequía",
    summary:
      "Perfil enfocado en territorios expuestos a escasez hídrica, degradación de cuencas e incendios cada vez más intensos.",
  },
  {
    name: "Argentina",
    slug: "argentina",
    risks: ["Inundación", "calor extremo", "sequías"],
    mainRisk: "Inundaciones y olas de calor",
    territory: "Centros urbanos y cuencas productivas",
    sector: "Ciudades, salud y agricultura",
    measuresCount: 4,
    storyTitle: "Corredores verdes para barrios expuestos al calor",
    summary:
      "Perfil orientado a riesgos urbanos, eventos extremos y medidas que combinan infraestructura verde con organización local.",
  },
  {
    name: "Colombia",
    slug: "colombia",
    risks: ["Deslizamientos", "inundación", "pérdida de biodiversidad"],
    mainRisk: "Deslizamientos e inundaciones",
    territory: "Montaña, cuencas y periferias urbanas",
    sector: "Biodiversidad, agua e infraestructura",
    measuresCount: 4,
    storyTitle: "Restauración territorial con juventudes rurales",
    summary:
      "Perfil centrado en vulnerabilidad territorial, restauración ecológica y gestión del riesgo desde comunidades locales.",
  },
  {
    name: "México",
    slug: "mexico",
    risks: ["Calor extremo", "sequías", "subida del nivel del mar"],
    mainRisk: "Calor extremo y sequía",
    territory: "Zonas áridas, urbanas y costeras",
    sector: "Salud, agua y ciudades",
    measuresCount: 4,
    storyTitle: "Educación climática para comunidades expuestas",
    summary:
      "Perfil con foco en calor, disponibilidad de agua y soluciones educativas y comunitarias para reducir vulnerabilidades.",
  },
  {
    name: "Brasil",
    slug: "brasil",
    risks: ["Inundación", "pérdida de biodiversidad", "incendios"],
    mainRisk: "Inundaciones y pérdida de biodiversidad",
    territory: "Bosques, cuencas y ciudades",
    sector: "Biodiversidad, agua y gestión local",
    measuresCount: 4,
    storyTitle: "Soluciones basadas en la naturaleza en territorios urbanos",
    summary:
      "Perfil orientado a biodiversidad, gestión de cuencas, incendios e iniciativas de restauración lideradas por alianzas locales.",
  },
  {
    name: "Honduras",
    slug: "honduras",
    risks: ["Huracanes", "inundación", "deslizamientos"],
    mainRisk: "Inundaciones y deslizamientos",
    territory: "Zonas costeras, rurales y de ladera",
    sector: "Agua, infraestructura y agricultura",
    measuresCount: 4,
    storyTitle: "Alerta temprana y organización comunitaria",
    summary:
      "Perfil centrado en eventos hidrometeorológicos, seguridad territorial y medidas comunitarias para anticipar impactos.",
  },
] as const;

export type ProjectCountrySlug = (typeof projectCountries)[number]["slug"];

const projectCountryFlags: Record<ProjectCountrySlug, string> = {
  argentina: "🇦🇷",
  brasil: "🇧🇷",
  chile: "🇨🇱",
  colombia: "🇨🇴",
  honduras: "🇭🇳",
  mexico: "🇲🇽",
};

const countrySlugByNormalizedName: Record<string, ProjectCountrySlug> = {
  argentina: "argentina",
  brasil: "brasil",
  brazil: "brasil",
  chile: "chile",
  colombia: "colombia",
  honduras: "honduras",
  mexico: "mexico",
};

function normalizeCountryName(country?: string | null) {
  return country
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function getCountrySlugFromName(country?: string | null) {
  const normalizedCountry = normalizeCountryName(country);

  return normalizedCountry ? countrySlugByNormalizedName[normalizedCountry] : undefined;
}

export function getCountryFlag(country?: string | null) {
  const slug = getCountrySlugFromName(country);

  return slug ? projectCountryFlags[slug] : undefined;
}

export function formatCountryNameWithFlag(country: string) {
  const flag = getCountryFlag(country);

  return flag ? `${flag} ${country}` : country;
}

export const adaptationMeasureTypes = [
  "Infraestructura verde",
  "Soluciones basadas en la naturaleza",
  "Educación climática",
  "Gestión comunitaria del agua",
  "Restauración ecológica",
  "Alerta temprana",
  "Gobernanza local",
  "Agricultura resiliente",
];

export const climateRisks = [
  "Sequía",
  "Inundación",
  "Calor extremo",
  "Incendios",
  "Subida del nivel del mar",
  "Pérdida de biodiversidad",
  "Crisis hídrica",
  "Deslizamientos",
];

export const territories = ["Urbano", "Rural", "Costero", "Montaña", "Bosque", "Cuenca", "Humedal", "Zona árida"];

export const actors = [
  "Juventudes",
  "Comunidad local",
  "Organización social",
  "Gobierno local",
  "Academia",
  "Alianza público-comunitaria",
];

export const methodologySteps = [
  {
    title: "Revisión documental",
    description: "Revisión de fuentes nacionales, multilaterales y técnicas.",
  },
  {
    title: "Perfil de país",
    description: "Elaboración de diagnósticos de riesgo y vulnerabilidad climática.",
  },
  {
    title: "Identificación de medidas",
    description: "Levantamiento de acciones de adaptación existentes por país.",
  },
  {
    title: "Selección de historias",
    description: "Priorización de un caso destacado por país con enfoque narrativo.",
  },
  {
    title: "Producción multimedia",
    description: "Desarrollo de videos, fichas, fotografías y relatos territoriales.",
  },
  {
    title: "Síntesis regional",
    description: "Elaboración del informe comparativo regional y aprendizajes comunes.",
  },
];

export type OrganizationLogo = {
  name: string;
  logo: string;
};

export const organizations = {
  leading: [{ name: "CLAAC", logo: "/brand/organizations/claac.png" }],
  support: [
    { name: "Uno Punto Cinco", logo: "/brand/organizations/uno-punto-cinco.svg" },
    { name: "Eco House", logo: "/brand/organizations/eco-house.png" },
    {
      name: "Sustentabilidad Sin Fronteras",
      logo: "/brand/organizations/sustentabilidad-sin-fronteras.png",
    },
    { name: "Climalab", logo: "/brand/organizations/climalab.png" },
  ],
  participants: [
    {
      name: "Jóvenes por el Clima Argentina",
      logo: "/brand/organizations/jovenes-por-el-clima.png",
    },
    { name: "Nuestro Futuro", logo: "/brand/organizations/nuestro-futuro.png" },
    { name: "Sustenta Honduras", logo: "/brand/organizations/sustenta-honduras.png" },
    { name: "Palmares Lab", logo: "/brand/organizations/palmares-lab.png" },
  ],
};

export function getCountryBySlug(slug: string) {
  return projectCountries.find((country) => country.slug === slug);
}
