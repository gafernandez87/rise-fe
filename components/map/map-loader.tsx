"use client";

import dynamic from "next/dynamic";
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

export function MapLoader({ cases }: { cases: MapCase[] }) {
  return <CasesMap cases={cases} />;
}
