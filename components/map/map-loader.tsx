"use client";

import { Component, type ReactNode } from "react";
import { getUiCopy } from "@/lib/ui-copy";
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
    loading: () => (
      <div className="rise-map-preview__loading" aria-hidden="true" />
    ),
  },
);

class MapBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function MapLoader({
  cases,
  layoutSignal,
  locale,
  selectedId,
  onSelect,
  onError,
}: {
  cases: MapCase[];
  layoutSignal: boolean;
  locale: Locale;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onError?: () => void;
}) {
  return (
    <MapBoundary onError={onError ?? (() => {})}>
      <CasesMap
        cases={cases}
        layoutSignal={layoutSignal}
        locale={locale}
        selectedId={selectedId}
        onSelect={onSelect}
        onError={onError}
      />
      <noscript>{getUiCopy(locale).mapFailed}</noscript>
    </MapBoundary>
  );
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
