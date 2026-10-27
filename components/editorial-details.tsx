import type { Locale } from "@/lib/i18n";
import type { EditorialMetadata } from "@/types/editorial";

const labels = {
  es: {
    sources: "Fuentes revisadas",
    credit: "Crédito",
    transcript: "Transcripción",
    captions: "Subtítulos",
  },
  en: {
    sources: "Reviewed sources",
    credit: "Credit",
    transcript: "Transcript",
    captions: "Captions",
  },
  pt: {
    sources: "Fontes revisadas",
    credit: "Crédito",
    transcript: "Transcrição",
    captions: "Legendas",
  },
};

export function EditorialDetails({
  record,
  locale,
}: {
  record: EditorialMetadata;
  locale: Locale;
}) {
  const copy = labels[locale];
  const sources =
    record.referenceRecords?.filter(
      (source) => source.reviewed && source.url,
    ) ?? [];
  const media = record.mediaMetadata;
  if (
    !sources.length &&
    !media?.credit &&
    !media?.transcript &&
    !media?.captionsUrl
  )
    return null;
  return (
    <section className="page-shell pb-10">
      <div className="space-y-4 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm">
        {sources.length ? (
          <div>
            <h2 className="text-lg font-semibold">{copy.sources}</h2>
            <ul className="mt-3 space-y-3">
              {sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[color:var(--color-primary)] underline underline-offset-4"
                  >
                    {source.title || source.url}
                  </a>
                  <p className="mt-1 text-[color:var(--color-muted)]">
                    {[source.organization, source.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {source.claims ? (
                    <p className="mt-1 whitespace-pre-line">{source.claims}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {media?.credit ? (
          <p>
            {copy.credit}: {media.credit}
          </p>
        ) : null}
        {media?.captionsUrl ? (
          <a
            href={media.captionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-semibold text-[color:var(--color-primary)] underline"
          >
            {copy.captions}
          </a>
        ) : null}
        {media?.transcript ? (
          <details>
            <summary className="cursor-pointer font-semibold">
              {copy.transcript}
            </summary>
            <p className="mt-3 whitespace-pre-line leading-7">
              {media.transcript}
            </p>
          </details>
        ) : null}
      </div>
    </section>
  );
}

export function TranslationNotice({
  record,
  locale,
}: {
  record: EditorialMetadata;
  locale: Locale;
}) {
  if (
    locale === "es" ||
    record.translations?.some(
      (entry) => entry.language === locale && entry.status === "complete",
    )
  )
    return null;
  const message = {
    es: "Esta ficha aún no tiene traducción completa al idioma seleccionado. Se muestra el contenido original.",
    en: "A complete translation is not yet available in this language. Original content is shown.",
    pt: "Esta ficha ainda não tem tradução completa neste idioma. O conteúdo original é exibido.",
  }[locale];
  return (
    <p
      role="status"
      className="page-shell my-4 rounded border border-[color:var(--color-border)] bg-white p-4 text-sm"
    >
      {message}
    </p>
  );
}
