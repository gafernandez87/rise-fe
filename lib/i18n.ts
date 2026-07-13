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
  es: [
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
  ],
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
    adaptationMeasureTypes: [
      "Infraestructura verde",
      "Soluciones basadas en la naturaleza",
      "Educacion climatica",
      "Gestion comunitaria del agua",
      "Restauracion ecologica",
      "Alerta temprana",
      "Gobernanza local",
      "Agricultura resiliente",
    ],
    climateRisks: [
      "Sequia",
      "Inundacion",
      "Calor extremo",
      "Incendios",
      "Subida del nivel del mar",
      "Perdida de biodiversidad",
      "Crisis hidrica",
      "Deslizamientos",
    ],
    territories: ["Urbano", "Rural", "Costero", "Montana", "Bosque", "Cuenca", "Humedal", "Zona arida"],
    actors: [
      "Juventudes",
      "Comunidad local",
      "Organizacion social",
      "Gobierno local",
      "Academia",
      "Alianza publico-comunitaria",
    ],
    methodologySteps: [
      { title: "Revision documental", description: "Revision de fuentes nacionales, multilaterales y tecnicas." },
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
    ],
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
    language: { label: "Idioma", spanish: "Espanol", english: "Ingles", portuguese: "Portugues" },
    metadata: {
      description:
        "Plataforma regional de medidas de adaptacion e historias de resiliencia lideradas por juventudes en America Latina.",
      ogDescription: "Explora casos, perfiles nacionales e historias de resiliencia en America Latina.",
    },
    common: {
      cases: "casos",
      publishedCases: "casos publicados",
      tbd: "TBD",
      toComplete: "Por completar",
      latinAmerica: "America Latina",
      stage: "Etapa",
      country: "Pais",
      region: "Region",
      latitude: "Latitud",
      longitude: "Longitud",
      mainRisk: "Riesgo principal",
      mostAffectedSector: "Sector mas afectado",
      prioritizedTerritory: "Territorio priorizado",
      identifiedMeasures: "Medidas identificadas",
      involvedActors: "Actores involucrados",
      youthCommunityAllies: "Juventudes, comunidad local y organizaciones aliadas",
    },
    footer: {
      findUsOn: "Encuéntranos en:",
    },
    home: {
      eyebrow: "Adaptacion climatica liderada por juventudes",
      intro:
        "Una plataforma regional para identificar, documentar y visibilizar medidas de adaptacion e historias de resiliencia lideradas por juventudes en America Latina.",
      ctaMap: "Explorar el mapa",
      ctaStories: "Ver historias de resiliencia",
      ctaReport: "Descargar informe regional",
      mapCardTitle: "Mapa regional de riesgos, medidas e historias",
      aboutEyebrow: "Que es RISE",
      aboutTitle: "Conocimiento, territorio y resiliencia",
      aboutText: [
        "RISE es una iniciativa regional de CLAAC que busca fortalecer la accion climatica en America Latina mediante la generacion de conocimiento, documentacion de experiencias territoriales y visibilizacion de soluciones de adaptacion y resiliencia.",
        "El proyecto trabaja en Chile, Argentina, Colombia, Mexico, Brasil y Honduras para desarrollar perfiles de riesgo y vulnerabilidad climatica, identificar medidas de adaptacion existentes y contar historias sobre juventudes frente al cambio climatico.",
      ],
      introCards: [
        {
          title: "Historias de resiliencia",
          href: "/historias",
          text: "Relatos multimedia sobre comunidades, juventudes y soluciones locales.",
        },
        {
          title: "Medidas de adaptacion",
          href: "/mapa",
          text: "Documentacion de acciones que ya estan fortaleciendo la resiliencia.",
        },
        {
          title: "Riesgos climaticos",
          href: "/perfiles",
          text: "Identificacion de amenazas, exposicion y vulnerabilidades por pais.",
        },
      ],
      profilesEyebrow: "Perfiles de pais",
      profilesTitle: "Seis diagnosticos nacionales",
      viewProfiles: "Ver perfiles",
      viewProfile: "Ver perfil",
      storiesEyebrow: "Historias de resiliencia",
      storiesTitle: "Conoce los 6 casos mas destacados",
      viewStories: "Ver historias",
      mapEyebrow: "Mapa interactivo",
      casesTitle: "Primeras fichas de casos",
      exploreMap: "Explorar mapa",
      reportEyebrow: "Informe regional",
      reportTitle: "Hallazgos regionales y metodologia",
      reportText:
        "El informe regional RISE reune analisis de riesgo, medidas de adaptacion e historias de resiliencia de seis paises de America Latina.",
      readOnline: "Leer online",
      learnMethodology: "Conocer metodologia",
      findings: [
        "Los impactos climaticos combinan amenazas fisicas con desigualdades territoriales preexistentes.",
        "Las juventudes aportan organizacion, comunicacion y aprendizaje comunitario en medidas de adaptacion.",
        "Las soluciones mas replicables conectan evidencia tecnica, saber local y alianzas institucionales.",
      ],
      methodologyEyebrow: "Metodologia",
      methodologyTitle: "Como se documenta RISE",
      projectBy: "Un proyecto de:",
      organizationsEyebrow: "Organizaciones",
      organizationsTitle: "Esta iniciativa es impulsada por",
      leading: "Impulsan",
      support: "Con el apoyo de",
      participants: "Organizaciones participantes",
    },
    map: {
      eyebrow: "Mapa interactivo",
      title: "Explora casos, paises y medidas",
      text:
        "Visualiza los seis paises del proyecto, las medidas de adaptacion identificadas, historias destacadas y enlaces a fichas completas.",
    },
    stories: {
      eyebrow: "Historias de resiliencia",
      title: "Conoce los 6 casos mas destacados de Latinoamerica",
      text:
        "Relatos multimedia que conectan riesgos climaticos con respuestas concretas impulsadas por juventudes, comunidades y organizaciones territoriales.",
      videoPlaceholder: "Video + descripcion",
      storyAboutPrefix: "Historia destacada sobre",
      storyAboutMiddle: "en",
      viewStory: "Ver historia",
      heroTextPrefix: "Una historia multimedia sobre juventudes, comunidades y medidas de adaptacion frente a",
      mediaPlaceholder: "Imagen o video principal",
      technicalSheet: "Ficha tecnica",
      viewCountryProfile: "Ver perfil del pais",
      viewOtherStories: "Ver otras historias",
      exploreMap: "Explorar mapa",
      sections: [
        {
          title: "El desafio",
          text: "Describe que riesgo climatico enfrenta el territorio, a quienes afecta y que factores aumentan la vulnerabilidad.",
        },
        {
          title: "La respuesta",
          text: "Presenta la medida de adaptacion, quienes la impulsaron y como se organizo la comunidad.",
        },
        {
          title: "La historia",
          text: "Espacio para el relato periodistico o testimonial, fotografias, citas, audio y video.",
        },
        {
          title: "Resultados y aprendizajes",
          text: "Sintetiza cambios observados, beneficios, limitaciones y condiciones para replicar la experiencia.",
        },
      ],
    },
    profiles: {
      eyebrow: "Perfiles de pais",
      title: "Riesgo y vulnerabilidad climatica",
      text:
        "Cada perfil funciona como una visualizacion nacional con riesgos prioritarios, sectores criticos, medidas identificadas e historia destacada.",
      nationalProfile: "Perfil nacional",
      viewCasesMap: "Ver casos en el mapa",
      downloadPdf: "Descargar perfil PDF",
      sections: [
        "Resumen ejecutivo",
        "Riesgos climaticos prioritarios",
        "Exposicion",
        "Vulnerabilidad",
        "Marco normativo e institucional",
        "Sectores criticos",
        "Zonas priorizadas",
        "Medidas de adaptacion identificadas",
        "Historia destacada",
        "Fuentes",
      ],
      placeholderPrefix: "Contenido editorial por completar con datos del perfil de",
      placeholderSuffix: "Esta estructura deja lista la version web navegable y el enlace al PDF descargable.",
    },
    report: {
      eyebrow: "Informe regional",
      title: "RISE: riesgo, adaptacion y resiliencia juvenil",
      text:
        "El informe regional RISE reune los principales hallazgos del analisis de riesgo y vulnerabilidad climatica en seis paises de America Latina, junto con medidas de adaptacion e historias de resiliencia.",
      downloadPdf: "Descargar PDF",
      readOnline: "Leer online",
      cover: "Portada",
      coverTitle: "Informe Regional RISE",
      summaryTitle: "Resumen ejecutivo",
      summaryText:
        "Esta version web deja preparada la lectura online del informe, sus principales hallazgos, visualizaciones clave, enlaces a perfiles nacionales e historias multimedia.",
      linkedProfiles: "Perfiles vinculados",
      findings: [
        "Los riesgos climaticos prioritarios se intensifican cuando coinciden con desigualdad territorial.",
        "Las medidas con mayor potencial combinan soluciones basadas en la naturaleza, gobernanza local y educacion climatica.",
        "Las juventudes cumplen un rol clave para comunicar riesgos, activar redes y sostener aprendizajes comunitarios.",
      ],
    },
    methodology: {
      eyebrow: "Metodologia",
      title: "Como se construye RISE",
      text:
        "La metodologia organiza el proceso de revision, analisis, identificacion de medidas y produccion multimedia para que los perfiles, fichas e historias sean comparables.",
      criteriaTitle: "Criterios y alcance",
      criteriaText:
        "Estos criterios resumen que se analiza, como se seleccionan los casos y que limites debe transparentar la plataforma.",
      includedCountries: "Paises incluidos",
      criteria: [
        "Paises analizados: Chile, Argentina, Colombia, Mexico, Brasil y Honduras.",
        "Riesgos seleccionados a partir de fuentes nacionales, multilaterales y tecnicas.",
        "Medidas identificadas por relevancia territorial, potencial de aprendizaje y evidencia disponible.",
        "Historias priorizadas por protagonismo juvenil, diversidad geografica y claridad narrativa.",
        "Limitaciones: disponibilidad de datos, comparabilidad regional y actualizacion periodica del contenido.",
      ],
    },
    case: {
      classification: "Clasificacion de la medida",
      locality: "Localidad",
      threat: "Amenaza",
      measureSector: "Sector / tipo de medida",
      source: "Fuente",
      viewSource: "Ver fuente",
      baseInfo: "Informacion base",
      measureSummary: "Resumen de la medida",
      measureObjectives: "Objetivos de la medida",
      measureObjectivesText:
        "Reducir riesgos climaticos, fortalecer la resiliencia territorial y visibilizar aprendizajes que puedan orientar acciones similares en otros contextos.",
      beneficiaryCommunities: "Comunidades beneficiarias",
      beneficiaryCommunitiesText:
        "Comunidades locales, juventudes y organizaciones territoriales vinculadas al caso. El detalle cuantitativo queda preparado para la base editorial completa.",
      complementaryInfo: "Informacion complementaria",
      complementaryPlaceholder: "Contenido por completar con datos de la ficha tecnica y fuentes del caso.",
      complementarySections: [
        "Problematica climatica local",
        "Alianzas estrategicas",
        "Factores habilitantes y condicionantes",
        "Co-beneficios",
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
      country: "Pais",
      climateRisk: "Riesgo climatico",
      measureType: "Tipo de medida",
      ecosystem: "Ecosistema o territorio",
      actor: "Actor impulsor",
      contentStatus: "Estado del contenido",
      showFilters: "Mostrar filtros",
      hideFilters: "Ocultar filtros",
      clearFilters: "Limpiar filtros",
      preparedFilters: "Los filtros de territorio, actor y estado quedan preparados para la base editorial completa.",
      countryTbd: "Pais TBD",
      measure: "Medida",
      territory: "Territorio",
      territoryFallback: "Territorio por completar",
      viewFullCase: "Ver ficha completa",
      statusOptions: ["Perfil disponible", "Historia disponible", "Video disponible", "Informe disponible"],
      severityLabels: { low: "Baja", medium: "Media", high: "Alta", critical: "Critica" },
      riskBySeverity: {
        low: "Inundacion",
        medium: "Calor extremo",
        high: "Sequia",
        critical: "Crisis hidrica",
      },
    },
    caseCard: {
      viewCase: "Ver caso",
    },
    mapPopup: {
      country: "Pais",
      measure: "Medida",
      organization: "Organizacion",
      viewFullCase: "Ver ficha completa",
      viewCountryProfile: "Ver perfil de pais",
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
    es: "Gestion comunitaria del agua",
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
      title: "Gestion comunitaria del agua en contexto de sequia",
      shortDescription:
        "Caso placeholder sobre gobernanza local del agua y resiliencia hidrica en territorios expuestos a sequia.",
      fullDescription:
        "Contenido placeholder. Esta pagina quedara conectada al backoffice para mostrar informacion completa, imagenes, fuentes y datos complementarios del caso.",
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
        "Caso placeholder sobre infraestructura verde urbana y adaptacion frente al calor extremo.",
      fullDescription:
        "Contenido placeholder. Luego se reemplazara por el relato completo del caso, ubicacion, imagenes y datos institucionales.",
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
        "Caso placeholder sobre practicas productivas resilientes ante inundaciones y variabilidad climatica.",
      fullDescription:
        "Contenido placeholder. El backoffice permitira editar esta informacion y administrar multiples imagenes.",
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
