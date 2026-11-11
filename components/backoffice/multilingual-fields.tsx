"use client";

import { useState, type ReactNode } from "react";
import type { EditorialMetadata } from "@/types/editorial";
import { FormLanguageContext } from "./form-fields";

const languages = [{ id: "es", label: "Español" }, { id: "en", label: "English" }, { id: "pt", label: "Português" }];
export function MultilingualFields({ record, children }: { record?: EditorialMetadata; children: ReactNode }) {
  const [active, setActive] = useState("es");
  return (
    <div className="space-y-5">
      <div aria-label="Idioma del contenido" className="flex flex-wrap gap-2">
        {languages.map(({ id, label }) => <button key={id} type="button" aria-pressed={active === id} onClick={() => setActive(id)} className={`rise-action rounded-md border px-4 py-2 text-sm font-semibold ${active === id ? "bg-[color:var(--color-primary)] text-white" : "bg-white"}`}>{label}</button>)}
      </div>
      <p className="text-sm text-[color:var(--color-muted)]">Cargá los textos en cada idioma. Los datos comunes, enlaces y coordenadas se editan en Español. Guardar conserva los tres idiomas. En registros publicados, los textos guardados se muestran en el idioma de la página.</p>
      {languages.map(({ id, label }) => (
        <div key={id} hidden={active !== id} onInvalidCapture={() => setActive(id)}>
          <FormLanguageContext.Provider value={{ language: id, translations: record?.translations }}>
            <div className="space-y-6" aria-label={`Contenido en ${label}`}>
              {id !== "es" ? <label className="grid max-w-sm gap-1 text-sm font-medium">Avance de la carga en {label}
                <select name={`translation.${id}.status`} defaultValue={record?.translations?.find((item) => item.language === id)?.status ?? "pending"} className="rounded-md border bg-white px-3 py-2">
                  <option value="pending">Pendiente</option><option value="in_progress">En preparación</option><option value="complete">Completa</option>
                </select>
              </label> : null}
              {children}
            </div>
          </FormLanguageContext.Provider>
        </div>
      ))}
    </div>
  );
}
