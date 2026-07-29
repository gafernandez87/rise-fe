"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n";
import type { MapCase } from "@/types/cases";

const CasesMap = dynamic(
  () => import("@/components/map/cases-map").then((mod) => mod.CasesMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[540px] place-items-center rounded-lg border border-[color:var(--color-border)] bg-white">
        Cargando mapa...
      </div>
    ),
  },
);

const StaticCasesMap = dynamic(
  () => import("@/components/map/cases-map").then((mod) => mod.StaticCasesMap),
  {
    ssr: false,
    loading: () => <div className="rise-map-preview__loading" aria-hidden="true" />,
  },
);

export function MapLoader({
  cases,
  layoutSignal,
  locale,
}: {
  cases: MapCase[];
  layoutSignal: boolean;
  locale: Locale;
}) {
  return <CasesMap cases={cases} layoutSignal={layoutSignal} locale={locale} />;
}

export function MapPreviewLoader({
  cases,
  locale,
}: {
  cases: MapCase[];
  locale: Locale;
}) {
  return <StaticCasesMap cases={cases} locale={locale} />;
}
