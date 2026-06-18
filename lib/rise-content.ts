export const projectCountries = [
  {
    name: "Chile",
    slug: "chile",
    risks: ["Sequia", "crisis hidrica", "incendios"],
    mainRisk: "Sequia y estres hidrico",
    territory: "Zona centro-norte",
    sector: "Agua y agricultura",
    measuresCount: 4,
    storyTitle: "Gestion comunitaria del agua en contexto de sequia",
    summary:
      "Perfil enfocado en territorios expuestos a escasez hidrica, degradacion de cuencas e incendios cada vez mas intensos.",
  },
  {
    name: "Argentina",
    slug: "argentina",
    risks: ["Inundacion", "calor extremo", "sequias"],
    mainRisk: "Inundaciones y olas de calor",
    territory: "Centros urbanos y cuencas productivas",
    sector: "Ciudades, salud y agricultura",
    measuresCount: 4,
    storyTitle: "Corredores verdes para barrios expuestos al calor",
    summary:
      "Perfil orientado a riesgos urbanos, eventos extremos y medidas que combinan infraestructura verde con organizacion local.",
  },
  {
    name: "Colombia",
    slug: "colombia",
    risks: ["Deslizamientos", "inundacion", "perdida de biodiversidad"],
    mainRisk: "Deslizamientos e inundaciones",
    territory: "Montana, cuencas y periferias urbanas",
    sector: "Biodiversidad, agua e infraestructura",
    measuresCount: 4,
    storyTitle: "Restauracion territorial con juventudes rurales",
    summary:
      "Perfil centrado en vulnerabilidad territorial, restauracion ecologica y gestion del riesgo desde comunidades locales.",
  },
  {
    name: "Mexico",
    slug: "mexico",
    risks: ["Calor extremo", "sequias", "subida del nivel del mar"],
    mainRisk: "Calor extremo y sequia",
    territory: "Zonas aridas, urbanas y costeras",
    sector: "Salud, agua y ciudades",
    measuresCount: 4,
    storyTitle: "Educacion climatica para comunidades expuestas",
    summary:
      "Perfil con foco en calor, disponibilidad de agua y soluciones educativas y comunitarias para reducir vulnerabilidades.",
  },
  {
    name: "Brasil",
    slug: "brasil",
    risks: ["Inundacion", "perdida de biodiversidad", "incendios"],
    mainRisk: "Inundaciones y perdida de biodiversidad",
    territory: "Bosques, cuencas y ciudades",
    sector: "Biodiversidad, agua y gestion local",
    measuresCount: 4,
    storyTitle: "Soluciones basadas en la naturaleza en territorios urbanos",
    summary:
      "Perfil orientado a biodiversidad, gestion de cuencas, incendios e iniciativas de restauracion lideradas por alianzas locales.",
  },
  {
    name: "Honduras",
    slug: "honduras",
    risks: ["Huracanes", "inundacion", "deslizamientos"],
    mainRisk: "Inundaciones y deslizamientos",
    territory: "Zonas costeras, rurales y de ladera",
    sector: "Agua, infraestructura y agricultura",
    measuresCount: 4,
    storyTitle: "Alerta temprana y organizacion comunitaria",
    summary:
      "Perfil centrado en eventos hidrometeorologicos, seguridad territorial y medidas comunitarias para anticipar impactos.",
  },
] as const;

export const adaptationMeasureTypes = [
  "Infraestructura verde",
  "Soluciones basadas en la naturaleza",
  "Educacion climatica",
  "Gestion comunitaria del agua",
  "Restauracion ecologica",
  "Alerta temprana",
  "Gobernanza local",
  "Agricultura resiliente",
];

export const climateRisks = [
  "Sequia",
  "Inundacion",
  "Calor extremo",
  "Incendios",
  "Subida del nivel del mar",
  "Perdida de biodiversidad",
  "Crisis hidrica",
  "Deslizamientos",
];

export const territories = ["Urbano", "Rural", "Costero", "Montana", "Bosque", "Cuenca", "Humedal", "Zona arida"];

export const actors = [
  "Juventudes",
  "Comunidad local",
  "Organizacion social",
  "Gobierno local",
  "Academia",
  "Alianza publico-comunitaria",
];

export const methodologySteps = [
  {
    title: "Revision documental",
    description: "Revision de fuentes nacionales, multilaterales y tecnicas.",
  },
  {
    title: "Perfil de pais",
    description: "Elaboracion de diagnosticos de riesgo y vulnerabilidad climatica.",
  },
  {
    title: "Identificacion de medidas",
    description: "Levantamiento de acciones de adaptacion existentes por pais.",
  },
  {
    title: "Seleccion de historias",
    description: "Priorizacion de un caso destacado por pais con enfoque narrativo.",
  },
  {
    title: "Produccion multimedia",
    description: "Desarrollo de videos, fichas, fotografias y relatos territoriales.",
  },
  {
    title: "Sintesis regional",
    description: "Elaboracion del informe comparativo regional y aprendizajes comunes.",
  },
];

export const organizations = {
  leading: ["CLAAC"],
  support: ["Uno Punto Cinco", "EcoHouse", "Sustentabilidad Sin Fronteras", "Climalab"],
  participants: [
    "Jovenes por el Clima Argentina",
    "Nuestro Futuro",
    "Sustenta Honduras",
    "Palmares Lab",
  ],
};

export function getCountryBySlug(slug: string) {
  return projectCountries.find((country) => country.slug === slug);
}
