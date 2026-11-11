"use client";

import { useState } from "react";
import type {
  ContentTranslation,
  EditorialMetadata,
  MediaMetadata,
  SourceRecord,
} from "@/types/editorial";
const inputClass =
  "min-w-0 w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm";
const actionClass =
  "rise-action rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold";

export function EditorialFields({ record }: { record?: EditorialMetadata }) {
  const [sources, setSources] = useState<SourceRecord[]>(
    record?.referenceRecords ?? [],
  );
  const [media, setMedia] = useState<MediaMetadata>(
    record?.mediaMetadata ?? {},
  );
  const [translations] = useState<ContentTranslation[]>(
    record?.translations ?? [],
  );
  const json = (value: unknown) =>
    JSON.stringify(value, (_, entry) => (entry === "" ? undefined : entry));
  const changeSource = (index: number, patch: Partial<SourceRecord>) =>
    setSources((items) =>
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  return (
    <section className="space-y-6 border-t border-[color:var(--color-border)] pt-6">
      <input type="hidden" name="referenceRecords" value={json(sources)} />
      <input type="hidden" name="mediaMetadata" value={json(media)} />
      <input type="hidden" name="translations" value={json(translations)} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fuentes y evidencia</h3>
        <p className="text-sm text-[color:var(--color-muted)]">
          Las fuentes son opcionales. Las que marques como revisadas podrán
          mostrarse públicamente.
        </p>
        {sources.map((source, index) => (
          <fieldset
            key={index}
            className="grid gap-3 rounded-lg border border-[color:var(--color-border)] p-4 md:grid-cols-2"
          >
            <legend className="px-1 font-semibold">Fuente {index + 1}</legend>
            {(
              [
                ["title", "Título"],
                ["organization", "Organización o autores"],
                ["year", "Año o fecha (YYYY / YYYY-MM-DD)"],
                ["url", "URL"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="grid gap-1 text-sm">
                {label}
                <input
                  className={inputClass}
                  type={key === "url" ? "url" : "text"}
                  value={source[key] ?? ""}
                  onChange={(event) =>
                    changeSource(index, { [key]: event.target.value })
                  }
                />
              </label>
            ))}
            <label className="grid gap-1 text-sm md:col-span-2">
              Afirmaciones respaldadas
              <textarea
                className={inputClass}
                value={source.claims ?? ""}
                onChange={(event) =>
                  changeSource(index, { claims: event.target.value })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={source.reviewed ?? false}
                onChange={(event) =>
                  changeSource(index, { reviewed: event.target.checked })
                }
              />
              Fuente revisada
            </label>
            <button
              type="button"
              className={actionClass}
              onClick={() =>
                setSources((items) => items.filter((_, i) => i !== index))
              }
            >
              Quitar fuente {index + 1}
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          className={actionClass}
          onClick={() => setSources((items) => [...items, { reviewed: false }])}
        >
          Agregar fuente
        </button>
      </div>
      <details className="rounded-lg border border-[color:var(--color-border)] p-4">
        <summary className="cursor-pointer font-semibold">
          Medios: accesibilidad, crédito y permiso
        </summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(
            [
              ["alt", "Texto alternativo"],
              ["credit", "Crédito / autoría"],
              ["permission", "Autorización o licencia (uso interno)"],
              ["language", "Idioma del material"],
              ["captionsUrl", "URL de subtítulos"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="grid gap-1 text-sm">
              {label}
              <input
                className={inputClass}
                type={key === "captionsUrl" ? "url" : "text"}
                value={media[key] ?? ""}
                onChange={(event) =>
                  setMedia({ ...media, [key]: event.target.value })
                }
              />
            </label>
          ))}
          <label className="grid gap-1 text-sm">
            Formato
            <select
              className={inputClass}
              value={media.format ?? ""}
              onChange={(event) =>
                setMedia({ ...media, format: event.target.value })
              }
            >
              <option value="">Sin indicar</option>
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Documento</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            Transcripción de audio o video
            <textarea
              className={inputClass}
              rows={5}
              value={media.transcript ?? ""}
              onChange={(event) =>
                setMedia({ ...media, transcript: event.target.value })
              }
            />
          </label>
        </div>
      </details>
    </section>
  );
}
