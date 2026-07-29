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

const latinAmericaViewBounds: L.LatLngBoundsExpression = [
  [-58, -120],
  [34, -25],
];

const latinAmericaPanBounds: L.LatLngBoundsExpression = [
  [-68, -130],
  [48, -15],
];

const latinAmericaFitPadding = L.point(24, 24);
const latinAmericaPreviewCenter: L.LatLngExpression = [-17, -66];
const defaultPopupOffset = L.point(0, 7);
const popupEdgePadding = 36;
const popupBelowGap = 28;

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
      const fitZoom = map.getBoundsZoom(latinAmericaViewBounds, false, latinAmericaFitPadding);
      map.setMinZoom(fitZoom);

      if (map.getZoom() < fitZoom) {
        map.setZoom(fitZoom, { animate: false });
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
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

function positionPopupFromMarker(popup: L.Popup, map: L.Map, item: MapCase) {
  const element = popup.getElement();

  if (!element) {
    return;
  }

  const markerPoint = map.latLngToContainerPoint([item.latitude, item.longitude]);
  const popupHeight = element.offsetHeight;
  const shouldOpenBelow = markerPoint.y < popupHeight + popupEdgePadding;

  popup.options.offset = shouldOpenBelow ? L.point(0, popupHeight + popupBelowGap) : defaultPopupOffset;
  element.classList.toggle("rise-map-popup--below", shouldOpenBelow);
  popup.update();
}

function CaseMarker({
  dict,
  item,
  locale,
}: {
  dict: ReturnType<typeof getDictionary>;
  item: MapCase;
  locale: Locale;
}) {
  const map = useMap();

  return (
    <Marker
      key={item.id}
      position={[item.latitude, item.longitude]}
      icon={markerIcon}
      eventHandlers={{
        popupopen: (event) => {
          window.requestAnimationFrame(() => positionPopupFromMarker(event.popup, map, item));
        },
      }}
    >
      <Popup
        autoPanPaddingBottomRight={[32, 32]}
        autoPanPaddingTopLeft={[32, 32]}
        className="rise-map-popup"
        maxWidth={560}
        minWidth={280}
      >
        <div className={`rise-map-popup__content${item.coverImageUrl ? " rise-map-popup__content--with-image" : ""}`}>
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
            <p className="rise-map-popup__description">{item.shortDescription}</p>
            <dl className="rise-map-popup__meta">
              <div>
                <dt>{dict.mapPopup.country}</dt>
                <dd>{item.country ?? dict.common.tbd}</dd>
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
              <Link href={localizedPath(`/perfiles/${item.country?.toLowerCase() ?? ""}`, locale)}>
                {dict.mapPopup.viewCountryProfile}
              </Link>
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
}: {
  cases: MapCase[];
  layoutSignal: boolean;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <MapContainer
      bounds={latinAmericaViewBounds}
      boundsOptions={{ padding: latinAmericaFitPadding }}
      className="rise-map"
      maxBounds={latinAmericaPanBounds}
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
          <CaseMarker key={item.id} dict={dict} item={item} locale={locale} />
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
