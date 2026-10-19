import {
  actors,
  adaptationMeasureTypes,
  climateRisks,
  methodologySteps,
  projectCountries,
  territories,
} from "@/lib/rise-content";
import type { AdaptationCase, Category, MapCase } from "@/types/cases";

export const locales = ["es", "en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value?: string): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function localizedPath(path: string, locale: Locale) {
  const normalizedPath = path === "" ? "/" : path;
  if (locale === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export type LocalizedCountry = {
  name: string;
  slug: string;
  risks: string[];
  mainRisk: string;
  territory: string;
  sector: string;
  measuresCount: number;
  storyTitle: string;
  summary: string;
};

const localizedCountries: Record<Locale, LocalizedCountry[]> = {
  es: projectCountries.map((country) => ({ ...country, risks: [...country.risks] })),
  en: [
    {
      name: "Chile",
      slug: "chile",
      risks: ["Drought", "water crisis", "wildfires"],
      mainRisk: "Drought and water stress",
      territory: "Central-northern zone",
      sector: "Water and agriculture",
      measuresCount: 4,
      storyTitle: "Community water management in a drought context",
      summary:
        "Profile focused on territories exposed to water scarcity, watershed degradation and increasingly intense wildfires.",
    },
    {
      name: "Argentina",
      slug: "argentina",
      risks: ["Flooding", "extreme heat", "droughts"],
      mainRisk: "Floods and heat waves",
      territory: "Urban centers and productive watersheds",
      sector: "Cities, health and agriculture",
      measuresCount: 4,
      storyTitle: "Green corridors for neighborhoods exposed to heat",
      summary:
        "Profile focused on urban risks, extreme events and measures that combine green infrastructure with local organization.",
    },
    {
      name: "Colombia",
      slug: "colombia",
      risks: ["Landslides", "flooding", "biodiversity loss"],
      mainRisk: "Landslides and floods",
      territory: "Mountains, watersheds and urban peripheries",
      sector: "Biodiversity, water and infrastructure",
      measuresCount: 4,
      storyTitle: "Territorial restoration with rural youth",
      summary:
        "Profile centered on territorial vulnerability, ecological restoration and risk management from local communities.",
    },
    {
      name: "Mexico",
      slug: "mexico",
      risks: ["Extreme heat", "droughts", "sea level rise"],
      mainRisk: "Extreme heat and drought",
      territory: "Arid, urban and coastal areas",
      sector: "Health, water and cities",
      measuresCount: 4,
      storyTitle: "Climate education for exposed communities",
      summary:
        "Profile focused on heat, water availability and educational and community solutions to reduce vulnerabilities.",
    },
    {
      name: "Brasil",
      slug: "brasil",
      risks: ["Flooding", "biodiversity loss", "wildfires"],
      mainRisk: "Floods and biodiversity loss",
      territory: "Forests, watersheds and cities",
      sector: "Biodiversity, water and local management",
      measuresCount: 4,
      storyTitle: "Nature-based solutions in urban territories",
      summary:
        "Profile focused on biodiversity, watershed management, wildfires and restoration initiatives led by local alliances.",
    },
    {
      name: "Honduras",
      slug: "honduras",
      risks: ["Hurricanes", "flooding", "landslides"],
      mainRisk: "Floods and landslides",
      territory: "Coastal, rural and hillside areas",
      sector: "Water, infrastructure and agriculture",
      measuresCount: 4,
      storyTitle: "Early warning and community organization",
      summary:
        "Profile centered on hydrometeorological events, territorial safety and community measures to anticipate impacts.",
    },
  ],
  pt: [
    {
      name: "Chile",
      slug: "chile",
      risks: ["Seca", "crise hidrica", "incendios"],
      mainRisk: "Seca e estresse hidrico",
      territory: "Zona centro-norte",
      sector: "Agua e agricultura",
      measuresCount: 4,
      storyTitle: "Gestao comunitaria da agua em contexto de seca",
      summary:
        "Perfil focado em territorios expostos a escassez hidrica, degradacao de bacias e incendios cada vez mais intensos.",
    },
    {
      name: "Argentina",
      slug: "argentina",
      risks: ["Inundacao", "calor extremo", "secas"],
      mainRisk: "Inundacoes e ondas de calor",
      territory: "Centros urbanos e bacias produtivas",
      sector: "Cidades, saude e agricultura",
      measuresCount: 4,
      storyTitle: "Corredores verdes para bairros expostos ao calor",
      summary:
        "Perfil orientado a riscos urbanos, eventos extremos e medidas que combinam infraestrutura verde com organizacao local.",
    },
    {
      name: "Colombia",
      slug: "colombia",
      risks: ["Deslizamentos", "inundacao", "perda de biodiversidade"],
      mainRisk: "Deslizamentos e inundacoes",
      territory: "Montanhas, bacias e periferias urbanas",
      sector: "Biodiversidade, agua e infraestrutura",
      measuresCount: 4,
      storyTitle: "Restauracao territorial com juventudes rurais",
      summary:
        "Perfil centrado em vulnerabilidade territorial, restauracao ecologica e gestao do risco a partir de comunidades locais.",
    },
    {
      name: "Mexico",
      slug: "mexico",
      risks: ["Calor extremo", "secas", "elevacao do nivel do mar"],
      mainRisk: "Calor extremo e seca",
      territory: "Zonas aridas, urbanas e costeiras",
      sector: "Saude, agua e cidades",
      measuresCount: 4,
      storyTitle: "Educacao climatica para comunidades expostas",
      summary:
        "Perfil com foco em calor, disponibilidade de agua e solucoes educativas e comunitarias para reduzir vulnerabilidades.",
    },
    {
      name: "Brasil",
      slug: "brasil",
      risks: ["Inundacao", "perda de biodiversidade", "incendios"],
      mainRisk: "Inundacoes e perda de biodiversidade",
      territory: "Florestas, bacias e cidades",
      sector: "Biodiversidade, agua e gestao local",
      measuresCount: 4,
      storyTitle: "Solucoes baseadas na natureza em territorios urbanos",
      summary:
        "Perfil orientado a biodiversidade, gestao de bacias, incendios e iniciativas de restauracao lideradas por aliancas locais.",
    },
    {
      name: "Honduras",
      slug: "honduras",
      risks: ["Furacoes", "inundacao", "deslizamentos"],
      mainRisk: "Inundacoes e deslizamentos",
      territory: "Zonas costeiras, rurais e de encosta",
      sector: "Agua, infraestrutura e agricultura",
      measuresCount: 4,
      storyTitle: "Alerta precoce e organizacao comunitaria",
      summary:
        "Perfil centrado em eventos hidrometeorologicos, seguranca territorial e medidas comunitarias para antecipar impactos.",
    },
  ],
};

const contentLists: Record<
  Locale,
  {
    adaptationMeasureTypes: string[];
    climateRisks: string[];
    territories: string[];
    actors: string[];
    methodologySteps: Array<{ title: string; description: string }>;
  }
> = {
  es: {
    adaptationMeasureTypes,
    climateRisks,
    territories,
    actors,
    methodologySteps,
  },
  en: {
    adaptationMeasureTypes: [
      "Green infrastructure",
      "Nature-based solutions",
      "Climate education",
      "Community water management",
      "Ecological restoration",
      "Early warning",
      "Local governance",
      "Resilient agriculture",
    ],
    climateRisks: [
      "Drought",
      "Flooding",
      "Extreme heat",
      "Wildfires",
      "Sea level rise",
      "Biodiversity loss",
      "Water crisis",
      "Landslides",
    ],
    territories: ["Urban", "Rural", "Coastal", "Mountain", "Forest", "Watershed", "Wetland", "Arid zone"],
    actors: ["Youth", "Local community", "Social organization", "Local government", "Academia", "Public-community alliance"],
    methodologySteps: [
      { title: "Desk review", description: "Review of national, multilateral and technical sources." },
      { title: "Country profile", description: "Preparation of climate risk and vulnerability diagnostics." },
      { title: "Measure identification", description: "Mapping existing adaptation actions by country." },
      { title: "Story selection", description: "Prioritization of one featured case per country with a narrative focus." },
      { title: "Multimedia production", description: "Development of videos, factsheets, photographs and territorial stories." },
      { title: "Regional synthesis", description: "Preparation of the regional comparative report and shared lessons." },
    ],
  },
  pt: {
    adaptationMeasureTypes: [
      "Infraestrutura verde",
      "Solucoes baseadas na natureza",
      "Educacao climatica",
      "Gestao comunitaria da agua",
      "Restauracao ecologica",
      "Alerta precoce",
      "Governanca local",
      "Agricultura resiliente",
    ],
    climateRisks: [
      "Seca",
      "Inundacao",
      "Calor extremo",
      "Incendios",
      "Elevacao do nivel do mar",
      "Perda de biodiversidade",
      "Crise hidrica",
      "Deslizamentos",
    ],
    territories: ["Urbano", "Rural", "Costeiro", "Montanha", "Floresta", "Bacia", "Pantanal", "Zona arida"],
    actors: ["Juventudes", "Comunidade local", "Organizacao social", "Governo local", "Academia", "Alianca publico-comunitaria"],
    methodologySteps: [
      { title: "Revisao documental", description: "Revisao de fontes nacionais, multilaterais e tecnicas." },
      { title: "Perfil de pais", description: "Elaboracao de diagnosticos de risco e vulnerabilidade climatica." },
      { title: "Identificacao de medidas", description: "Levantamento de acoes de adaptacao existentes por pais." },
      { title: "Selecao de historias", description: "Priorizacao de um caso destacado por pais com enfoque narrativo." },
      { title: "Producao multimedia", description: "Desenvolvimento de videos, fichas, fotografias e relatos territoriais." },
      { title: "Sintese regional", description: "Elaboracao do relatorio comparativo regional e aprendizados comuns." },
    ],
  },
};

const dictionaries = {
  es: {
    language: { label: "Idioma", spanish: "Español", english: "Inglés", portuguese: "Portugués" },
    metadata: {
      description:
        "Plataforma regional de medidas de adaptación e historias de resiliencia lideradas por juventudes en América Latina.",
      ogDescription: "Explora casos, perfiles nacionales e historias de resiliencia en América Latina.",
    },
    common: {
      cases: "casos",
      publishedCases: "casos publicados",
      tbd: "TBD",
      toComplete: "Por completar",
      latinAmerica: "América Latina",
      stage: "Etapa",
      country: "País",
      region: "Región",
      latitude: "Latitud",
      longitude: "Longitud",
      mainRisk: "Riesgo principal",
      mostAffectedSector: "Sector más afectado",
      prioritizedTerritory: "Territorio priorizado",
      identifiedMeasures: "Medidas identificadas",
      involvedActors: "Actores involucrados",
      youthCommunityAllies: "Juventudes, comunidad local y organizaciones aliadas",
    },
    footer: {
      findUsOn: "Encuéntranos en:",
    },
    home: {
      eyebrow: "Adaptación climática liderada por juventudes",
      intro:
        "Una plataforma regional para identificar, documentar y visibilizar medidas de adaptación e historias de resiliencia lideradas por juventudes en América Latina.",
      ctaMap: "Explorar el mapa",
      ctaStories: "Ver historias de resiliencia",
      ctaReport: "Descargar informe regional",
      mapCardTitle: "Mapa regional de riesgos, medidas e historias",
      aboutEyebrow: "Qué es RISE",
      aboutTitle: "Conocimiento, territorio y resiliencia",
      aboutText: [
        "RISE es una iniciativa regional de CLAAC que busca fortalecer la acción climática en América Latina mediante la generación de conocimiento, documentación de experiencias territoriales y visibilización de soluciones de adaptación y resiliencia.",
        "El proyecto trabaja en Chile, Argentina, Colombia, México, Brasil y Honduras para desarrollar perfiles de riesgo y vulnerabilidad climática, identificar medidas de adaptación existentes y contar historias sobre juventudes frente al cambio climático.",
      ],
      introCards: [
        {
          title: "Historias de resiliencia",
          href: "/historias",
          text: "Relatos multimedia sobre comunidades, juventudes y soluciones locales.",
        },
        {
          title: "Medidas de adaptación",
          href: "/mapa",
          text: "Documentación de acciones que ya están fortaleciendo la resiliencia.",
        },
        {
          title: "Riesgos climáticos",
          href: "/perfiles",
          text: "Identificación de amenazas, exposición y vulnerabilidades por país.",
        },
      ],
      profilesEyebrow: "Perfiles de país",
      profilesTitle: "Seis diagnósticos nacionales",
      viewProfiles: "Ver perfiles",
      viewProfile: "Ver perfil",
      storiesEyebrow: "Historias de resiliencia",
      storiesTitle: "Conoce los 6 casos más destacados",
      viewStories: "Ver historias",
      mapEyebrow: "Mapa interactivo",
      casesTitle: "Primeras fichas de casos",
      exploreMap: "Explorar mapa",
      reportEyebrow: "Informe regional",
      reportTitle: "Hallazgos regionales y metodología",
      reportText:
        "El informe regional RISE reúne análisis de riesgo, medidas de adaptación e historias de resiliencia de seis países de América Latina.",
      readOnline: "Leer online",
      learnMethodology: "Conocer metodología",
      findings: [
        "Los impactos climáticos combinan amenazas físicas con desigualdades territoriales preexistentes.",
        "Las juventudes aportan organización, comunicación y aprendizaje comunitario en medidas de adaptación.",
        "Las soluciones más replicables conectan evidencia técnica, saber local y alianzas institucionales.",
      ],
      methodologyEyebrow: "Metodología",
      methodologyTitle: "Cómo se documenta RISE",
      projectBy: "Un proyecto de:",
      organizationsEyebrow: "Organizaciones",
      organizationsTitle: "Esta iniciativa es impulsada por",
      leading: "Un proyecto de",
      collaborators: "Colaboradores:",
      support: "Con el apoyo de",
      participants: "Organizaciones participantes",
    },
    map: {
      eyebrow: "Mapa interactivo",
      title: "Explora casos, países y medidas",
      text:
        "Visualiza los seis países del proyecto, las medidas de adaptación identificadas, historias destacadas y enlaces a fichas completas.",
    },
    stories: {
      eyebrow: "Historias de resiliencia",
      title: "Conoce los 6 casos más destacados de Latinoamérica",
      text:
        "Relatos multimedia que conectan riesgos climáticos con respuestas concretas impulsadas por juventudes, comunidades y organizaciones territoriales.",
      videoPlaceholder: "Video + descripción",
      storyAboutPrefix: "Historia destacada sobre",
      storyAboutMiddle: "en",
      viewStory: "Ver historia",
      heroTextPrefix: "Una historia multimedia sobre juventudes, comunidades y medidas de adaptación frente a",
      mediaPlaceholder: "Imagen o video principal",
      technicalSheet: "Ficha técnica",
      viewCountryProfile: "Ver perfil del país",
      viewOtherStories: "Ver otras historias",
      exploreMap: "Explorar mapa",
      relatedMeasuresEyebrow: "Medidas vinculadas",
      relatedMeasuresTitle: "Medidas de adaptación relacionadas",
      relatedMeasuresText:
        "Estas fichas comparten el país de la historia y permiten revisar la medida documentada con más detalle.",
      relatedMeasuresFallback:
        "Aún no hay fichas publicadas para este país, pero puedes explorar el mapa para encontrar medidas similares.",
      viewRelatedMeasure: "Ver medida",
      viewCountryMeasures: "Ver medidas del país",
      sections: [
        {
          title: "El desafío",
          text: "Describe qué riesgo climático enfrenta el territorio, a quiénes afecta y qué factores aumentan la vulnerabilidad.",
        },
        {
          title: "La respuesta",
          text: "Presenta la medida de adaptación, quiénes la impulsaron y cómo se organizó la comunidad.",
        },
        {
          title: "La historia",
          text: "Espacio para el relato periodístico o testimonial, fotografías, citas, audio y video.",
        },
        {
          title: "Resultados y aprendizajes",
          text: "Sintetiza cambios observados, beneficios, limitaciones y condiciones para replicar la experiencia.",
        },
      ],
    },
    profiles: {
      eyebrow: "Perfiles de país",
      title: "Riesgo y vulnerabilidad climática",
      text:
        "Cada perfil funciona como una visualización nacional con riesgos prioritarios, sectores críticos, medidas identificadas e historia destacada.",
      nationalProfile: "Perfil nacional",
      viewCasesMap: "Ver casos en el mapa",
      downloadPdf: "Descargar perfil PDF",
      sections: [
        "Resumen ejecutivo",
        "Riesgos climáticos prioritarios",
        "Exposición",
        "Vulnerabilidad",
        "Marco normativo e institucional",
        "Sectores críticos",
        "Zonas priorizadas",
        "Medidas de adaptación identificadas",
        "Historia destacada",
        "Fuentes",
      ],
      placeholderPrefix: "Contenido editorial por completar con datos del perfil de",
      placeholderSuffix: "Esta estructura deja lista la versión web navegable y el enlace al PDF descargable.",
    },
    report: {
      eyebrow: "Informe regional",
      title: "RISE: riesgo, adaptación y resiliencia juvenil",
      text:
        "El informe regional RISE reúne los principales hallazgos del análisis de riesgo y vulnerabilidad climática en seis países de América Latina, junto con medidas de adaptación e historias de resiliencia.",
      downloadPdf: "Descargar PDF",
      readOnline: "Leer online",
      cover: "Portada",
      coverTitle: "Informe Regional RISE",
      summaryTitle: "Resumen ejecutivo",
      summaryText:
        "Esta versión web deja preparada la lectura online del informe, sus principales hallazgos, visualizaciones clave, enlaces a perfiles nacionales e historias multimedia.",
      linkedProfiles: "Perfiles vinculados",
      findings: [
        "Los riesgos climáticos prioritarios se intensifican cuando coinciden con desigualdad territorial.",
        "Las medidas con mayor potencial combinan soluciones basadas en la naturaleza, gobernanza local y educación climática.",
        "Las juventudes cumplen un rol clave para comunicar riesgos, activar redes y sostener aprendizajes comunitarios.",
      ],
    },
    methodology: {
      eyebrow: "Metodología",
      title: "Cómo se construye RISE",
      text:
        "La metodología organiza el proceso de revisión, análisis, identificación de medidas y producción multimedia para que los perfiles, fichas e historias sean comparables.",
      criteriaTitle: "Criterios y alcance",
      criteriaText:
        "Estos criterios resumen qué se analiza, cómo se seleccionan los casos y qué límites debe transparentar la plataforma.",
      includedCountries: "Países incluidos",
      criteria: [
        "Países analizados: Chile, Argentina, Colombia, México, Brasil y Honduras.",
        "Riesgos seleccionados a partir de fuentes nacionales, multilaterales y técnicas.",
        "Medidas identificadas por relevancia territorial, potencial de aprendizaje y evidencia disponible.",
        "Historias priorizadas por protagonismo juvenil, diversidad geográfica y claridad narrativa.",
        "Limitaciones: disponibilidad de datos, comparabilidad regional y actualización periódica del contenido.",
      ],
    },
    case: {
      classification: "Clasificación de la medida",
      locality: "Localidad",
      threat: "Amenaza",
      measureSector: "Sector / tipo de medida",
      source: "Fuente",
      viewSource: "Ver fuente",
      baseInfo: "Información base",
      measureSummary: "Resumen de la medida",
      measureObjectives: "Objetivos de la medida",
      measureObjectivesText:
        "Reducir riesgos climáticos, fortalecer la resiliencia territorial y visibilizar aprendizajes que puedan orientar acciones similares en otros contextos.",
      beneficiaryCommunities: "Comunidades beneficiarias",
      beneficiaryCommunitiesText:
        "Comunidades locales, juventudes y organizaciones territoriales vinculadas al caso. El detalle cuantitativo queda preparado para la base editorial completa.",
      relatedStoryEyebrow: "Historia vinculada",
      relatedStoryTitle: "Historia de resiliencia relacionada",
      relatedStoryText:
        "Esta historia comparte el país de la medida y suma contexto narrativo sobre juventudes, comunidades y aprendizajes.",
      relatedStoryFallbackTitle: "Historia de resiliencia por vincular",
      relatedStoryFallbackText:
        "Aún no hay una historia publicada para este país. Puedes explorar las historias disponibles mientras se completa la relación editorial.",
      viewRelatedStory: "Leer historia",
      viewStories: "Ver historias",
      complementaryInfo: "Información complementaria",
      complementaryPlaceholder: "Contenido por completar con datos de la ficha técnica y fuentes del caso.",
      complementarySections: [
        "Problemática climática local",
        "Alianzas estratégicas",
        "Factores habilitantes y condicionantes",
        "Cobeneficios",
        "Escalabilidad",
        "Sostenibilidad en el tiempo",
      ],
    },
    mapExplorer: {
      filters: "Filtros",
      visibleCases: "casos visibles",
      of: "de",
      search: "Buscar",
      searchPlaceholder: "Caso, territorio o medida",
      all: "Todos",
      country: "País",
      climateRisk: "Riesgo climático",
      measureType: "Tipo de medida",
      ecosystem: "Ecosistema o territorio",
      actor: "Actor impulsor",
      contentStatus: "Estado del contenido",
      showFilters: "Mostrar filtros",
      hideFilters: "Ocultar filtros",
      clearFilters: "Limpiar filtros",
      preparedFilters: "Los filtros de territorio, actor y estado quedan preparados para la base editorial completa.",
      countryTbd: "País TBD",
      measure: "Medida",
      territory: "Territorio",
      territoryFallback: "Territorio por completar",
      viewFullCase: "Ver ficha completa",
      statusOptions: ["Perfil disponible", "Historia disponible", "Video disponible", "Informe disponible"],
      severityLabels: { low: "Baja", medium: "Media", high: "Alta", critical: "Crítica" },
      riskBySeverity: {
        low: "Inundación",
        medium: "Calor extremo",
        high: "Sequía",
        critical: "Crisis hídrica",
      },
    },
    caseCard: {
      viewCase: "Ver caso",
    },
    mapPopup: {
      country: "País",
      measure: "Medida",
      organization: "Organización",
      viewFullCase: "Ver ficha completa",
      viewCountryProfile: "Ver perfil de país",
    },
  },
  en: {
    language: { label: "Language", spanish: "Spanish", english: "English", portuguese: "Portuguese" },
    metadata: {
      description:
        "Regional platform for adaptation measures and resilience stories led by youth in Latin America.",
      ogDescription: "Explore cases, country profiles and resilience stories across Latin America.",
    },
    common: {
      cases: "cases",
      publishedCases: "published cases",
      tbd: "TBD",
      toComplete: "To be completed",
      latinAmerica: "Latin America",
      stage: "Stage",
      country: "Country",
      region: "Region",
      latitude: "Latitude",
      longitude: "Longitude",
      mainRisk: "Main risk",
      mostAffectedSector: "Most affected sector",
      prioritizedTerritory: "Prioritized territory",
      identifiedMeasures: "Identified measures",
      involvedActors: "Actors involved",
      youthCommunityAllies: "Youth, local community and partner organizations",
    },
    footer: {
      findUsOn: "Find us on:",
    },
    home: {
      eyebrow: "Youth-led climate adaptation",
      intro:
        "A regional platform to identify, document and showcase adaptation measures and resilience stories led by youth in Latin America.",
      ctaMap: "Explore the map",
      ctaStories: "View resilience stories",
      ctaReport: "Download regional report",
      mapCardTitle: "Regional map of risks, measures and stories",
      aboutEyebrow: "What is RISE",
      aboutTitle: "Knowledge, territory and resilience",
      aboutText: [
        "RISE is a regional CLAAC initiative that seeks to strengthen climate action in Latin America through knowledge generation, documentation of territorial experiences and visibility for adaptation and resilience solutions.",
        "The project works in Chile, Argentina, Colombia, Mexico, Brazil and Honduras to develop climate risk and vulnerability profiles, identify existing adaptation measures and tell stories about youth facing climate change.",
      ],
      introCards: [
        { title: "Resilience stories", href: "/historias", text: "Multimedia stories about communities, youth and local solutions." },
        { title: "Adaptation measures", href: "/mapa", text: "Documentation of actions that are already strengthening resilience." },
        { title: "Climate risks", href: "/perfiles", text: "Identification of threats, exposure and vulnerabilities by country." },
      ],
      profilesEyebrow: "Country profiles",
      profilesTitle: "Six national diagnostics",
      viewProfiles: "View profiles",
      viewProfile: "View profile",
      storiesEyebrow: "Resilience stories",
      storiesTitle: "Meet the 6 featured cases",
      viewStories: "View stories",
      mapEyebrow: "Interactive map",
      casesTitle: "First case factsheets",
      exploreMap: "Explore map",
      reportEyebrow: "Regional report",
      reportTitle: "Regional findings and methodology",
      reportText:
        "The RISE regional report brings together risk analysis, adaptation measures and resilience stories from six Latin American countries.",
      readOnline: "Read online",
      learnMethodology: "Learn methodology",
      findings: [
        "Climate impacts combine physical hazards with pre-existing territorial inequalities.",
        "Youth contribute organization, communication and community learning to adaptation measures.",
        "The most replicable solutions connect technical evidence, local knowledge and institutional alliances.",
      ],
      methodologyEyebrow: "Methodology",
      methodologyTitle: "How RISE is documented",
      projectBy: "A project by:",
      organizationsEyebrow: "Organizations",
      organizationsTitle: "This initiative is driven by",
      leading: "Led by",
      collaborators: "Collaborators:",
      support: "With support from",
      participants: "Participating organizations",
    },
    map: {
      eyebrow: "Interactive map",
      title: "Explore cases, countries and measures",
      text:
        "View the six project countries, identified adaptation measures, featured stories and links to full factsheets.",
    },
    stories: {
      eyebrow: "Resilience stories",
      title: "Meet the 6 featured cases from Latin America",
      text:
        "Multimedia stories that connect climate risks with concrete responses driven by youth, communities and territorial organizations.",
      videoPlaceholder: "Video + description",
      storyAboutPrefix: "Featured story about",
      storyAboutMiddle: "in",
      viewStory: "View story",
      heroTextPrefix: "A multimedia story about youth, communities and adaptation measures facing",
      mediaPlaceholder: "Main image or video",
      technicalSheet: "Technical sheet",
      viewCountryProfile: "View country profile",
      viewOtherStories: "View other stories",
      exploreMap: "Explore map",
      relatedMeasuresEyebrow: "Linked measures",
      relatedMeasuresTitle: "Related adaptation measures",
      relatedMeasuresText:
        "These factsheets share the story country and let readers review the documented measure in more detail.",
      relatedMeasuresFallback:
        "There are no published factsheets for this country yet, but you can explore the map to find similar measures.",
      viewRelatedMeasure: "View measure",
      viewCountryMeasures: "View country measures",
      sections: [
        { title: "The challenge", text: "Describe the climate risk facing the territory, who is affected and which factors increase vulnerability." },
        { title: "The response", text: "Present the adaptation measure, who drove it and how the community organized." },
        { title: "The story", text: "Space for journalistic or testimonial storytelling, photographs, quotes, audio and video." },
        { title: "Results and lessons", text: "Summarize observed changes, benefits, limitations and conditions for replication." },
      ],
    },
    profiles: {
      eyebrow: "Country profiles",
      title: "Climate risk and vulnerability",
      text:
        "Each profile works as a national visualization with priority risks, critical sectors, identified measures and a featured story.",
      nationalProfile: "National profile",
      viewCasesMap: "View cases on the map",
      downloadPdf: "Download profile PDF",
      sections: [
        "Executive summary",
        "Priority climate risks",
        "Exposure",
        "Vulnerability",
        "Regulatory and institutional framework",
        "Critical sectors",
        "Prioritized zones",
        "Identified adaptation measures",
        "Featured story",
        "Sources",
      ],
      placeholderPrefix: "Editorial content to be completed with data from the",
      placeholderSuffix: "profile. This structure prepares the navigable web version and the downloadable PDF link.",
    },
    report: {
      eyebrow: "Regional report",
      title: "RISE: risk, adaptation and youth resilience",
      text:
        "The RISE regional report gathers the main findings from the climate risk and vulnerability analysis in six Latin American countries, along with adaptation measures and resilience stories.",
      downloadPdf: "Download PDF",
      readOnline: "Read online",
      cover: "Cover",
      coverTitle: "RISE Regional Report",
      summaryTitle: "Executive summary",
      summaryText:
        "This web version prepares the online reading experience for the report, its main findings, key visualizations, links to national profiles and multimedia stories.",
      linkedProfiles: "Linked profiles",
      findings: [
        "Priority climate risks intensify when they overlap with territorial inequality.",
        "Measures with the greatest potential combine nature-based solutions, local governance and climate education.",
        "Youth play a key role in communicating risks, activating networks and sustaining community learning.",
      ],
    },
    methodology: {
      eyebrow: "Methodology",
      title: "How RISE is built",
      text:
        "The methodology organizes the process of review, analysis, measure identification and multimedia production so profiles, factsheets and stories are comparable.",
      criteriaTitle: "Criteria and scope",
      criteriaText:
        "These criteria summarize what is analyzed, how cases are selected and which limits the platform must make transparent.",
      includedCountries: "Included countries",
      criteria: [
        "Countries analyzed: Chile, Argentina, Colombia, Mexico, Brazil and Honduras.",
        "Risks selected from national, multilateral and technical sources.",
        "Measures identified by territorial relevance, learning potential and available evidence.",
        "Stories prioritized by youth leadership, geographic diversity and narrative clarity.",
        "Limitations: data availability, regional comparability and periodic content updates.",
      ],
    },
    case: {
      classification: "Measure classification",
      locality: "Locality",
      threat: "Hazard",
      measureSector: "Sector / measure type",
      source: "Source",
      viewSource: "View source",
      baseInfo: "Base information",
      measureSummary: "Measure summary",
      measureObjectives: "Measure objectives",
      measureObjectivesText:
        "Reduce climate risks, strengthen territorial resilience and highlight lessons that can guide similar actions in other contexts.",
      beneficiaryCommunities: "Beneficiary communities",
      beneficiaryCommunitiesText:
        "Local communities, youth and territorial organizations linked to the case. Quantitative details are prepared for the full editorial database.",
      relatedStoryEyebrow: "Linked story",
      relatedStoryTitle: "Related resilience story",
      relatedStoryText:
        "This story shares the measure country and adds narrative context about youth, communities and lessons learned.",
      relatedStoryFallbackTitle: "Resilience story to link",
      relatedStoryFallbackText:
        "There is no published story for this country yet. You can explore the available stories while the editorial link is completed.",
      viewRelatedStory: "Read story",
      viewStories: "View stories",
      complementaryInfo: "Complementary information",
      complementaryPlaceholder: "Content to be completed with factsheet data and case sources.",
      complementarySections: [
        "Local climate issue",
        "Strategic alliances",
        "Enabling and conditioning factors",
        "Co-benefits",
        "Scalability",
        "Long-term sustainability",
      ],
    },
    mapExplorer: {
      filters: "Filters",
      visibleCases: "visible cases",
      of: "of",
      search: "Search",
      searchPlaceholder: "Case, territory or measure",
      all: "All",
      country: "Country",
      climateRisk: "Climate risk",
      measureType: "Measure type",
      ecosystem: "Ecosystem or territory",
      actor: "Leading actor",
      contentStatus: "Content status",
      showFilters: "Show filters",
      hideFilters: "Hide filters",
      clearFilters: "Clear filters",
      preparedFilters: "Territory, actor and status filters are prepared for the full editorial database.",
      countryTbd: "Country TBD",
      measure: "Measure",
      territory: "Territory",
      territoryFallback: "Territory to be completed",
      viewFullCase: "View full factsheet",
      statusOptions: ["Profile available", "Story available", "Video available", "Report available"],
      severityLabels: { low: "Low", medium: "Medium", high: "High", critical: "Critical" },
      riskBySeverity: { low: "Flooding", medium: "Extreme heat", high: "Drought", critical: "Water crisis" },
    },
    caseCard: { viewCase: "View case" },
    mapPopup: {
      country: "Country",
      measure: "Measure",
      organization: "Organization",
      viewFullCase: "View full factsheet",
      viewCountryProfile: "View country profile",
    },
  },
  pt: {
    language: { label: "Idioma", spanish: "Espanhol", english: "Ingles", portuguese: "Portugues" },
    metadata: {
      description:
        "Plataforma regional de medidas de adaptacao e historias de resiliencia lideradas por juventudes na America Latina.",
      ogDescription: "Explore casos, perfis nacionais e historias de resiliencia na America Latina.",
    },
    common: {
      cases: "casos",
      publishedCases: "casos publicados",
      tbd: "TBD",
      toComplete: "A completar",
      latinAmerica: "America Latina",
      stage: "Etapa",
      country: "Pais",
      region: "Regiao",
      latitude: "Latitude",
      longitude: "Longitude",
      mainRisk: "Risco principal",
      mostAffectedSector: "Setor mais afetado",
      prioritizedTerritory: "Territorio priorizado",
      identifiedMeasures: "Medidas identificadas",
      involvedActors: "Atores envolvidos",
      youthCommunityAllies: "Juventudes, comunidade local e organizacoes aliadas",
    },
    footer: {
      findUsOn: "Encontre-nos em:",
    },
    home: {
      eyebrow: "Adaptacao climatica liderada por juventudes",
      intro:
        "Uma plataforma regional para identificar, documentar e visibilizar medidas de adaptacao e historias de resiliencia lideradas por juventudes na America Latina.",
      ctaMap: "Explorar o mapa",
      ctaStories: "Ver historias de resiliencia",
      ctaReport: "Baixar relatorio regional",
      mapCardTitle: "Mapa regional de riscos, medidas e historias",
      aboutEyebrow: "O que e RISE",
      aboutTitle: "Conhecimento, territorio e resiliencia",
      aboutText: [
        "RISE e uma iniciativa regional da CLAAC que busca fortalecer a acao climatica na America Latina por meio da geracao de conhecimento, documentacao de experiencias territoriais e visibilidade para solucoes de adaptacao e resiliencia.",
        "O projeto trabalha no Chile, Argentina, Colombia, Mexico, Brasil e Honduras para desenvolver perfis de risco e vulnerabilidade climatica, identificar medidas de adaptacao existentes e contar historias sobre juventudes diante da mudanca climatica.",
      ],
      introCards: [
        { title: "Historias de resiliencia", href: "/historias", text: "Relatos multimedia sobre comunidades, juventudes e solucoes locais." },
        { title: "Medidas de adaptacao", href: "/mapa", text: "Documentacao de acoes que ja fortalecem a resiliencia." },
        { title: "Riscos climaticos", href: "/perfiles", text: "Identificacao de ameacas, exposicao e vulnerabilidades por pais." },
      ],
      profilesEyebrow: "Perfis de pais",
      profilesTitle: "Seis diagnosticos nacionais",
      viewProfiles: "Ver perfis",
      viewProfile: "Ver perfil",
      storiesEyebrow: "Historias de resiliencia",
      storiesTitle: "Conheca os 6 casos destacados",
      viewStories: "Ver historias",
      mapEyebrow: "Mapa interativo",
      casesTitle: "Primeiras fichas de casos",
      exploreMap: "Explorar mapa",
      reportEyebrow: "Relatorio regional",
      reportTitle: "Achados regionais e metodologia",
      reportText:
        "O relatorio regional RISE reune analise de risco, medidas de adaptacao e historias de resiliencia de seis paises da America Latina.",
      readOnline: "Ler online",
      learnMethodology: "Conhecer metodologia",
      findings: [
        "Os impactos climaticos combinam ameacas fisicas com desigualdades territoriais preexistentes.",
        "As juventudes contribuem com organizacao, comunicacao e aprendizagem comunitaria nas medidas de adaptacao.",
        "As solucoes mais replicaveis conectam evidencia tecnica, saber local e aliancas institucionais.",
      ],
      methodologyEyebrow: "Metodologia",
      methodologyTitle: "Como RISE e documentado",
      projectBy: "Um projeto de:",
      organizationsEyebrow: "Organizacoes",
      organizationsTitle: "Esta iniciativa e impulsionada por",
      leading: "Impulsionam",
      collaborators: "Colaboradores:",
      support: "Com o apoio de",
      participants: "Organizacoes participantes",
    },
    map: {
      eyebrow: "Mapa interativo",
      title: "Explore casos, paises e medidas",
      text:
        "Visualize os seis paises do projeto, as medidas de adaptacao identificadas, historias destacadas e links para fichas completas.",
    },
    stories: {
      eyebrow: "Historias de resiliencia",
      title: "Conheca os 6 casos mais destacados da America Latina",
      text:
        "Relatos multimedia que conectam riscos climaticos com respostas concretas impulsionadas por juventudes, comunidades e organizacoes territoriais.",
      videoPlaceholder: "Video + descricao",
      storyAboutPrefix: "Historia destacada sobre",
      storyAboutMiddle: "em",
      viewStory: "Ver historia",
      heroTextPrefix: "Uma historia multimedia sobre juventudes, comunidades e medidas de adaptacao frente a",
      mediaPlaceholder: "Imagem ou video principal",
      technicalSheet: "Ficha tecnica",
      viewCountryProfile: "Ver perfil do pais",
      viewOtherStories: "Ver outras historias",
      exploreMap: "Explorar mapa",
      relatedMeasuresEyebrow: "Medidas vinculadas",
      relatedMeasuresTitle: "Medidas de adaptacao relacionadas",
      relatedMeasuresText:
        "Estas fichas compartilham o pais da historia e permitem revisar a medida documentada com mais detalhe.",
      relatedMeasuresFallback:
        "Ainda nao ha fichas publicadas para este pais, mas voce pode explorar o mapa para encontrar medidas semelhantes.",
      viewRelatedMeasure: "Ver medida",
      viewCountryMeasures: "Ver medidas do pais",
      sections: [
        { title: "O desafio", text: "Descreve qual risco climatico o territorio enfrenta, quem e afetado e quais fatores aumentam a vulnerabilidade." },
        { title: "A resposta", text: "Apresenta a medida de adaptacao, quem a impulsionou e como a comunidade se organizou." },
        { title: "A historia", text: "Espaco para relato jornalistico ou testemunhal, fotografias, citacoes, audio e video." },
        { title: "Resultados e aprendizados", text: "Sintetiza mudancas observadas, beneficios, limitacoes e condicoes para replicar a experiencia." },
      ],
    },
    profiles: {
      eyebrow: "Perfis de pais",
      title: "Risco e vulnerabilidade climatica",
      text:
        "Cada perfil funciona como uma visualizacao nacional com riscos prioritarios, setores criticos, medidas identificadas e historia destacada.",
      nationalProfile: "Perfil nacional",
      viewCasesMap: "Ver casos no mapa",
      downloadPdf: "Baixar perfil PDF",
      sections: [
        "Resumo executivo",
        "Riscos climaticos prioritarios",
        "Exposicao",
        "Vulnerabilidade",
        "Marco normativo e institucional",
        "Setores criticos",
        "Zonas priorizadas",
        "Medidas de adaptacao identificadas",
        "Historia destacada",
        "Fontes",
      ],
      placeholderPrefix: "Conteudo editorial a completar com dados do perfil de",
      placeholderSuffix: "Esta estrutura deixa pronta a versao web navegavel e o link para o PDF para download.",
    },
    report: {
      eyebrow: "Relatorio regional",
      title: "RISE: risco, adaptacao e resiliencia juvenil",
      text:
        "O relatorio regional RISE reune os principais achados da analise de risco e vulnerabilidade climatica em seis paises da America Latina, junto com medidas de adaptacao e historias de resiliencia.",
      downloadPdf: "Baixar PDF",
      readOnline: "Ler online",
      cover: "Capa",
      coverTitle: "Relatorio Regional RISE",
      summaryTitle: "Resumo executivo",
      summaryText:
        "Esta versao web deixa preparada a leitura online do relatorio, seus principais achados, visualizacoes-chave, links para perfis nacionais e historias multimedia.",
      linkedProfiles: "Perfis vinculados",
      findings: [
        "Os riscos climaticos prioritarios se intensificam quando coincidem com desigualdade territorial.",
        "As medidas com maior potencial combinam solucoes baseadas na natureza, governanca local e educacao climatica.",
        "As juventudes cumprem um papel chave para comunicar riscos, ativar redes e sustentar aprendizados comunitarios.",
      ],
    },
    methodology: {
      eyebrow: "Metodologia",
      title: "Como RISE e construido",
      text:
        "A metodologia organiza o processo de revisao, analise, identificacao de medidas e producao multimedia para que perfis, fichas e historias sejam comparaveis.",
      criteriaTitle: "Criterios e alcance",
      criteriaText:
        "Estes criterios resumem o que se analisa, como os casos sao selecionados e quais limites a plataforma deve transparentar.",
      includedCountries: "Paises incluidos",
      criteria: [
        "Paises analisados: Chile, Argentina, Colombia, Mexico, Brasil e Honduras.",
        "Riscos selecionados a partir de fontes nacionais, multilaterais e tecnicas.",
        "Medidas identificadas por relevancia territorial, potencial de aprendizagem e evidencia disponivel.",
        "Historias priorizadas por protagonismo juvenil, diversidade geografica e clareza narrativa.",
        "Limitacoes: disponibilidade de dados, comparabilidade regional e atualizacao periodica do conteudo.",
      ],
    },
    case: {
      classification: "Classificacao da medida",
      locality: "Localidade",
      threat: "Ameaca",
      measureSector: "Setor / tipo de medida",
      source: "Fonte",
      viewSource: "Ver fonte",
      baseInfo: "Informacao base",
      measureSummary: "Resumo da medida",
      measureObjectives: "Objetivos da medida",
      measureObjectivesText:
        "Reduzir riscos climaticos, fortalecer a resiliencia territorial e visibilizar aprendizados que possam orientar acoes semelhantes em outros contextos.",
      beneficiaryCommunities: "Comunidades beneficiarias",
      beneficiaryCommunitiesText:
        "Comunidades locais, juventudes e organizacoes territoriais vinculadas ao caso. O detalhe quantitativo fica preparado para a base editorial completa.",
      relatedStoryEyebrow: "Historia vinculada",
      relatedStoryTitle: "Historia de resiliencia relacionada",
      relatedStoryText:
        "Esta historia compartilha o pais da medida e acrescenta contexto narrativo sobre juventudes, comunidades e aprendizados.",
      relatedStoryFallbackTitle: "Historia de resiliencia a vincular",
      relatedStoryFallbackText:
        "Ainda nao ha uma historia publicada para este pais. Voce pode explorar as historias disponiveis enquanto a relacao editorial e completada.",
      viewRelatedStory: "Ler historia",
      viewStories: "Ver historias",
      complementaryInfo: "Informacao complementar",
      complementaryPlaceholder: "Conteudo a completar com dados da ficha tecnica e fontes do caso.",
      complementarySections: [
        "Problematica climatica local",
        "Aliancas estrategicas",
        "Fatores habilitantes e condicionantes",
        "Co-beneficios",
        "Escalabilidade",
        "Sustentabilidade ao longo do tempo",
      ],
    },
    mapExplorer: {
      filters: "Filtros",
      visibleCases: "casos visiveis",
      of: "de",
      search: "Buscar",
      searchPlaceholder: "Caso, territorio ou medida",
      all: "Todos",
      country: "Pais",
      climateRisk: "Risco climatico",
      measureType: "Tipo de medida",
      ecosystem: "Ecossistema ou territorio",
      actor: "Ator impulsor",
      contentStatus: "Estado do conteudo",
      showFilters: "Mostrar filtros",
      hideFilters: "Ocultar filtros",
      clearFilters: "Limpar filtros",
      preparedFilters: "Os filtros de territorio, ator e estado ficam preparados para a base editorial completa.",
      countryTbd: "Pais TBD",
      measure: "Medida",
      territory: "Territorio",
      territoryFallback: "Territorio a completar",
      viewFullCase: "Ver ficha completa",
      statusOptions: ["Perfil disponivel", "Historia disponivel", "Video disponivel", "Relatorio disponivel"],
      severityLabels: { low: "Baixa", medium: "Media", high: "Alta", critical: "Critica" },
      riskBySeverity: { low: "Inundacao", medium: "Calor extremo", high: "Seca", critical: "Crise hidrica" },
    },
    caseCard: { viewCase: "Ver caso" },
    mapPopup: {
      country: "Pais",
      measure: "Medida",
      organization: "Organizacao",
      viewFullCase: "Ver ficha completa",
      viewCountryProfile: "Ver perfil de pais",
    },
  },
} as const;

const categoryTranslations: Record<string, Record<Locale, string>> = {
  water: {
    es: "Gestión comunitaria del agua",
    en: "Community water management",
    pt: "Gestao comunitaria da agua",
  },
  cities: {
    es: "Infraestructura verde",
    en: "Green infrastructure",
    pt: "Infraestrutura verde",
  },
  food: {
    es: "Agricultura resiliente",
    en: "Resilient agriculture",
    pt: "Agricultura resiliente",
  },
};

const caseTranslations: Record<
  string,
  Record<Locale, Pick<AdaptationCase, "title" | "shortDescription" | "fullDescription">>
> = {
  "gestion-comunitaria-agua-sequia": {
    es: {
      title: "Gestión comunitaria del agua en contexto de sequía",
      shortDescription:
        "Caso placeholder sobre gobernanza local del agua y resiliencia hídrica en territorios expuestos a sequía.",
      fullDescription:
        "Contenido placeholder. Esta página quedará conectada al backoffice para mostrar información completa, imágenes, fuentes y datos complementarios del caso.",
    },
    en: {
      title: "Community water management in a drought context",
      shortDescription:
        "Placeholder case about local water governance and water resilience in territories exposed to drought.",
      fullDescription:
        "Placeholder content. This page will be connected to the backoffice to show full information, images, sources and complementary case data.",
    },
    pt: {
      title: "Gestao comunitaria da agua em contexto de seca",
      shortDescription:
        "Caso placeholder sobre governanca local da agua e resiliencia hidrica em territorios expostos a seca.",
      fullDescription:
        "Conteudo placeholder. Esta pagina sera conectada ao backoffice para mostrar informacao completa, imagens, fontes e dados complementares do caso.",
    },
  },
  "corredores-verdes-islas-calor": {
    es: {
      title: "Corredores verdes contra islas de calor",
      shortDescription:
        "Caso placeholder sobre infraestructura verde urbana y adaptación frente al calor extremo.",
      fullDescription:
        "Contenido placeholder. Luego se reemplazará por el relato completo del caso, ubicación, imágenes y datos institucionales.",
    },
    en: {
      title: "Green corridors against heat islands",
      shortDescription:
        "Placeholder case about urban green infrastructure and adaptation to extreme heat.",
      fullDescription:
        "Placeholder content. It will later be replaced by the complete case story, location, images and institutional data.",
    },
    pt: {
      title: "Corredores verdes contra ilhas de calor",
      shortDescription:
        "Caso placeholder sobre infraestrutura verde urbana e adaptacao frente ao calor extremo.",
      fullDescription:
        "Conteudo placeholder. Depois sera substituido pelo relato completo do caso, localizacao, imagens e dados institucionais.",
    },
  },
  "agricultura-resiliente-inundaciones": {
    es: {
      title: "Agricultura resiliente frente a inundaciones",
      shortDescription:
        "Caso placeholder sobre prácticas productivas resilientes ante inundaciones y variabilidad climática.",
      fullDescription:
        "Contenido placeholder. El backoffice permitirá editar esta información y administrar múltiples imágenes.",
    },
    en: {
      title: "Resilient agriculture facing floods",
      shortDescription:
        "Placeholder case about resilient productive practices for floods and climate variability.",
      fullDescription:
        "Placeholder content. The backoffice will allow this information to be edited and multiple images to be managed.",
    },
    pt: {
      title: "Agricultura resiliente frente a inundacoes",
      shortDescription:
        "Caso placeholder sobre praticas produtivas resilientes diante de inundacoes e variabilidade climatica.",
      fullDescription:
        "Conteudo placeholder. O backoffice permitira editar esta informacao e administrar multiplas imagens.",
    },
  },
};

type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLocalizedCountries(locale: Locale) {
  return localizedCountries[locale];
}

export function getLocalizedCountryBySlug(locale: Locale, slug: string) {
  return localizedCountries[locale].find((country) => country.slug === slug);
}

export function getLocalizedContentLists(locale: Locale) {
  return contentLists[locale];
}

export function localizeCategory(category: Category, locale: Locale): Category {
  const translatedName = categoryTranslations[category.id]?.[locale] ?? categoryTranslations[category.slug]?.[locale];

  return {
    ...category,
    name: translatedName ?? category.name,
  };
}

export function localizeCategories(categories: Category[], locale: Locale) {
  return categories.map((category) => localizeCategory(category, locale));
}

export function localizeCase(item: AdaptationCase, locale: Locale): AdaptationCase {
  const translation = caseTranslations[item.slug]?.[locale];

  return {
    ...item,
    title: translation?.title ?? item.title,
    shortDescription: translation?.shortDescription ?? item.shortDescription,
    fullDescription: translation?.fullDescription ?? item.fullDescription,
    category: localizeCategory(item.category, locale),
  };
}

export function localizeCases(cases: AdaptationCase[], locale: Locale) {
  return cases.map((item) => localizeCase(item, locale));
}

export function localizeMapCase(item: MapCase, locale: Locale): MapCase {
  const translation = caseTranslations[item.slug]?.[locale];

  return {
    ...item,
    title: translation?.title ?? item.title,
    shortDescription: translation?.shortDescription ?? item.shortDescription,
    category: localizeCategory(item.category, locale),
  };
}

export function localizeMapCases(cases: MapCase[], locale: Locale) {
  return cases.map((item) => localizeMapCase(item, locale));
}
