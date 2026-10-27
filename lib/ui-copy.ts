import type { Locale } from "@/lib/i18n";

const copy = {
  es: {
    listView: "Ver lista",
    mapView: "Ver mapa",
    selectCase: "Ubicar en el mapa",
    mapFailed:
      "No se pudo cargar el mapa. Puedes consultar los casos en la lista.",
    suggestions: "Puedes recuperar resultados quitando uno de estos filtros:",
    availableResults: "casos",
    translationMissing:
      "Esta ficha aún no tiene traducción completa al idioma seleccionado. Se muestra el contenido original.",
    publishedCases: "Casos publicados con ubicación en la plataforma",
    coverageNote:
      "El contador corresponde a los casos disponibles en el explorador; no representa todas las medidas del país ni su distribución de riesgo.",
    problem: "Problema",
    action: "Acción",
    stage: "Etapa de implementación",
    place: "Lugar",
    unknownThreat: "Amenaza no documentada",
    noResults: "No encontramos casos con esta combinación.",
    noResultsHelp:
      "Prueba quitando una de las selecciones de arriba o limpia los filtros para ver todos los casos.",
    removeFilter: "Quitar filtro",
    filterHelp:
      "Dentro de un grupo basta con coincidir con una opción (por ejemplo, Argentina o Chile). Entre grupos deben cumplirse todos los filtros (por ejemplo, país y amenaza).",
    mapNote:
      "Los puntos muestran casos documentados, no la distribución del riesgo climático.",
    youthRole: "Participación juvenil",
    copyLink: "Copiar enlace",
    copied: "Enlace copiado",
    copyFailed: "No pudimos copiar el enlace. Puedes seleccionarlo abajo.",
    print: "Imprimir ficha",
    citation: "Referencia de esta ficha",
    consulted: "Consulta",
    source: "Fuente del caso",
    pdfUnavailable: "PDF no disponible por el momento",
    image: "Imagen",
    video: "Abrir video",
    audio: "Abrir audio",
    material: "Abrir material",
    text: "Historia en texto",
    imageAlt: "Imagen del caso",
  },
  en: {
    listView: "View list",
    mapView: "View map",
    selectCase: "Locate on map",
    mapFailed: "The map could not load. You can browse the cases in the list.",
    suggestions: "Remove one of these filters to see results:",
    availableResults: "cases",
    translationMissing:
      "A complete translation is not yet available in the selected language. Original content is shown.",
    publishedCases: "Published geolocated cases on the platform",
    coverageNote:
      "This count matches the cases available in the explorer; it does not represent all measures in the country or the distribution of risk.",
    problem: "Problem",
    action: "Action",
    stage: "Implementation stage",
    place: "Place",
    unknownThreat: "Hazard not documented",
    noResults: "No cases match this combination.",
    noResultsHelp:
      "Try removing one of the selections above or clear the filters to see all cases.",
    removeFilter: "Remove filter",
    filterHelp:
      "Within a group, a case can match any selected option (Argentina or Chile). Across groups, all filters must match (country and hazard).",
    mapNote:
      "Points show documented cases, not the distribution of climate risk.",
    youthRole: "Youth participation",
    copyLink: "Copy link",
    copied: "Link copied",
    copyFailed: "We could not copy the link. You can select it below.",
    print: "Print factsheet",
    citation: "Factsheet reference",
    consulted: "Accessed",
    source: "Case source",
    pdfUnavailable: "PDF currently unavailable",
    image: "Image",
    video: "Open video",
    audio: "Open audio",
    material: "Open material",
    text: "Text story",
    imageAlt: "Case image",
  },
  pt: {
    listView: "Ver lista",
    mapView: "Ver mapa",
    selectCase: "Localizar no mapa",
    mapFailed:
      "Não foi possível carregar o mapa. Você pode consultar os casos na lista.",
    suggestions: "Remova um destes filtros para encontrar resultados:",
    availableResults: "casos",
    translationMissing:
      "Esta ficha ainda não tem tradução completa no idioma selecionado. O conteúdo original é exibido.",
    publishedCases: "Casos publicados com localização na plataforma",
    coverageNote:
      "O contador corresponde aos casos disponíveis no explorador; não representa todas as medidas do país nem a distribuição de risco.",
    problem: "Problema",
    action: "Ação",
    stage: "Etapa de implementação",
    place: "Lugar",
    unknownThreat: "Ameaça não documentada",
    noResults: "Nenhum caso corresponde a esta combinação.",
    noResultsHelp:
      "Tente remover uma das seleções acima ou limpe os filtros para ver todos os casos.",
    removeFilter: "Remover filtro",
    filterHelp:
      "Dentro de um grupo basta corresponder a uma opção (Argentina ou Chile). Entre grupos, todos os filtros devem ser atendidos (país e ameaça).",
    mapNote:
      "Os pontos mostram casos documentados, não a distribuição do risco climático.",
    youthRole: "Participação juvenil",
    copyLink: "Copiar link",
    copied: "Link copiado",
    copyFailed:
      "Não foi possível copiar o link. Você pode selecioná-lo abaixo.",
    print: "Imprimir ficha",
    citation: "Referência da ficha",
    consulted: "Consulta",
    source: "Fonte do caso",
    pdfUnavailable: "PDF indisponível no momento",
    image: "Imagem",
    video: "Abrir vídeo",
    audio: "Abrir áudio",
    material: "Abrir material",
    text: "História em texto",
    imageAlt: "Imagem do caso",
  },
} as const;

export function getUiCopy(locale: Locale) {
  return copy[locale];
}
