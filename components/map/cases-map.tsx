"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { CountryLabel } from "@/components/countries/country-label";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import { getCountrySlugFromName } from "@/lib/rise-content";
import type { MapCase } from "@/types/cases";

const markerIcon = L.divIcon({
  className: "rise-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const latinAmericaViewBounds: L.LatLngBoundsExpression = [
  [-58, -120],
  [34, -25],
];

const latinAmericaFitPadding = L.point(24, 24);
const latinAmericaPreviewCenter: L.LatLngExpression = [-17, -66];
const navigationBounds = L.latLngBounds(latinAmericaViewBounds);

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

function MapSizeHandler({ layoutSignal }: { layoutSignal: boolean }) {
  const map = useMap();

  useEffect(() => {
    let animationFrame = 0;
    const updateBounds = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });

        const size = map.getSize();
        if (!size.x || !size.y) return;

        // Round upward so even the widest/tallest layout stays inside the tiles.
        const worldSize = map.getPixelWorldBounds(0).getSize();
        const zoomSnap = map.options.zoomSnap || 1;
        const minimumZoom = Math.max(
          0,
          Math.ceil(
            Math.log2(Math.max(size.x / worldSize.x, size.y / worldSize.y)) /
              zoomSnap,
          ) * zoomSnap,
        );
        map.setMinZoom(minimumZoom);
        map.panInsideBounds(navigationBounds, { animate: false });
      });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(map.getContainer());

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [layoutSignal, map]);

  return null;
}

function StaticMapSizeHandler() {
  const map = useMap();

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [map]);

  return null;
}

function CaseMarker({
  dict,
  item,
  locale,
  selected,
  onSelect,
}: {
  dict: ReturnType<typeof getDictionary>;
  item: MapCase;
  locale: Locale;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const marker = markerRef.current;
    if (!marker) return;
    let revealed = false;
    map.eachLayer((layer) => {
      const group = layer as L.Layer & {
        zoomToShowLayer?: (marker: L.Marker, callback: () => void) => void;
      };
      if (group.zoomToShowLayer) {
        revealed = true;
        group.zoomToShowLayer(marker, () => marker.openPopup());
      }
    });
    if (!revealed) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6));
      marker.openPopup();
    }
  }, [selected, map]);
  const countrySlug = getCountrySlugFromName(item.country);

  return (
    <Marker
      ref={markerRef}
      eventHandlers={{ click: () => onSelect?.(item.id) }}
      key={item.id}
      position={[item.latitude, item.longitude]}
      title={item.title}
      alt={item.title}
      icon={
        selected
          ? L.divIcon({
              className: "rise-marker rise-marker--selected",
              iconSize: [34, 34],
              iconAnchor: [17, 17],
              popupAnchor: [0, -17],
            })
          : markerIcon
      }
    >
      <Popup
        autoPan
        autoPanPaddingBottomRight={[16, 16]}
        autoPanPaddingTopLeft={[16, 16]}
        className="rise-map-popup"
        maxHeight={360}
        maxWidth={560}
        minWidth={280}
      >
        <div
          className={`rise-map-popup__content${item.coverImageUrl ? " rise-map-popup__content--with-image" : ""}`}
        >
          {item.coverImageUrl ? (
            <Image
              className="rise-map-popup__image"
              src={item.coverImageUrl}
              alt=""
              width={220}
              height={150}
              unoptimized
            />
          ) : null}
          <div className="rise-map-popup__body">
            <p className="rise-map-popup__title">{item.title}</p>
            <p className="rise-map-popup__description">
              {item.shortDescription}
            </p>
            <dl className="rise-map-popup__meta">
              <div>
                <dt>{dict.mapPopup.country}</dt>
                <dd>
                  <CountryLabel
                    country={item.country}
                    fallback={dict.common.tbd}
                  />
                </dd>
              </div>
              <div>
                <dt>{dict.mapPopup.measure}</dt>
                <dd>{item.measureType ?? item.category.name}</dd>
              </div>
              <div>
                <dt>{dict.mapPopup.organization}</dt>
                <dd>{dict.common.toComplete}</dd>
              </div>
            </dl>
            <div className="rise-map-popup__actions">
              <Link href={localizedPath(`/casos/${item.slug}`, locale)}>
                {dict.mapPopup.viewFullCase}
              </Link>
              {countrySlug ? (
                <Link href={localizedPath(`/perfiles/${countrySlug}`, locale)}>
                  {dict.mapPopup.viewCountryProfile}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function CasesMap({
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
  const dict = getDictionary(locale);
  const failedTiles = useRef(0);

  return (
    <MapContainer
      bounds={latinAmericaViewBounds}
      boundsOptions={{ padding: latinAmericaFitPadding }}
      className="rise-map"
      bounceAtZoomLimits={false}
      maxBounds={navigationBounds}
      maxBoundsViscosity={1}
      scrollWheelZoom
      worldCopyJump={false}
      zoomDelta={0.5}
      zoomSnap={0.5}
    >
      <MapSizeHandler layoutSignal={layoutSignal} />
      <TileLayer
        eventHandlers={{
          tileload: () => {
            failedTiles.current = 0;
          },
          tileerror: () => {
            if (++failedTiles.current >= 3) onError?.();
          },
        }}
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
          <CaseMarker
            key={item.id}
            dict={dict}
            item={item}
            locale={locale}
            selected={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export function StaticCasesMap({
  cases,
}: {
  cases: MapCase[];
  locale: Locale;
}) {
  return (
    <MapContainer
      attributionControl={false}
      boxZoom={false}
      center={latinAmericaPreviewCenter}
      className="rise-map rise-map--static"
      doubleClickZoom={false}
      dragging={false}
      keyboard={false}
      scrollWheelZoom={false}
      touchZoom={false}
      worldCopyJump={false}
      zoom={2.5}
      zoomControl={false}
      zoomSnap={0.25}
    >
      <StaticMapSizeHandler />
      <TileLayer
        className="rise-map-tile-layer"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cases.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={markerIcon}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}
