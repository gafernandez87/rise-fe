"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapLoader } from "@/components/map/map-loader";
import {
  adaptationMeasureTypes,
  actors,
  climateRisks,
  projectCountries,
  territories,
} from "@/lib/rise-content";
import type { Category, MapCase } from "@/types/cases";

type MapExplorerProps = {
  cases: MapCase[];
  categories: Category[];
};

const contentStatus = ["Perfil disponible", "Historia disponible", "Video disponible", "Informe disponible"];

const severityLabels: Record<MapCase["severity"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

function getCaseRisk(item: MapCase) {
  if (item.severity === "critical") return "Crisis hidrica";
  if (item.severity === "high") return "Sequia";
  if (item.severity === "medium") return "Calor extremo";
  return "Inundacion";
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MapExplorer({ cases, categories }: MapExplorerProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [risk, setRisk] = useState("");
  const [measure, setMeasure] = useState("");
  const [territory, setTerritory] = useState("");
  const [actor, setActor] = useState("");
  const [status, setStatus] = useState("");

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cases.filter((item) => {
      const textMatch =
        !normalizedQuery ||
        [item.title, item.shortDescription, item.country, item.region, item.category.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const countryMatch = !country || item.country === country;
      const riskMatch = !risk || getCaseRisk(item) === risk;
      const measureMatch = !measure || item.category.name === measure;

      return textMatch && countryMatch && riskMatch && measureMatch;
    });
  }, [cases, country, measure, query, risk]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm">
          <MapLoader cases={filteredCases} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article key={item.id} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {item.country ?? "Pais TBD"} · {getCaseRisk(item)}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                {item.shortDescription}
              </p>
              <dl className="mt-4 grid gap-2 text-xs text-[color:var(--color-muted)]">
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">Medida</dt>
                  <dd>{item.category.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">Territorio</dt>
                  <dd>{item.region ?? "Territorio por completar"}</dd>
                </div>
              </dl>
              <Link
                href={`/casos/${item.slug}`}
                className="mt-4 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Ver ficha completa
              </Link>
            </article>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-[color:var(--color-border)] bg-white p-4 shadow-sm lg:sticky lg:top-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              Filtros
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              {filteredCases.length} de {cases.length} casos visibles
            </p>
          </div>
          <label className="grid gap-1 text-sm font-medium">
            Buscar
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-normal"
              placeholder="Caso, territorio o medida"
            />
          </label>
          <SelectFilter
            label="Pais"
            value={country}
            options={projectCountries.map((item) => item.name)}
            onChange={setCountry}
          />
          <SelectFilter
            label="Riesgo climatico"
            value={risk}
            options={climateRisks}
            onChange={setRisk}
          />
          <SelectFilter
            label="Tipo de medida"
            value={measure}
            options={[...new Set([...categories.map((item) => item.name), ...adaptationMeasureTypes])]}
            onChange={setMeasure}
          />
          <SelectFilter
            label="Ecosistema o territorio"
            value={territory}
            options={territories}
            onChange={setTerritory}
          />
          <SelectFilter label="Actor impulsor" value={actor} options={actors} onChange={setActor} />
          <SelectFilter label="Estado del contenido" value={status} options={contentStatus} onChange={setStatus} />
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCountry("");
              setRisk("");
              setMeasure("");
              setTerritory("");
              setActor("");
              setStatus("");
            }}
            className="w-full rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
          >
            Limpiar filtros
          </button>
          <div className="rounded-md bg-[color:var(--color-surface-muted)] p-3 text-xs leading-5 text-[color:var(--color-muted)]">
            Los filtros de territorio, actor y estado quedan preparados para la base editorial completa.
          </div>
        </div>
      </aside>
    </div>
  );
}

export { severityLabels };
