import type { Locale } from "@/lib/i18n";

const copy = {
  es: {
    noResults: "No encontramos casos con esta combinación.",
    noResultsHelp: "Prueba quitando una de las selecciones de arriba o limpia los filtros para ver todos los casos.",
    removeFilter: "Quitar filtro",
    filterHelp: "Puedes elegir varias opciones: se combinan dentro de cada grupo y se cruzan con los demás filtros.",
    mapNote: "Los puntos muestran casos documentados, no la distribución del riesgo climático.",
    youthRole: "Participación juvenil",
    copyLink: "Copiar enlace", copied: "Enlace copiado", copyFailed: "No pudimos copiar el enlace. Puedes seleccionarlo abajo.",
    print: "Imprimir ficha", citation: "Referencia de esta ficha", consulted: "Consulta", source: "Fuente del caso",
    pdfUnavailable: "PDF no disponible por el momento", image: "Imagen", video: "Abrir video", audio: "Abrir audio", material: "Abrir material", text: "Historia en texto", imageAlt: "Imagen del caso",
  },
  en: {
    noResults: "No cases match this combination.",
    noResultsHelp: "Try removing one of the selections above or clear the filters to see all cases.",
    removeFilter: "Remove filter",
    filterHelp: "Choose multiple options: options within a group are combined, then matched against the other filters.",
    mapNote: "Points show documented cases, not the distribution of climate risk.",
    youthRole: "Youth participation",
    copyLink: "Copy link", copied: "Link copied", copyFailed: "We could not copy the link. You can select it below.",
    print: "Print factsheet", citation: "Factsheet reference", consulted: "Accessed", source: "Case source",
    pdfUnavailable: "PDF currently unavailable", image: "Image", video: "Open video", audio: "Open audio", material: "Open material", text: "Text story", imageAlt: "Case image",
  },
  pt: {
    noResults: "Nenhum caso corresponde a esta combinação.",
    noResultsHelp: "Tente remover uma das seleções acima ou limpe os filtros para ver todos os casos.",
    removeFilter: "Remover filtro",
    filterHelp: "Escolha várias opções: opções do mesmo grupo são combinadas e cruzadas com os demais filtros.",
    mapNote: "Os pontos mostram casos documentados, não a distribuição do risco climático.",
    youthRole: "Participação juvenil",
    copyLink: "Copiar link", copied: "Link copiado", copyFailed: "Não foi possível copiar o link. Você pode selecioná-lo abaixo.",
    print: "Imprimir ficha", citation: "Referência da ficha", consulted: "Consulta", source: "Fonte do caso",
    pdfUnavailable: "PDF indisponível no momento", image: "Imagem", video: "Abrir vídeo", audio: "Abrir áudio", material: "Abrir material", text: "História em texto", imageAlt: "Imagem do caso",
  },
} as const;

export function getUiCopy(locale: Locale) { return copy[locale]; }
