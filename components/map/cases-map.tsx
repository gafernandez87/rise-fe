"use client";

import { useEffect } from "react";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import type { MapCase } from "@/types/cases";

const markerIcon = L.divIcon({
  className: "rise-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const latinAmericaBounds: L.LatLngBoundsExpression = [
  [-58, -120],
  [34, -25],
];

const latinAmericaFitPadding = L.point(24, 24);

const createClusterIcon = (cluster: { getChildCount: () => number }) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 42 : count < 100 ? 48 : 54;
  const anchor = size / 2;

  return L.divIcon({
    className: "rise-marker-cluster",
    html: `<span>${count}</span>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
};

function MapBoundsHandler({ layoutSignal }: { layoutSignal: boolean }) {
  const map = useMap();

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });

      map.setMinZoom(0);
      const fitZoom = map.getBoundsZoom(latinAmericaBounds, false, latinAmericaFitPadding);
      map.setMinZoom(fitZoom);

      if (map.getZoom() < fitZoom) {
        map.setZoom(fitZoom, { animate: false });
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [layoutSignal, map]);

  return null;
}

export function CasesMap({
  cases,
  layoutSignal,
  locale,
}: {
  cases: MapCase[];
  layoutSignal: boolean;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <MapContainer
      bounds={latinAmericaBounds}
      boundsOptions={{ padding: latinAmericaFitPadding }}
      className="rise-map"
      maxBounds={latinAmericaBounds}
      maxBoundsViscosity={1}
      scrollWheelZoom
      worldCopyJump={false}
      zoomDelta={0.5}
      zoomSnap={0.5}
    >
      <MapBoundsHandler layoutSignal={layoutSignal} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        className="rise-map-tile-layer"
        noWrap
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        animate={false}
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={48}
        showCoverageOnHover={false}
        spiderfyDistanceMultiplier={1.4}
      >
        {cases.map((item) => (
          <Marker key={item.id} position={[item.latitude, item.longitude]} icon={markerIcon}>
            <Popup>
              <div className="max-w-56 space-y-2">
                {item.coverImageUrl ? (
                  <Image
                    className="h-24 w-full rounded object-cover"
                    src={item.coverImageUrl}
                    alt=""
                    width={240}
                    height={120}
                    unoptimized
                  />
                ) : null}
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{item.shortDescription}</p>
                <dl className="grid gap-1 text-xs">
                  <div>
                    <dt className="font-semibold">{dict.mapPopup.country}</dt>
                    <dd>{item.country ?? dict.common.tbd}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">{dict.mapPopup.measure}</dt>
                    <dd>{item.measureType ?? item.category.name}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">{dict.mapPopup.organization}</dt>
                    <dd>{dict.common.toComplete}</dd>
                  </div>
                </dl>
                <Link
                  href={localizedPath(`/casos/${item.slug}`, locale)}
                  className="text-xs font-semibold text-[color:var(--color-primary)]"
                >
                  {dict.mapPopup.viewFullCase}
                </Link>
                <br />
                <Link
                  href={localizedPath(`/perfiles/${item.country?.toLowerCase() ?? ""}`, locale)}
                  className="text-xs font-semibold text-[color:var(--color-primary)]"
                >
                  {dict.mapPopup.viewCountryProfile}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
